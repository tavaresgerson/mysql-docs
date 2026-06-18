#### 6.5.1.1 mysql Client Options

[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") supports the following options, which
can be specified on the command line or in the
`[mysql]` and `[client]`
groups of an option file. For information about option files
used by MySQL programs, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.12 mysql Client Options**

<table frame="box" rules="all" summary="Command-line options available for the mysql client."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_authentication-oci-client-config-profile">--authentication-oci-client-config-profile</a></th>
<td>Name of the OCI profile defined in the OCI config file to use</td>
<td>8.0.33</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--auto-rehash</a></th>
<td>Enable automatic rehashing</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-vertical-output">--auto-vertical-output</a></th>
<td>Enable automatic vertical result set display</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_batch">--batch</a></th>
<td>Do not use history file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_binary-as-hex">--binary-as-hex</a></th>
<td>Display binary values in hexadecimal notation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_binary-mode">--binary-mode</a></th>
<td>Disable \r\n - to - \n translation and treatment of \0 as end-of-query</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_column-names">--column-names</a></th>
<td>Write column names in results</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_column-type-info">--column-type-info</a></th>
<td>Display result set metadata</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_commands">--commands</a></th>
<td>Enable or disable processing of local mysql client commands</td>
<td>8.0.43</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_comments">--comments</a></th>
<td>Whether to retain or strip comments in statements sent to the server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_connect-expired-password">--connect-expired-password</a></th>
<td>Indicate to server that client can handle expired-password sandbox mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_connect-timeout">--connect-timeout</a></th>
<td>Number of seconds before connection timeout</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_database">--database</a></th>
<td>The database to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug">--debug</a></th>
<td>Write debugging log; supported only if MySQL was built with debugging support</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_delimiter">--delimiter</a></th>
<td>Set the statement delimiter</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_dns-srv-name">--dns-srv-name</a></th>
<td>Use DNS SRV lookup for host information</td>
<td>8.0.22</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_execute">--execute</a></th>
<td>Execute the statement and quit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_fido-register-factor">--fido-register-factor</a></th>
<td>Multifactor authentication factors for which registration must be done</td>
<td>8.0.27</td>
<td>8.0.35</td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_histignore">--histignore</a></th>
<td>Patterns specifying which statements to ignore for logging</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_html">--html</a></th>
<td>Produce HTML output</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ignore-spaces">--ignore-spaces</a></th>
<td>Ignore spaces after function names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_init-command">--init-command</a></th>
<td>SQL statement to execute after connecting</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_line-numbers">--line-numbers</a></th>
<td>Write line numbers for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_load-data-local-dir">--load-data-local-dir</a></th>
<td>Directory for files named in LOAD DATA LOCAL statements</td>
<td>8.0.21</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_local-infile">--local-infile</a></th>
<td>Enable or disable for LOCAL capability for LOAD DATA</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_max-allowed-packet">--max-allowed-packet</a></th>
<td>Maximum packet length to send to or receive from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_max-join-size">--max-join-size</a></th>
<td>The automatic limit for rows in a join when using --safe-updates</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--named-commands</a></th>
<td>Enable named mysql commands</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_net-buffer-length">--net-buffer-length</a></th>
<td>Buffer size for TCP/IP and socket communication</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_network-namespace">--network-namespace</a></th>
<td>Specify network namespace</td>
<td>8.0.22</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-auto-rehash">--no-auto-rehash</a></th>
<td>Disable automatic rehashing</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-beep">--no-beep</a></th>
<td>Do not beep when errors occur</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row">--oci-config-file</th>
<td>Defines an alternate location for the Oracle Cloud Infrastructure CLI configuration file.</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_one-database">--one-database</a></th>
<td>Ignore statements except those for the default database named on the command line</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pager">--pager</a></th>
<td>Use the given command for paging query output</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_plugin-authentication-kerberos-client-mode">--plugin-authentication-kerberos-client-mode</a></th>
<td>Permit GSSAPI pluggable authentication through the MIT Kerberos library on Windows</td>
<td>8.0.32</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_prompt">--prompt</a></th>
<td>Set the prompt to the specified format</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_quick">--quick</a></th>
<td>Do not cache each query result</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_raw">--raw</a></th>
<td>Write column values without escape conversion</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--reconnect</a></th>
<td>If the connection to the server is lost, automatically try to reconnect</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--safe-updates</a>, <a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--i-am-a-dummy</a></th>
<td>Allow only UPDATE and DELETE statements that specify key values</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_select-limit">--select-limit</a></th>
<td>The automatic limit for SELECT statements when using --safe-updates</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_show-warnings">--show-warnings</a></th>
<td>Show warnings after each statement if there are any</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_sigint-ignore">--sigint-ignore</a></th>
<td>Ignore SIGINT signals (typically the result of typing Control+C)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--skip-auto-rehash</a></th>
<td>Disable automatic rehashing</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_skip-column-names">--skip-column-names</a></th>
<td>Do not write column names in results</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_skip-line-numbers">--skip-line-numbers</a></th>
<td>Skip line numbers for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--skip-named-commands</a></th>
<td>Disable named mysql commands</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pager">--skip-pager</a></th>
<td>Disable paging</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--skip-reconnect</a></th>
<td>Disable reconnecting</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_skip-system-command">--skip-system-command</a></th>
<td>Disable system (\!) command</td>
<td>8.0.40</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_syslog">--syslog</a></th>
<td>Log interactive statements to syslog</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_system-command">--system-command</a></th>
<td>Enable or disable system (\!) command</td>
<td>8.0.40</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_table">--table</a></th>
<td>Display output in tabular format</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_tee">--tee</a></th>
<td>Append a copy of output to named file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_unbuffered">--unbuffered</a></th>
<td>Flush the buffer after each query</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_vertical">--vertical</a></th>
<td>Print query output rows vertically (one line per column value)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_wait">--wait</a></th>
<td>If the connection cannot be established, wait and retry instead of aborting</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_xml">--xml</a></th>
<td>Produce XML output</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>

* [`--help`](mysql-command-options.html#option_mysql_help), `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--authentication-oci-client-config-profile`](mysql-command-options.html#option_mysql_authentication-oci-client-config-profile)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>

  Specify the name of the OCI configuration profile to use. If
  not set, the default profile is used.

* [`--auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash)

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>

  Enable automatic rehashing. This option is on by default,
  which enables database, table, and column name completion.
  Use
  [`--disable-auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash)
  to disable rehashing. That causes [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  to start faster, but you must issue the
  `rehash` command or its
  `\#` shortcut if you want to use name
  completion.

  To complete a name, enter the first part and press Tab. If
  the name is unambiguous, [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") completes
  it. Otherwise, you can press Tab again to see the possible
  names that begin with what you have typed so far. Completion
  does not occur if there is no default database.

  Note

  This feature requires a MySQL client that is compiled with
  the **readline** library.
  Typically, the **readline**
  library is not available on Windows.

* [`--auto-vertical-output`](mysql-command-options.html#option_mysql_auto-vertical-output)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>

  Cause result sets to be displayed vertically if they are too
  wide for the current window, and using normal tabular format
  otherwise. (This applies to statements terminated by
  `;` or `\G`.)

* [`--batch`](mysql-command-options.html#option_mysql_batch), `-B`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>

  Print results using tab as the column separator, with each
  row on a new line. With this option,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") does not use the history file.

  Batch mode results in nontabular output format and escaping
  of special characters. Escaping may be disabled by using raw
  mode; see the description for the
  [`--raw`](mysql-command-options.html#option_mysql_raw) option.

* [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>

  When this option is given, [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") displays
  binary data using hexadecimal notation
  (`0xvalue`).
  This occurs whether the overall output display format is
  tabular, vertical, HTML, or XML.

  [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex) when enabled
  affects display of all binary strings, including those
  returned by functions such as
  [`CHAR()`](string-functions.html#function_char) and
  [`UNHEX()`](string-functions.html#function_unhex). The following
  example demonstrates this using the ASCII code for
  `A` (65 decimal, 41 hexadecimal):

  + [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex) disabled:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

  + [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex) enabled:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

  To write a binary string expression so that it displays as a
  character string regardless of whether
  [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex) is enabled,
  use these techniques:

  + The [`CHAR()`](string-functions.html#function_char) function has a
    `USING
    charset` clause:

    ```
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

  + More generally, use
    [`CONVERT()`](cast-functions.html#function_convert) to convert an
    expression to a given character set:

    ```
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

  As of MySQL 8.0.19, when [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") operates
  in interactive mode, this option is enabled by default. In
  addition, output from the `status` (or
  `\s`) command includes this line when the
  option is enabled implicitly or explicitly:

  ```
  Binary data as: Hexadecimal
  ```

  To disable hexadecimal notation, use
  [`--skip-binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex)

* [`--binary-mode`](mysql-command-options.html#option_mysql_binary-mode)

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>

  This option helps when processing
  [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") output that may contain
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") values. By default,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") translates `\r\n`
  in statement strings to `\n` and interprets
  `\0` as the statement terminator.
  [`--binary-mode`](mysql-command-options.html#option_mysql_binary-mode) disables both
  features. It also disables all [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  commands except `charset` and
  `delimiter` in noninteractive mode (for
  input piped to [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") or loaded using the
  `source` command).

  (*MySQL 8.0.43 and later:*)
  `--binary-mode`, when enabled, causes the
  server to disregard any setting for
  [`--commands`](mysql-command-options.html#option_mysql_commands) .

* [`--bind-address=ip_address`](mysql-command-options.html#option_mysql_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>

  On a computer having multiple network interfaces, use this
  option to select which interface to use for connecting to
  the MySQL server.

* [`--character-sets-dir=dir_name`](mysql-command-options.html#option_mysql_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--column-names`](mysql-command-options.html#option_mysql_column-names)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  Write column names in results.

* [`--column-type-info`](mysql-command-options.html#option_mysql_column-type-info)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  Display result set metadata. This information corresponds to
  the contents of C API `MYSQL_FIELD` data
  structures. See [C API Basic Data Structures](/doc/c-api/8.0/en/c-api-data-structures.html).

* [`--commands`](mysql-command-options.html#option_mysql_commands)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  Whether to enable or disable processing of local
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client commands. Setting this
  option to `FALSE` disables such processing,
  and has the effects listed here:

  + The following [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client commands
    are disabled:

    - `charset` (`/C`
      remains enabled)

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
    - `\u` (`use` is
      passed to the server)

    - `warnings`
  + The `\C` and
    `delimiter` commands remain enabled.

  + The [`--system-command`](mysql-command-options.html#option_mysql_system-command)
    option is ignored, and has no effect.

  This option has no effect when
  [`--binary-mode`](mysql-command-options.html#option_mysql_binary-mode) is enabled.

  When `--commands` is enabled, it is possible
  to disable (only) the system command using the
  [`--system-command`](mysql-command-options.html#option_mysql_system-command) option.

  This option was added in MySQL 8.0.43.

* [`--comments`](mysql-command-options.html#option_mysql_comments),
  `-c`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>3

  Whether to strip or preserve comments in statements sent to
  the server. The default is
  [`--skip-comments`](mysql-command-options.html#option_mysql_comments)
  (strip comments), enable with
  [`--comments`](mysql-command-options.html#option_mysql_comments) (preserve
  comments).

  Note

  The [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client always passes
  optimizer hints to the server, regardless of whether this
  option is given.

  Comment stripping is deprecated. Expect this feature and
  the options to control it to be removed in a future MySQL
  release.

* [`--compress`](mysql-command-options.html#option_mysql_compress),
  `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  Compress all information sent between the client and the
  server if possible. See
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  As of MySQL 8.0.18, this option is deprecated. Expect it to
  be removed in a future version of MySQL. See
  [Configuring Legacy Connection Compression](connection-compression-control.html#connection-compression-legacy-configuration "Configuring Legacy Connection Compression").

* [`--compression-algorithms=value`](mysql-command-options.html#option_mysql_compression-algorithms)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  The permitted compression algorithms for connections to the
  server. The available algorithms are the same as for the
  [`protocol_compression_algorithms`](server-system-variables.html#sysvar_protocol_compression_algorithms)
  system variable. The default value is
  `uncompressed`.

  For more information, see
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  This option was added in MySQL 8.0.18.

* [`--connect-expired-password`](mysql-command-options.html#option_mysql_connect-expired-password)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  Indicate to the server that the client can handle sandbox
  mode if the account used to connect has an expired password.
  This can be useful for noninteractive invocations of
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") because normally the server
  disconnects noninteractive clients that attempt to connect
  using an account with an expired password. (See
  [Section 8.2.16, “Server Handling of Expired Passwords”](expired-password-handling.html "8.2.16 Server Handling of Expired Passwords").)

* [`--connect-timeout=value`](mysql-command-options.html#option_mysql_connect-timeout)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>7

  The number of seconds before connection timeout. (Default
  value is `0`.)

* [`--database=db_name`](mysql-command-options.html#option_mysql_database),
  `-D db_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>8

  The database to use. This is useful primarily in an option
  file.

* [`--debug[=debug_options]`](mysql-command-options.html#option_mysql_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>9

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is `d:t:o,/tmp/mysql.trace`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-check`](mysql-command-options.html#option_mysql_debug-check)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>0

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-info`](mysql-command-options.html#option_mysql_debug-info),
  `-T`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>1

  Print debugging information and memory and CPU usage
  statistics when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--default-auth=plugin`](mysql-command-options.html#option_mysql_default-auth)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>2

  A hint about which client-side authentication plugin to use.
  See [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--default-character-set=charset_name`](mysql-command-options.html#option_mysql_default-character-set)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>3

  Use *`charset_name`* as the default
  character set for the client and connection.

  This option can be useful if the operating system uses one
  character set and the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client by
  default uses another. In this case, output may be formatted
  incorrectly. You can usually fix such issues by using this
  option to force the client to use the system character set
  instead.

  For more information, see
  [Section 12.4, “Connection Character Sets and Collations”](charset-connection.html "12.4 Connection Character Sets and Collations"), and
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--defaults-extra-file=file_name`](mysql-command-options.html#option_mysql_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>4

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysql-command-options.html#option_mysql_defaults-file)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>5

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  Exception: Even with
  [`--defaults-file`](option-file-options.html#option_general_defaults-file), client
  programs read `.mylogin.cnf`.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysql-command-options.html#option_mysql_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>6

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") normally reads the
  `[client]` and `[mysql]`
  groups. If this option is given as
  [`--defaults-group-suffix=_other`](mysql-command-options.html#option_mysql_defaults-group-suffix),
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") also reads the
  `[client_other]` and
  `[mysql_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--delimiter=str`](mysql-command-options.html#option_mysql_delimiter)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>7

  Set the statement delimiter. The default is the semicolon
  character (`;`).

* [`--disable-named-commands`](mysql-command-options.html#option_mysql_disable-named-commands)

  Disable named commands. Use the `\*` form
  only, or use named commands only at the beginning of a line
  ending with a semicolon (`;`).
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") starts with this option
  *enabled* by default. However, even with
  this option, long-format commands still work from the first
  line. See [Section 6.5.1.2, “mysql Client Commands”](mysql-commands.html "6.5.1.2 mysql Client Commands").

* [`--dns-srv-name=name`](mysql-command-options.html#option_mysql_dns-srv-name)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>8

  Specifies the name of a DNS SRV record that determines the
  candidate hosts to use for establishing a connection to a
  MySQL server. For information about DNS SRV support in
  MySQL, see [Section 6.2.6, “Connecting to the Server Using DNS SRV Records”](connecting-using-dns-srv.html "6.2.6 Connecting to the Server Using DNS SRV Records").

  Suppose that DNS is configured with this SRV information for
  the `example.com` domain:

  ```
  Name                     TTL   Class   Priority Weight Port Target
  _mysql._tcp.example.com. 86400 IN SRV  0        5      3306 host1.example.com
  _mysql._tcp.example.com. 86400 IN SRV  0        10     3306 host2.example.com
  _mysql._tcp.example.com. 86400 IN SRV  10       5      3306 host3.example.com
  _mysql._tcp.example.com. 86400 IN SRV  20       5      3306 host4.example.com
  ```

  To use that DNS SRV record, invoke [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  like this:

  ```
  mysql --dns-srv-name=_mysql._tcp.example.com
  ```

  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") then attempts a connection to each
  server in the group until a successful connection is
  established. A failure to connect occurs only if a
  connection cannot be established to any of the servers. The
  priority and weight values in the DNS SRV record determine
  the order in which servers should be tried.

  When invoked with
  [`--dns-srv-name`](mysql-command-options.html#option_mysql_dns-srv-name),
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") attempts to establish TCP
  connections only.

  The [`--dns-srv-name`](mysql-command-options.html#option_mysql_dns-srv-name) option
  takes precedence over the
  [`--host`](mysql-command-options.html#option_mysql_host) option if both are
  given. [`--dns-srv-name`](mysql-command-options.html#option_mysql_dns-srv-name) causes
  connection establishment to use the
  [`mysql_real_connect_dns_srv()`](/doc/c-api/8.0/en/mysql-real-connect-dns-srv.html)
  C API function rather than
  [`mysql_real_connect()`](/doc/c-api/8.0/en/mysql-real-connect.html).
  However, if the `connect` command is
  subsequently used at runtime and specifies a host name
  argument, that host name takes precedence over any
  [`--dns-srv-name`](mysql-command-options.html#option_mysql_dns-srv-name) option given at
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") startup to specify a DNS SRV
  record.

  This option was added in MySQL 8.0.22.

* [`--enable-cleartext-plugin`](mysql-command-options.html#option_mysql_enable-cleartext-plugin)

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.33</td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>9

  Enable the `mysql_clear_password` cleartext
  authentication plugin. (See
  [Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "8.4.1.4 Client-Side Cleartext Pluggable Authentication").)

* [`--execute=statement`](mysql-command-options.html#option_mysql_execute),
  `-e statement`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>0

  Execute the statement and quit. The default output format is
  like that produced with
  [`--batch`](mysql-command-options.html#option_mysql_batch). See
  [Section 6.2.2.1, “Using Options on the Command Line”](command-line-options.html "6.2.2.1 Using Options on the Command Line"), for some examples.
  With this option, [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") does not use the
  history file.

* [`--fido-register-factor=value`](mysql-command-options.html#option_mysql_fido-register-factor)

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>1

  Note

  As of MySQL 8.0.35, this option is deprecated and subject
  to removal in a future MySQL release.

  The factor or factors for which FIDO device registration
  must be performed. This option value must be a single value,
  or two values separated by commas. Each value must be 2 or
  3, so the permitted option values are
  `'2'`, `'3'`,
  `'2,3'` and `'3,2'`.

  For example, an account that requires registration for a 3rd
  authentication factor invokes the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  client as follows:

  ```
  mysql --user=user_name --fido-register-factor=3
  ```

  An account that requires registration for a 2nd and 3rd
  authentication factor invokes the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  client as follows:

  ```
  mysql --user=user_name --fido-register-factor=2,3
  ```

  If registration is successful, a connection is established.
  If there is an authentication factor with a pending
  registration, a connection is placed into pending
  registration mode when attempting to connect to the server.
  In this case, disconnect and reconnect with the correct
  [`--fido-register-factor`](mysql-command-options.html#option_mysql_fido-register-factor) value
  to complete the registration.

  Registration is a two step process comprising
  *initiate registration* and
  *finish registration* steps. The initiate
  registration step executes this statement:

  ```
  ALTER USER user factor INITIATE REGISTRATION
  ```

  The statement returns a result set containing a 32 byte
  challenge, the user name, and the relying party ID (see
  [`authentication_fido_rp_id`](pluggable-authentication-system-variables.html#sysvar_authentication_fido_rp_id)).

  The finish registration step executes this statement:

  ```
  ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  ```

  The statement completes the registration and sends the
  following information to the server as part of the
  *`auth_string`*: authenticator data,
  an optional attestation certificate in X.509 format, and a
  signature.

  The initiate and registration steps must be performed in a
  single connection, as the challenge received by the client
  during the initiate step is saved to the client connection
  handler. Registration would fail if the registration step
  was performed by a different connection. The
  [`--fido-register-factor`](mysql-command-options.html#option_mysql_fido-register-factor) option
  executes both the initiate and registration steps, which
  avoids the failure scenario described above and prevents
  having to execute the [`ALTER
  USER`](alter-user.html "15.7.1.1 ALTER USER Statement") initiate and registration statements
  manually.

  The [`--fido-register-factor`](mysql-command-options.html#option_mysql_fido-register-factor)
  option is only available for the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  client and MySQL Shell. Other MySQL client programs do not
  support it.

  For related information, see
  [Using FIDO Authentication](fido-pluggable-authentication.html#fido-pluggable-authentication-usage "Using FIDO Authentication").

* [`--force`](mysql-command-options.html#option_mysql_force), `-f`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>2

  Continue even if an SQL error occurs.

* [`--get-server-public-key`](mysql-command-options.html#option_mysql_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>3

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
  [`--server-public-key-path=file_name`](mysql-command-options.html#option_mysql_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysql-command-options.html#option_mysql_get-server-public-key).

  For information about the
  `caching_sha2_password` plugin, see
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--histignore`](mysql-command-options.html#option_mysql_histignore)

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>4

  A list of one or more colon-separated patterns specifying
  statements to ignore for logging purposes. These patterns
  are added to the default pattern list
  (`"*IDENTIFIED*:*PASSWORD*"`). The value
  specified for this option affects logging of statements
  written to the history file, and to
  `syslog` if the
  [`--syslog`](mysql-command-options.html#option_mysql_syslog) option is given. For
  more information, see [Section 6.5.1.3, “mysql Client Logging”](mysql-logging.html "6.5.1.3 mysql Client Logging").

* [`--host=host_name`](mysql-command-options.html#option_mysql_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>5

  Connect to the MySQL server on the given host.

  The [`--dns-srv-name`](mysql-command-options.html#option_mysql_dns-srv-name) option
  takes precedence over the
  [`--host`](mysql-command-options.html#option_mysql_host) option if both are
  given. [`--dns-srv-name`](mysql-command-options.html#option_mysql_dns-srv-name) causes
  connection establishment to use the
  [`mysql_real_connect_dns_srv()`](/doc/c-api/8.0/en/mysql-real-connect-dns-srv.html)
  C API function rather than
  [`mysql_real_connect()`](/doc/c-api/8.0/en/mysql-real-connect.html).
  However, if the `connect` command is
  subsequently used at runtime and specifies a host name
  argument, that host name takes precedence over any
  [`--dns-srv-name`](mysql-command-options.html#option_mysql_dns-srv-name) option given at
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") startup to specify a DNS SRV
  record.

* [`--html`](mysql-command-options.html#option_mysql_html), `-H`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>6

  Produce HTML output.

* [`--ignore-spaces`](mysql-command-options.html#option_mysql_ignore-spaces),
  `-i`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>7

  Ignore spaces after function names. The effect of this is
  described in the discussion for the
  [`IGNORE_SPACE`](sql-mode.html#sqlmode_ignore_space) SQL mode (see
  [Section 7.1.11, “Server SQL Modes”](sql-mode.html "7.1.11 Server SQL Modes")).

* [`--init-command=str`](mysql-command-options.html#option_mysql_init-command)

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>8

  Single SQL statement to execute after connecting to the
  server. If auto-reconnect is enabled, the statement is
  executed again after reconnection occurs.

* [`--line-numbers`](mysql-command-options.html#option_mysql_line-numbers)

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-rehash</code></td>
</tr><tr><th>Disabled by</th>
<td><code class="literal">skip-auto-rehash</code></td>
</tr></tbody></table>9

  Write line numbers for errors. Disable this with
  [`--skip-line-numbers`](mysql-command-options.html#option_mysql_skip-line-numbers).

* [`--load-data-local-dir=dir_name`](mysql-command-options.html#option_mysql_load-data-local-dir)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>0

  This option affects the client-side `LOCAL`
  capability for [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement")
  operations. It specifies the directory in which files named
  in [`LOAD DATA
  LOCAL`](load-data.html "15.2.9 LOAD DATA Statement") statements must be located. The effect of
  [`--load-data-local-dir`](mysql-command-options.html#option_mysql_load-data-local-dir) depends
  on whether `LOCAL` data loading is enabled
  or disabled:

  + If `LOCAL` data loading is enabled,
    either by default in the MySQL client library or by
    specifying
    [`--local-infile[=1]`](mysql-command-options.html#option_mysql_local-infile), the
    [`--load-data-local-dir`](mysql-command-options.html#option_mysql_load-data-local-dir)
    option is ignored.

  + If `LOCAL` data loading is disabled,
    either by default in the MySQL client library or by
    specifying
    [`--local-infile=0`](mysql-command-options.html#option_mysql_local-infile), the
    [`--load-data-local-dir`](mysql-command-options.html#option_mysql_load-data-local-dir)
    option applies.

  When [`--load-data-local-dir`](mysql-command-options.html#option_mysql_load-data-local-dir)
  applies, the option value designates the directory in which
  local data files must be located. Comparison of the
  directory path name and the path name of files to be loaded
  is case-sensitive regardless of the case sensitivity of the
  underlying file system. If the option value is the empty
  string, it names no directory, with the result that no files
  are permitted for local data loading.

  For example, to explicitly disable local data loading except
  for files located in the `/my/local/data`
  directory, invoke [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") like this:

  ```
  mysql --local-infile=0 --load-data-local-dir=/my/local/data
  ```

  When both [`--local-infile`](mysql-command-options.html#option_mysql_local-infile) and
  [`--load-data-local-dir`](mysql-command-options.html#option_mysql_load-data-local-dir) are
  given, the order in which they are given does not matter.

  Successful use of `LOCAL` load operations
  within [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") also requires that the
  server permits local loading; see
  [Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”](load-data-local-security.html "8.1.6 Security Considerations for LOAD DATA LOCAL")

  The [`--load-data-local-dir`](mysql-command-options.html#option_mysql_load-data-local-dir)
  option was added in MySQL 8.0.21.

* [`--local-infile[={0|1}]`](mysql-command-options.html#option_mysql_local-infile)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>1

  By default, `LOCAL` capability for
  [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") is determined by
  the default compiled into the MySQL client library. To
  enable or disable `LOCAL` data loading
  explicitly, use the
  [`--local-infile`](mysql-command-options.html#option_mysql_local-infile) option. When
  given with no value, the option enables
  `LOCAL` data loading. When given as
  [`--local-infile=0`](mysql-command-options.html#option_mysql_local-infile) or
  [`--local-infile=1`](mysql-command-options.html#option_mysql_local-infile), the option
  disables or enables `LOCAL` data loading.

  If `LOCAL` capability is disabled, the
  [`--load-data-local-dir`](mysql-command-options.html#option_mysql_load-data-local-dir) option
  can be used to permit restricted local loading of files
  located in a designated directory.

  Successful use of `LOCAL` load operations
  within [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") also requires that the
  server permits local loading; see
  [Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”](load-data-local-security.html "8.1.6 Security Considerations for LOAD DATA LOCAL")

* [`--login-path=name`](mysql-command-options.html#option_mysql_login-path)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>2

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

* [`--max-allowed-packet=value`](mysql-command-options.html#option_mysql_max-allowed-packet)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>3

  The maximum size of the buffer for client/server
  communication. The default is 16MB, the maximum is 1GB.

* [`--max-join-size=value`](mysql-command-options.html#option_mysql_max-join-size)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>4

  The automatic limit for rows in a join when using
  [`--safe-updates`](mysql-command-options.html#option_mysql_safe-updates). (Default value
  is 1,000,000.)

* [`--named-commands`](mysql-command-options.html#option_mysql_named-commands),
  `-G`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>5

  Enable named [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") commands. Long-format
  commands are permitted, not just short-format commands. For
  example, `quit` and `\q`
  both are recognized. Use
  [`--skip-named-commands`](mysql-command-options.html#option_mysql_named-commands)
  to disable named commands. See
  [Section 6.5.1.2, “mysql Client Commands”](mysql-commands.html "6.5.1.2 mysql Client Commands").

* [`--net-buffer-length=value`](mysql-command-options.html#option_mysql_net-buffer-length)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>6

  The buffer size for TCP/IP and socket communication.
  (Default value is 16KB.)

* [`--network-namespace=name`](mysql-command-options.html#option_mysql_network-namespace)

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>7

  The network namespace to use for TCP/IP connections. If
  omitted, the connection uses the default (global) namespace.
  For information about network namespaces, see
  [Section 7.1.14, “Network Namespace Support”](network-namespace-support.html "7.1.14 Network Namespace Support").

  This option was added in MySQL 8.0.22. It is available only
  on platforms that implement network namespace support.

* [`--no-auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash),
  `-A`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>8

  This has the same effect as
  `--skip-auto-rehash`.
  See the description for
  [`--auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash).

* [`--no-beep`](mysql-command-options.html#option_mysql_no-beep), `-b`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-vertical-output</code></td>
</tr></tbody></table>9

  Do not beep when errors occur.

* [`--no-defaults`](mysql-command-options.html#option_mysql_no-defaults)

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>0

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysql-command-options.html#option_mysql_no-defaults) can be used to
  prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when [`--no-defaults`](mysql-command-options.html#option_mysql_no-defaults)
  is used. To create `.mylogin.cnf`, use
  the [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--one-database`](mysql-command-options.html#option_mysql_one-database),
  `-o`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>1

  Ignore statements except those that occur while the default
  database is the one named on the command line. This option
  is rudimentary and should be used with care. Statement
  filtering is based only on
  [`USE`](use.html "15.8.4 USE Statement") statements.

  Initially, [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") executes statements in
  the input because specifying a database
  *`db_name`* on the command line is
  equivalent to inserting
  [`USE
  db_name`](use.html "15.8.4 USE Statement") at the
  beginning of the input. Then, for each
  [`USE`](use.html "15.8.4 USE Statement") statement encountered,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") accepts or rejects following
  statements depending on whether the database named is the
  one on the command line. The content of the statements is
  immaterial.

  Suppose that [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") is invoked to process
  this set of statements:

  ```
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

  If the command line is [**mysql --force --one-database
  db1**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client"), [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") handles the input as
  follows:

  + The [`DELETE`](delete.html "15.2.2 DELETE Statement") statement is
    executed because the default database is
    `db1`, even though the statement names
    a table in a different database.

  + The [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") and
    [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statements
    are not executed because the default database is not
    `db1`, even though the statements name
    a table in `db1`.

  + The [`INSERT`](insert.html "15.2.7 INSERT Statement") and
    [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statements
    are executed because the default database is
    `db1`, even though the
    [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement
    names a table in a different database.

* [`--pager[=command]`](mysql-command-options.html#option_mysql_pager)

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>2

  Use the given command for paging query output. If the
  command is omitted, the default pager is the value of your
  `PAGER` environment variable. Valid pagers
  are **less**, **more**,
  **cat [> filename]**, and so forth. This
  option works only on Unix and only in interactive mode. To
  disable paging, use
  [`--skip-pager`](mysql-command-options.html#option_mysql_pager).
  [Section 6.5.1.2, “mysql Client Commands”](mysql-commands.html "6.5.1.2 mysql Client Commands"), discusses output paging
  further.

* [`--password[=password]`](mysql-command-options.html#option_mysql_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>3

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") prompts for one. If given, there
  must be *no space* between
  [`--password=`](mysql-command-options.html#option_mysql_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") should not prompt for one, use the
  [`--skip-password`](mysql-command-options.html#option_mysql_password)
  option.

* [`--password1[=pass_val]`](mysql-command-options.html#option_mysql_password1)

  The password for multifactor authentication factor 1 of the
  MySQL account used for connecting to the server. The
  password value is optional. If not given,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") prompts for one. If given, there
  must be *no space* between
  [`--password1=`](mysql-command-options.html#option_mysql_password1) and the password
  following it. If no password option is specified, the
  default is to send no password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") should not prompt for one, use the
  [`--skip-password1`](mysql-command-options.html#option_mysql_password1)
  option.

  [`--password1`](mysql-command-options.html#option_mysql_password1) and
  [`--password`](mysql-command-options.html#option_mysql_password) are synonymous, as
  are
  [`--skip-password1`](mysql-command-options.html#option_mysql_password1)
  and
  [`--skip-password`](mysql-command-options.html#option_mysql_password).

* [`--password2[=pass_val]`](mysql-command-options.html#option_mysql_password2)

  The password for multifactor authentication factor 2 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysql-command-options.html#option_mysql_password1); see the
  description of that option for details.

* [`--password3[=pass_val]`](mysql-command-options.html#option_mysql_password3)

  The password for multifactor authentication factor 3 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysql-command-options.html#option_mysql_password1); see the
  description of that option for details.

* [`--pipe`](mysql-command-options.html#option_mysql_pipe), `-W`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>4

  On Windows, connect to the server using a named pipe. This
  option applies only if the server was started with the
  [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable
  enabled to support named-pipe connections. In addition, the
  user making the connection must be a member of the Windows
  group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* [`--plugin-authentication-kerberos-client-mode=value`](mysql-command-options.html#option_mysql_plugin-authentication-kerberos-client-mode)

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>5

  On Windows, the
  `authentication_kerberos_client`
  authentication plugin supports this plugin option. It
  provides two possible values that the client user can set at
  runtime: `SSPI` and
  `GSSAPI`.

  The default value for the client-side plugin option uses
  Security Support Provider Interface (SSPI), which is capable
  of acquiring credentials from the Windows in-memory cache.
  Alternatively, the client user can select a mode that
  supports Generic Security Service Application Program
  Interface (GSSAPI) through the MIT Kerberos library on
  Windows. GSSAPI is capable of acquiring cached credentials
  previously generated by using the **kinit**
  command.

  For more information, see
  [Commands
  for Windows Clients in GSSAPI Mode](kerberos-pluggable-authentication.html#kerberos-usage-win-gssapi-client-commands).

* [`--plugin-dir=dir_name`](mysql-command-options.html#option_mysql_plugin-dir)

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>6

  The directory in which to look for plugins. Specify this
  option if the [`--default-auth`](mysql-command-options.html#option_mysql_default-auth)
  option is used to specify an authentication plugin but
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") does not find it. See
  [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--port=port_num`](mysql-command-options.html#option_mysql_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>7

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysql-command-options.html#option_mysql_print-defaults)

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>8

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--prompt=format_str`](mysql-command-options.html#option_mysql_prompt)

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--batch</code></td>
</tr></tbody></table>9

  Set the prompt to the specified format. The default is
  `mysql>`. The special sequences that the
  prompt can contain are described in
  [Section 6.5.1.2, “mysql Client Commands”](mysql-commands.html "6.5.1.2 mysql Client Commands").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysql-command-options.html#option_mysql_protocol)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>0

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--quick`](mysql-command-options.html#option_mysql_quick), `-q`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>1

  Do not cache each query result, print each row as it is
  received. This may slow down the server if the output is
  suspended. With this option, [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") does
  not use the history file.

  By default, [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") fetches all result rows
  before producing any output; while storing these, it
  calculates a running maximum column length from the actual
  value of each column in succession. When printing the
  output, it uses this maximum to format it. When
  `--quick` is specified,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") does not have the rows for which to
  calculate the length before starting, and so uses the
  maximum length. In the following example, table
  `t1` has a single column of type
  [`BIGINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and containing 4 rows.
  The default output is 9 characters wide; this width is equal
  the maximum number of characters in any of the column values
  in the rows returned (5), plus 2 characters each for the
  spaces used as padding and the `|`
  characters used as column delimiters). The output when using
  the `--quick` option is 25 characters wide;
  this is equal to the number of characters needed to
  represent `-9223372036854775808`, which is
  the longest possible value that can be stored in a (signed)
  `BIGINT` column, or 19 characters, plus the
  4 characters used for padding and column delimiters. The
  difference can be seen here:

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

* [`--raw`](mysql-command-options.html#option_mysql_raw), `-r`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>2

  For tabular output, the “boxing” around columns
  enables one column value to be distinguished from another.
  For nontabular output (such as is produced in batch mode or
  when the [`--batch`](mysql-command-options.html#option_mysql_batch) or
  [`--silent`](mysql-command-options.html#option_mysql_silent) option is given),
  special characters are escaped in the output so they can be
  identified easily. Newline, tab, `NUL`, and
  backslash are written as `\n`,
  `\t`, `\0`, and
  `\\`. The
  [`--raw`](mysql-command-options.html#option_mysql_raw) option disables this
  character escaping.

  The following example demonstrates tabular versus nontabular
  output and the use of raw mode to disable escaping:

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

* [`--reconnect`](mysql-command-options.html#option_mysql_reconnect)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>3

  If the connection to the server is lost, automatically try
  to reconnect. A single reconnect attempt is made each time
  the connection is lost. To suppress reconnection behavior,
  use
  [`--skip-reconnect`](mysql-command-options.html#option_mysql_reconnect).

* [`--safe-updates`](mysql-command-options.html#option_mysql_safe-updates),
  [`--i-am-a-dummy`](mysql-command-options.html#option_mysql_safe-updates),
  `-U`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>4

  If this option is enabled,
  [`UPDATE`](update.html "15.2.17 UPDATE Statement") and
  [`DELETE`](delete.html "15.2.2 DELETE Statement") statements that do not
  use a key in the `WHERE` clause or a
  `LIMIT` clause produce an error. In
  addition, restrictions are placed on
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements that
  produce (or are estimated to produce) very large result
  sets. If you have set this option in an option file, you can
  use
  [`--skip-safe-updates`](mysql-command-options.html#option_mysql_safe-updates)
  on the command line to override it. For more information
  about this option, see [Using Safe-Updates Mode (--safe-updates)](mysql-tips.html#safe-updates "Using Safe-Updates Mode (--safe-updates)").

* [`--select-limit=value`](mysql-command-options.html#option_mysql_select-limit)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>5

  The automatic limit for
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements when using
  [`--safe-updates`](mysql-command-options.html#option_mysql_safe-updates). (Default value
  is 1,000.)

* [`--server-public-key-path=file_name`](mysql-command-options.html#option_mysql_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>6

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
  [`--server-public-key-path=file_name`](mysql-command-options.html#option_mysql_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysql-command-options.html#option_mysql_get-server-public-key).

  For `sha256_password`, this option applies
  only if MySQL was built using OpenSSL.

  For information about the `sha256_password`
  and `caching_sha2_password` plugins, see
  [Section 8.4.1.3, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "8.4.1.3 SHA-256 Pluggable Authentication"), and
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--shared-memory-base-name=name`](mysql-command-options.html#option_mysql_shared-memory-base-name)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>7

  On Windows, the shared-memory name to use for connections
  made using shared memory to a local server. The default
  value is `MYSQL`. The shared-memory name is
  case-sensitive.

  This option applies only if the server was started with the
  [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system
  variable enabled to support shared-memory connections.

* [`--show-warnings`](mysql-command-options.html#option_mysql_show-warnings)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>8

  Cause warnings to be shown after each statement if there are
  any. This option applies to interactive and batch mode.

* [`--sigint-ignore`](mysql-command-options.html#option_mysql_sigint-ignore)

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-as-hex</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value (≥ 8.0.19)</th>
<td><code class="literal">FALSE in noninteractive mode</code></td>
</tr><tr><th>Default Value (≤ 8.0.18)</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>9

  Ignore `SIGINT` signals (typically the
  result of typing **Control+C**).

  Without this option, typing **Control+C**
  interrupts the current statement if there is one, or cancels
  any partial input line otherwise.

* [`--silent`](mysql-command-options.html#option_mysql_silent), `-s`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>0

  Silent mode. Produce less output. This option can be given
  multiple times to produce less and less output.

  This option results in nontabular output format and escaping
  of special characters. Escaping may be disabled by using raw
  mode; see the description for the
  [`--raw`](mysql-command-options.html#option_mysql_raw) option.

* [`--skip-column-names`](mysql-command-options.html#option_mysql_skip-column-names),
  `-N`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>1

  Do not write column names in results. Use of this option
  causes the output to be right-aligned, as shown here:

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

* [`--skip-line-numbers`](mysql-command-options.html#option_mysql_skip-line-numbers),
  `-L`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>2

  Do not write line numbers for errors. Useful when you want
  to compare result files that include error messages.

* [`--skip-system-command`](mysql-command-options.html#option_mysql_skip-system-command)

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>3

  Disables the `system`
  (`\!`) command. Equivalent to
  [`--system-command=OFF`](mysql-command-options.html#option_mysql_system-command).

* [`--socket=path`](mysql-command-options.html#option_mysql_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>4

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

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysql-command-options.html#option_mysql_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>5

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysql-command-options.html#option_mysql_ssl-fips-mode) option differs
  from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These [`--ssl-fips-mode`](mysql-command-options.html#option_mysql_ssl-fips-mode) values
  are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysql-command-options.html#option_mysql_ssl-fips-mode) is
  `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysql-command-options.html#option_mysql_ssl-fips-mode) to
  `ON` or `STRICT` causes
  the client to produce a warning at startup and to operate
  in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--syslog`](mysql-command-options.html#option_mysql_syslog), `-j`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>6

  This option causes [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to send
  interactive statements to the system logging facility. On
  Unix, this is `syslog`; on Windows, it is
  the Windows Event Log. The destination where logged messages
  appear is system dependent. On Linux, the destination is
  often the `/var/log/messages` file.

  Here is a sample of output generated on Linux by using
  `--syslog`. This output is formatted for
  readability; each logged message actually takes a single
  line.

  ```
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

  For more information, see [Section 6.5.1.3, “mysql Client Logging”](mysql-logging.html "6.5.1.3 mysql Client Logging").

* [`--system-command[={ON|OFF}]`](mysql-command-options.html#option_mysql_system-command)

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>7

  Enable or disable the `system`
  (`\!`) command. When this option is
  disabled, either by `--system-command=OFF` or
  by [`--skip-system-command`](mysql-command-options.html#option_mysql_skip-system-command), the
  `system` command is rejected with an error.

  (*MySQL 8.0.43 and later:*)
  [`--commands`](mysql-command-options.html#option_mysql_commands), when disabled (set
  to `FALSE`), causes the server to disregard
  any setting for this option.

* [`--table`](mysql-command-options.html#option_mysql_table), `-t`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>8

  Display output in table format. This is the default for
  interactive use, but can be used to produce table output in
  batch mode.

* [`--tee=file_name`](mysql-command-options.html#option_mysql_tee)

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--binary-mode</code></td>
</tr></tbody></table>9

  Append a copy of output to the given file. This option works
  only in interactive mode. [Section 6.5.1.2, “mysql Client Commands”](mysql-commands.html "6.5.1.2 mysql Client Commands"),
  discusses tee files further.

* [`--tls-ciphersuites=ciphersuite_list`](mysql-command-options.html#option_mysql_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>0

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysql-command-options.html#option_mysql_tls-version)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>1

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--unbuffered`](mysql-command-options.html#option_mysql_unbuffered),
  `-n`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>2

  Flush the buffer after each query.

* [`--user=user_name`](mysql-command-options.html#option_mysql_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>3

  The user name of the MySQL account to use for connecting to
  the server.

* [`--verbose`](mysql-command-options.html#option_mysql_verbose), `-v`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>4

  Verbose mode. Produce more output about what the program
  does. This option can be given multiple times to produce
  more and more output. (For example, `-v -v
  -v` produces table output format even in batch
  mode.)

* [`--version`](mysql-command-options.html#option_mysql_version), `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>5

  Display version information and exit.

* [`--vertical`](mysql-command-options.html#option_mysql_vertical),
  `-E`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>6

  Print query output rows vertically (one line per column
  value). Without this option, you can specify vertical output
  for individual statements by terminating them with
  `\G`.

* [`--wait`](mysql-command-options.html#option_mysql_wait), `-w`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>7

  If the connection cannot be established, wait and retry
  instead of aborting.

* [`--xml`](mysql-command-options.html#option_mysql_xml), `-X`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>8

  Produce XML output.

  ```
  <field name="column_name">NULL</field>
  ```

  The output when [`--xml`](mysql-command-options.html#option_mysql_xml) is used
  with [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") matches that of
  [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program")
  [`--xml`](mysqldump.html#option_mysqldump_xml). See
  [Section 6.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"), for details.

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

* [`--zstd-compression-level=level`](mysql-command-options.html#option_mysql_zstd-compression-level)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>9

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