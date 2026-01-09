#### 6.5.1.1 mysql Client Options

**mysql** supports the following options, which can be specified on the command line or in the `[mysql]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.10 mysql Client Options**

<table frame="box" rules="all" summary="Command-line options available for the mysql client."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="mysql-command-options.html#option_mysql_authentication-oci-client-config-profile">--authentication-oci-client-config-profile</a></td> <td>Name of the OCI profile defined in the OCI config file to use</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_authentication-openid-connect-client-id-token-file">--authentication-openid-connect-client-id-token-file</a></td> <td>Full path to the OpenID Connect Identity token file</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--auto-rehash</a></td> <td>Enable automatic rehashing</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_auto-vertical-output">--auto-vertical-output</a></td> <td>Enable automatic vertical result set display</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_batch">--batch</a></td> <td>Do not use history file</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_binary-as-hex">--binary-as-hex</a></td> <td>Display binary values in hexadecimal notation</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_binary-mode">--binary-mode</a></td> <td>Disable \r\n - to - \n translation and treatment of \0 as end-of-query</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_bind-address">--bind-address</a></td> <td>Use specified network interface to connect to MySQL Server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_character-sets-dir">--character-sets-dir</a></td> <td>Directory where character sets are installed</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_column-names">--column-names</a></td> <td>Write column names in results</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_column-type-info">--column-type-info</a></td> <td>Display result set metadata</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_commands">--commands</a></td> <td>Enable or disable processing of local mysql client commands</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_comments">--comments</a></td> <td>Whether to retain or strip comments in statements sent to the server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_compress">--compress</a></td> <td>Compress all information sent between client and server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_compression-algorithms">--compression-algorithms</a></td> <td>Permitted compression algorithms for connections to server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_connect-expired-password">--connect-expired-password</a></td> <td>Indicate to server that client can handle expired-password sandbox mode</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_connect-timeout">--connect-timeout</a></td> <td>Number of seconds before connection timeout</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_database">--database</a></td> <td>The database to use</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_debug">--debug</a></td> <td>Write debugging log; supported only if MySQL was built with debugging support</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_debug-check">--debug-check</a></td> <td>Print debugging information when program exits</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_debug-info">--debug-info</a></td> <td>Print debugging information, memory, and CPU statistics when program exits</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_default-auth">--default-auth</a></td> <td>Authentication plugin to use</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_default-character-set">--default-character-set</a></td> <td>Specify default character set</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_defaults-extra-file">--defaults-extra-file</a></td> <td>Read named option file in addition to usual option files</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_defaults-file">--defaults-file</a></td> <td>Read only named option file</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Option group suffix value</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_delimiter">--delimiter</a></td> <td>Set the statement delimiter</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_dns-srv-name">--dns-srv-name</a></td> <td>Use DNS SRV lookup for host information</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Enable cleartext authentication plugin</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_execute">--execute</a></td> <td>Execute the statement and quit</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_force">--force</a></td> <td>Continue even if an SQL error occurs</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_get-server-public-key">--get-server-public-key</a></td> <td>Request RSA public key from server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_help">--help</a></td> <td>Display help message and exit</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_histignore">--histignore</a></td> <td>Patterns specifying which statements to ignore for logging</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_host">--host</a></td> <td>Host on which MySQL server is located</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_html">--html</a></td> <td>Produce HTML output</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ignore-spaces">--ignore-spaces</a></td> <td>Ignore spaces after function names</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_init-command">--init-command</a></td> <td>SQL statement to execute after connecting</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_init-command-add">--init-command-add</a></td> <td>Add an additional SQL statement to execute after connecting or re-connecting to MySQL server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_line-numbers">--line-numbers</a></td> <td>Write line numbers for errors</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_load-data-local-dir">--load-data-local-dir</a></td> <td>Directory for files named in LOAD DATA LOCAL statements</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_local-infile">--local-infile</a></td> <td>Enable or disable for LOCAL capability for LOAD DATA</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_login-path">--login-path</a></td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_max-allowed-packet">--max-allowed-packet</a></td> <td>Maximum packet length to send to or receive from server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_max-join-size">--max-join-size</a></td> <td>The automatic limit for rows in a join when using --safe-updates</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--named-commands</a></td> <td>Enable named mysql commands</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_net-buffer-length">--net-buffer-length</a></td> <td>Buffer size for TCP/IP and socket communication</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_network-namespace">--network-namespace</a></td> <td>Specify network namespace</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_no-auto-rehash">--no-auto-rehash</a></td> <td>Disable automatic rehashing</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_no-beep">--no-beep</a></td> <td>Do not beep when errors occur</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_no-defaults">--no-defaults</a></td> <td>Read no option files</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_no-login-paths">--no-login-paths</a></td> <td>Do not read login paths from the login path file</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_oci-config-file">--oci-config-file</a></td> <td>Defines an alternate location for the Oracle Cloud Infrastructure CLI configuration file.</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_one-database">--one-database</a></td> <td>Ignore statements except those for the default database named on the command line</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_pager">--pager</a></td> <td>Use the given command for paging query output</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_password">--password</a></td> <td>Password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_password1">--password1</a></td> <td>First multifactor authentication password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_password2">--password2</a></td> <td>Second multifactor authentication password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_password3">--password3</a></td> <td>Third multifactor authentication password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_pipe">--pipe</a></td> <td>Connect to server using named pipe (Windows only)</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_plugin-authentication-kerberos-client-mode">--plugin-authentication-kerberos-client-mode</a></td> <td>Permit GSSAPI pluggable authentication through the MIT Kerberos library on Windows</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_plugin-authentication-webauthn-client-preserve-privacy">--plugin-authentication-webauthn-client-preserve-privacy</a></td> <td>Permit user to choose a key to be used for assertion</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_plugin-authentication-webauthn-device">--plugin-authentication-webauthn-device</a></td> <td>Specifies which libfido2 device to use. Default is 0 (first device)</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_plugin-dir">--plugin-dir</a></td> <td>Directory where plugins are installed</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_port">--port</a></td> <td>TCP/IP port number for connection</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_print-defaults">--print-defaults</a></td> <td>Print default options</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_prompt">--prompt</a></td> <td>Set the prompt to the specified format</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_protocol">--protocol</a></td> <td>Transport protocol to use</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_quick">--quick</a></td> <td>Do not cache each query result</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_raw">--raw</a></td> <td>Write column values without escape conversion</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--reconnect</a></td> <td>If the connection to the server is lost, automatically try to reconnect</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_register-factor">--register-factor</a></td> <td>Multifactor authentication factors for which registration must be done</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--safe-updates</a>, <a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--i-am-a-dummy</a></td> <td>Allow only UPDATE and DELETE statements that specify key values</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_select-limit">--select-limit</a></td> <td>The automatic limit for SELECT statements when using --safe-updates</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_server-public-key-path">--server-public-key-path</a></td> <td>Path name to file containing RSA public key</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_shared-memory-base-name">--shared-memory-base-name</a></td> <td>Shared-memory name for shared-memory connections (Windows only)</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_show-warnings">--show-warnings</a></td> <td>Show warnings after each statement if there are any</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_sigint-ignore">--sigint-ignore</a></td> <td>Ignore SIGINT signals (typically the result of typing Control+C)</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_silent">--silent</a></td> <td>Silent mode</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--skip-auto-rehash</a></td> <td>Disable automatic rehashing</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_skip-column-names">--skip-column-names</a></td> <td>Do not write column names in results</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_skip-line-numbers">--skip-line-numbers</a></td> <td>Skip line numbers for errors</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--skip-named-commands</a></td> <td>Disable named mysql commands</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_pager">--skip-pager</a></td> <td>Disable paging</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--skip-reconnect</a></td> <td>Disable reconnecting</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_skip-system-command">--skip-system-command</a></td> <td>Disable system (\!) command</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_socket">--socket</a></td> <td>Unix socket file or Windows named pipe to use</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-ca</a></td> <td>File that contains list of trusted SSL Certificate Authorities</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-capath</a></td> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cert</a></td> <td>File that contains X.509 certificate</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cipher</a></td> <td>Permissible ciphers for connection encryption</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crl</a></td> <td>File that contains certificate revocation lists</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crlpath</a></td> <td>Directory that contains certificate revocation-list files</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl-fips-mode">--ssl-fips-mode</a></td> <td>Whether to enable FIPS mode on client side</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-key</a></td> <td>File that contains X.509 key</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-mode</a></td> <td>Desired security state of connection to server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-session-data</a></td> <td>File that contains SSL session data</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-session-data-continue-on-failed-reuse</a></td> <td>Whether to establish connections if session reuse fails</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_syslog">--syslog</a></td> <td>Log interactive statements to syslog</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_system-command">--system-command</a></td> <td>Enable or disable system (\!) command</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_table">--table</a></td> <td>Display output in tabular format</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_tee">--tee</a></td> <td>Append a copy of output to named file</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_telemetry_client">--telemetry_client</a></td> <td>Enables the telemetry client.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_bsp_max_export_batch_size">--otel_bsp_max_export_batch_size</a></td> <td>See variable OTEL_BSP_MAX_EXPORT_BATCH_SIZE.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_bsp_max_queue_size">--otel_bsp_max_queue_size</a></td> <td>See variable OTEL_BSP_MAX_QUEUE_SIZE.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_bsp_schedule_delay">--otel_bsp_schedule_delay</a></td> <td>See variable OTEL_BSP_SCHEDULE_DELAY.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_certificates">--otel_exporter_otlp_traces_certificates</a></td> <td>Not in use at this time. Reserved for future development.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_client_certificates">--otel_exporter_otlp_traces_client_certificates</a></td> <td>Not in use at this time. Reserved for future development.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_client_key">--otel_exporter_otlp_traces_client_key</a></td> <td>Not in use at this time. Reserved for future development.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_compression">--otel_exporter_otlp_traces_compression</a></td> <td>Compression type</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_endpoint">--otel_exporter_otlp_traces_endpoint</a></td> <td>The trace export endpoint</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_headers">--otel_exporter_otlp_traces_headers</a></td> <td>Key-value pairs to be used as headers associated with HTTP requests</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_protocol">--otel_exporter_otlp_traces_protocol</a></td> <td>The OTLP transport protocol</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_exporter_otlp_traces_timeout">--otel_exporter_otlp_traces_timeout</a></td> <td>Time OLTP exporter waits for each batch export</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel-help">--otel-help</a></td> <td>When enabled, prints help about telemetry_client options.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_log_level">--otel_log_level</a></td> <td>Controls which opentelemetry logs are printed in the server logs</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel_resource_attributes">--otel_resource_attributes</a></td> <td>See corresponding OpenTelemetry variable OTEL_RESOURCE_ATTRIBUTES.</td> </tr><tr><td><a class="link" href="telemetry-trace-configuration.html#option_mysql_telemetry_client.otel-trace">--otel-trace</a></td> <td>This system variable controls whether telemetry traces are collected or not.</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_tls-ciphersuites">--tls-ciphersuites</a></td> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_tls-sni-servername">--tls-sni-servername</a></td> <td>Server name supplied by the client</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_tls-version">--tls-version</a></td> <td>Permissible TLS protocols for encrypted connections</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_unbuffered">--unbuffered</a></td> <td>Flush the buffer after each query</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_user">--user</a></td> <td>MySQL user name to use when connecting to server</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_verbose">--verbose</a></td> <td>Verbose mode</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_version">--version</a></td> <td>Display version information and exit</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_vertical">--vertical</a></td> <td>Print query output rows vertically (one line per column value)</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_wait">--wait</a></td> <td>If the connection cannot be established, wait and retry instead of aborting</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_xml">--xml</a></td> <td>Produce XML output</td> </tr><tr><td><a class="link" href="mysql-command-options.html#option_mysql_zstd-compression-level">--zstd-compression-level</a></td> <td>Compression level for connections to server that use zstd compression</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--authentication-oci-client-config-profile`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Specify the name of the OCI configuration profile to use. If not set, the default profile is used.

* `--authentication-openid-connect-client-id-token-file`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  For OpenID Connect, this sets the required Identity token to authenticate with a mapped MySQL user. It's a full filepath to the Identity token file used when connecting to the MySQL server. For additional information, see Section 8.4.1.9, “OpenID Connect Pluggable Authentication”.

* `--auto-rehash`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  Enable automatic rehashing. This option is on by default, which enables database, table, and column name completion. Use `--disable-auto-rehash` to disable rehashing. That causes **mysql** to start faster, but you must issue the `rehash` command or its `\#` shortcut if you want to use name completion.

  To complete a name, enter the first part and press Tab. If the name is unambiguous, **mysql** completes it. Otherwise, you can press Tab again to see the possible names that begin with what you have typed so far. Completion does not occur if there is no default database.

  Note

  This feature requires a MySQL client that is compiled with the **readline** library. Typically, the **readline** library is not available on Windows.

* `--auto-vertical-output`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  Cause result sets to be displayed vertically if they are too wide for the current window, and using normal tabular format otherwise. (This applies to statements terminated by `;` or `\G`.)

* `--batch`, `-B`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  Print results using tab as the column separator, with each row on a new line. With this option, **mysql** does not use the history file.

  Batch mode results in nontabular output format and escaping of special characters. Escaping may be disabled by using raw mode; see the description for the `--raw` option.

* `--binary-as-hex`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

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

  When **mysql** operates in interactive mode, this option is enabled by default. In addition, output from the `status` (or `\s`) command includes this line when the option is enabled implicitly or explicitly:

  ```
  Binary data as: Hexadecimal
  ```

  To disable hexadecimal notation, use `--skip-binary-as-hex`

* `--binary-mode`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  This option helps when processing **mysqlbinlog** output that may contain `BLOB` values. By default, **mysql** translates `\r\n` in statement strings to `\n` and interprets `\0` as the statement terminator. `--binary-mode` disables both features. It also disables all **mysql** commands except `charset` and `delimiter` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command).

  `--binary-mode`, when enabled, causes the server to disregard any setting for `--commands` .

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--column-names`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Write column names in results.

* `--column-type-info`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display result set metadata. This information corresponds to the contents of C API `MYSQL_FIELD` data structures. See C API Basic Data Structures.

* `--commands`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

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

* `--comments`, `-c`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Whether to preserve or strip comments in statements sent to the server. The default is to preserve them; to strip them, start **mysql** with `--skip-comments`.

  Note

  The **mysql** client always passes optimizer hints to the server, regardless of whether this option is given.

  Comment stripping is deprecated. Expect this feature and the options to control it to be removed in a future MySQL release.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  This option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

* `--connect-expired-password`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Indicate to the server that the client can handle sandbox mode if the account used to connect has an expired password. This can be useful for noninteractive invocations of **mysql** because normally the server disconnects noninteractive clients that attempt to connect using an account with an expired password. (See Section 8.2.16, “Server Handling of Expired Passwords”.)

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The number of seconds before connection timeout. (Default value is `0`.)

* `--database=db_name`, `-D db_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The database to use. This is useful primarily in an option file.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysql.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* as the default character set for the client and connection.

  This option can be useful if the operating system uses one character set and the **mysql** client by default uses another. In this case, output may be formatted incorrectly. You can usually fix such issues by using this option to force the client to use the system character set instead.

  For more information, see Section 12.4, “Connection Character Sets and Collations”, and Section 12.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysql** normally reads the `[client]` and `[mysql]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysql** also reads the `[client_other]` and `[mysql_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delimiter=str`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Set the statement delimiter. The default is the semicolon character (`;`).

* `--disable-named-commands`

  Disable named commands. Use the `\*` form only, or use named commands only at the beginning of a line ending with a semicolon (`;`). **mysql** starts with this option *enabled* by default. However, even with this option, long-format commands still work from the first line. See Section 6.5.1.2, “mysql Client Commands”.

* `--dns-srv-name=name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

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

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”.)

* `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Execute the statement and quit. The default output format is like that produced with `--batch`. See Section 6.2.2.1, “Using Options on the Command Line”, for some examples. With this option, **mysql** does not use the history file.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Continue even if an SQL error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--histignore`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  A list of one or more colon-separated patterns specifying statements to ignore for logging purposes. These patterns are added to the default pattern list (`"*IDENTIFIED*:*PASSWORD*"`). The value specified for this option affects logging of statements written to the history file, and to `syslog` if the `--syslog` option is given. For more information, see Section 6.5.1.3, “mysql Client Logging”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

  The `--dns-srv-name` option takes precedence over the `--host` option if both are given. `--dns-srv-name` causes connection establishment to use the `mysql_real_connect_dns_srv()` C API function rather than `mysql_real_connect()`. However, if the `connect` command is subsequently used at runtime and specifies a host name argument, that host name takes precedence over any `--dns-srv-name` option given at **mysql** startup to specify a DNS SRV record.

* `--html`, `-H`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Produce HTML output.

* `--ignore-spaces`, `-i`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Ignore spaces after function names. The effect of this is described in the discussion for the `IGNORE_SPACE` SQL mode (see Section 7.1.11, “Server SQL Modes”).

* `--init-command=str`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Single SQL statement to execute after connecting to the server. If auto-reconnect is enabled, the statement is executed again after reconnection occurs. The definition resets existing statements defined by it or `init-command-add`.

* `--init-command-add=str`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  Add an additional SQL statement to execute after connecting or reconnecting to the MySQL server. It's usable without `--init-command` but has no effect if used before it because `init-command` resets the list of commands to call.

* `--line-numbers`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  Write line numbers for errors. Disable this with `--skip-line-numbers`.

* `--load-data-local-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  This option affects the client-side `LOCAL` capability for `LOAD DATA` operations. It specifies the directory in which files named in `LOAD DATA LOCAL` statements must be located. The effect of `--load-data-local-dir` depends on whether `LOCAL` data loading is enabled or disabled:

  + If `LOCAL` data loading is enabled, either by default in the MySQL client library or by specifying `--local-infile[=1]`, the `--load-data-local-dir` option is ignored.

  + If `LOCAL` data loading is disabled, either by default in the MySQL client library or by specifying `--local-infile=0`, the `--load-data-local-dir` option applies.

  When `--load-data-local-dir` applies, the option value designates the directory in which local data files must be located. Comparison of the directory path name and the path name of files to be loaded is case-sensitive regardless of the case sensitivity of the underlying file system. If the option value is the empty string, it names no directory, with the result that no files are permitted for local data loading.

  For example, to explicitly disable local data loading except for files located in the `/my/local/data` directory, invoke **mysql** like this:

  ```
  mysql --local-infile=0 --load-data-local-dir=/my/local/data
  ```

  When both `--local-infile` and `--load-data-local-dir` are given, the order in which they are given does not matter.

  Successful use of `LOCAL` load operations within **mysql** also requires that the server permits local loading; see Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”

* `--local-infile[={0|1}]`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  By default, `LOCAL` capability for `LOAD DATA` is determined by the default compiled into the MySQL client library. To enable or disable `LOCAL` data loading explicitly, use the `--local-infile` option. When given with no value, the option enables `LOCAL` data loading. When given as `--local-infile=0` or `--local-infile=1`, the option disables or enables `LOCAL` data loading.

  If `LOCAL` capability is disabled, the `--load-data-local-dir` option can be used to permit restricted local loading of files located in a designated directory.

  Successful use of `LOCAL` load operations within **mysql** also requires that the server permits local loading; see Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

  See `--login-path` for related information.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  The maximum size of the buffer for client/server communication. The default is 16MB, the maximum is 1GB.

* `--max-join-size=value`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  The automatic limit for rows in a join when using `--safe-updates`. (Default value is 1,000,000.)

* `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  Enable named **mysql** commands. Long-format commands are permitted, not just short-format commands. For example, `quit` and `\q` both are recognized. Use `--skip-named-commands` to disable named commands. See Section 6.5.1.2, “mysql Client Commands”.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  The buffer size for TCP/IP and socket communication. (Default value is 16KB.)

* `--network-namespace=name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-auto-rehash</code></td> </tr></tbody></table>

  The network namespace to use for TCP/IP connections. If omitted, the connection uses the default (global) namespace. For information about network namespaces, see Section 7.1.14, “Network Namespace Support”.

  This option is available only on platforms that implement network namespace support.

* `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  This has the same effect as `--skip-auto-rehash`. See the description for `--auto-rehash`.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  Do not beep when errors occur.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--oci-config-file=PATH`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  Alternate path to the Oracle Cloud Infrastructure CLI configuration file. Specify the location of the configuration file. If your existing default profile is the correct one, you do not need to specify this option. However, if you have an existing configuration file, with multiple profiles or a different default from the tenancy of the user you want to connect with, specify this option.

* `--one-database`, `-o`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  Ignore statements except those that occur while the default database is the one named on the command line. This option is rudimentary and should be used with care. Statement filtering is based only on `USE` statements.

  Initially, **mysql** executes statements in the input because specifying a database *`db_name`* on the command line is equivalent to inserting `USE db_name` at the beginning of the input. Then, for each `USE` statement encountered, **mysql** accepts or rejects following statements depending on whether the database named is the one on the command line. The content of the statements is immaterial.

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

  If the command line is **mysql --force --one-database db1**, **mysql** handles the input as follows:

  + The `DELETE` statement is executed because the default database is `db1`, even though the statement names a table in a different database.

  + The `DROP TABLE` and `CREATE TABLE` statements are not executed because the default database is not `db1`, even though the statements name a table in `db1`.

  + The `INSERT` and `CREATE TABLE` statements are executed because the default database is `db1`, even though the `CREATE TABLE` statement names a table in a different database.

* `--pager[=command]`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  Use the given command for paging query output. If the command is omitted, the default pager is the value of your `PAGER` environment variable. Valid pagers are **less**, **more**, **cat [> filename]**, and so forth. This option works only on Unix and only in interactive mode. To disable paging, use `--skip-pager`. Section 6.5.1.2, “mysql Client Commands”, discusses output paging further.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-authentication-kerberos-client-mode=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  On Windows, the `authentication_kerberos_client` authentication plugin supports this plugin option. It provides two possible values that the client user can set at runtime: `SSPI` and `GSSAPI`.

  The default value for the client-side plugin option uses Security Support Provider Interface (SSPI), which is capable of acquiring credentials from the Windows in-memory cache. Alternatively, the client user can select a mode that supports Generic Security Service Application Program Interface (GSSAPI) through the MIT Kerberos library on Windows. GSSAPI is capable of acquiring cached credentials previously generated by using the **kinit** command.

  For more information, see Commands for Windows Clients in GSSAPI Mode.

* `--plugin-authentication-webauthn-client-preserve-privacy={OFF|ON}`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-vertical-output</code></td> </tr></tbody></table>

  Determines how assertions are sent to server in case there is more than one discoverable credential stored for a given RP ID (a unique name given to the relying-party server, which is the MySQL server). If the FIDO2 device contains multiple resident keys for a given RP ID, this option allows the user to choose a key to be used for assertion. It provides two possible values that the client user can set. The default value is `OFF`. If set to `OFF`, the challenge is signed by all credentials available for a given RP ID and all signatures are sent to server. If set to `ON`, the user is prompted to choose the credential to be used for signature.

  Note

  This option has no effect if the device does not support the resident-key feature.

  For more information, see Section 8.4.1.11, “WebAuthn Pluggable Authentication”.

* `--plugin-authentication-webauthn-device=#`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  Determiens which device to use for `libfido` authentication. The default is the first device (`0`).

  Note

  Specifying a nonexistent device raises an error.

  For more information, see Section 8.4.1.11, “WebAuthn Pluggable Authentication”.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysql** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--prompt=format_str`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  Set the prompt to the specified format. The default is `mysql>`. The special sequences that the prompt can contain are described in Section 6.5.1.2, “mysql Client Commands”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  If the connection to the server is lost, automatically try to reconnect. A single reconnect attempt is made each time the connection is lost. To suppress reconnection behavior, use `--skip-reconnect`.

* `--register-factor=value`

  <table frame="box" rules="all" summary="Properties for batch"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--batch</code></td> </tr></tbody></table>

  The factor or factors for which FIDO/FIDO2 device registration must be performed before WebAuthn device-based authentication can be used. This option value must be a single value, or two values separated by commas. Each value must be 2 or 3, so the permitted option values are `'2'`, `'3'`, `'2,3'` and `'3,2'`.

  For example, an account that requires registration for a third authentication factor invokes the **mysql** client as follows:

  ```
  mysql --user=user_name --register-factor=3
  ```

  An account that requires registration for second and third authentication factors invokes the **mysql** client as follows:

  ```
  mysql --user=user_name --register-factor=2,3
  ```

  If registration is successful, a connection is established. If there is an authentication factor with a pending registration, a connection is placed into pending registration mode when attempting to connect to the server. In this case, disconnect and reconnect with the correct `--register-factor` value to complete the registration.

  Registration is a two-step process comprising *initiate registration* and *finish registration* steps. The initiate registration step executes this statement:

  ```
  ALTER USER user factor INITIATE REGISTRATION
  ```

  The statement returns a result set containing a 32 byte challenge, the user name, and the relying party ID (see `authentication_webauthn_rp_id`).

  The finish registration step executes this statement:

  ```
  ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  ```

  The statement completes the registration and sends the following information to the server as part of the *`auth_string`*: authenticator data, an optional attestation certificate in X.509 format, and a signature.

  The initiate and registration steps must be performed in a single connection, as the challenge received by the client during the initiate step is saved to the client connection handler. Registration would fail if the registration step was performed by a different connection. The `--register-factor` option executes both the initiate and registration steps, which avoids the failure scenario described above and prevents having to execute the `ALTER USER` initiate and registration statements manually.

  The `--register-factor` option is only available for the **mysql** and MySQL Shell clients. Other MySQL client programs do not support it.

  For related information, see Using WebAuthn Authentication.

* `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  If this option is enabled, `UPDATE` and `DELETE` statements that do not use a key in the `WHERE` clause or a `LIMIT` clause produce an error. In addition, restrictions are placed on `SELECT` statements that produce (or are estimated to produce) very large result sets. If you have set this option in an option file, you can use `--skip-safe-updates` on the command line to override it. For more information about this option, see Using Safe-Updates Mode (--safe-updates)").

* `--select-limit=value`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  The automatic limit for `SELECT` statements when using `--safe-updates`. (Default value is 1,000.)

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.2, “SHA-256 Pluggable Authentication”, and Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  Cause warnings to be shown after each statement if there are any. This option applies to interactive and batch mode.

* `--sigint-ignore`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  Ignore `SIGINT` signals (typically the result of typing **Control+C**).

  Without this option, typing **Control+C** interrupts the current statement if there is one, or cancels any partial input line otherwise.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  Silent mode. Produce less output. This option can be given multiple times to produce less and less output.

  This option results in nontabular output format and escaping of special characters. Escaping may be disabled by using raw mode; see the description for the `--raw` option.

* `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  Do not write line numbers for errors. Useful when you want to compare result files that include error messages.

* `--skip-system-command`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE in noninteractive mode</code></td> </tr></tbody></table>

  Disables the `system` (`\!`) command. Equivalent to `--system-command=OFF`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  This option is deprecated. Expect it to be removed in a future version of MySQL.

* `--syslog`, `-j`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  Enable or disable the `system` (`\!`) command. This option is disabled by default, which means the `system` command is rejected with an error. To enable it, use `--system-command=ON`.

  `--commands`, when disabled (set to `FALSE`), causes the server to disregard any setting for this option.

* `--table`, `-t`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  Display output in table format. This is the default for interactive use, but can be used to produce table output in batch mode.

* `--tee=file_name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  Append a copy of output to the given file. This option works only in interactive mode. Section 6.5.1.2, “mysql Client Commands”, discusses tee files further.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  When specified, the name is passed to the `libmysqlclient` C API library using the `MYSQL_OPT_TLS_SNI_SERVERNAME` option of `mysql_options()`. The server name is not case-sensitive. To show which server name the client specified for the current session, if any, check the `Tls_sni_server_name` status variable.

  Server Name Indication (SNI) is an extension to the TLS protocol (OpenSSL must be compiled using TLS extensions for this option to function). The MySQL implementation of SNI represents the client-side only.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--unbuffered`, `-n`

  <table frame="box" rules="all" summary="Properties for binary-mode"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binary-mode</code></td> </tr></tbody></table>

  Flush the buffer after each query.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  Verbose mode. Produce more output about what the program does. This option can be given multiple times to produce more and more output. (For example, `-v -v -v` produces table output format even in batch mode.)

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  Display version information and exit.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  Print query output rows vertically (one line per column value). Without this option, you can specify vertical output for individual statements by terminating them with `\G`.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  If the connection cannot be established, wait and retry instead of aborting.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

* `telemetry_client`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=ip_address</code></td> </tr></tbody></table>

  Enables the telemetry client plugin (Linux only).

  For more information, see Chapter 35, *Telemetry*.
