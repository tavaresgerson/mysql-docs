#### 6.5.8.1 Options

**mysqldm** accepts MySQL standard connection options and several **mysqldm**-specific options.

##### mysqldm-specific options

**Table 6.17 mysqldm options**

<table frame="box" rules="all" summary="Reference for mysqldm options."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_authentication-oci-client-config-profile">--authentication-oci-client-config-profile</a></td> <td>Name of the OCI profile defined in the OCI config file to use</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_authentication-openid-connect-client-id-token-file">--authentication-openid-connect-client-id-token-file</a></td> <td>Full path to the OpenID Connect Identity token file</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_character-sets-dir">--character-sets-dir</a></td> <td>Directory where character sets are installed</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_compress">--compress</a></td> <td>Compress all information sent between client and server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_compression-algorithms">--compression-algorithms</a></td> <td>Permitted compression algorithms for connections to server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_debug">--debug</a></td> <td>Write debugging log; supported only if MySQL was built with debugging support</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_default-auth">--default-auth</a></td> <td>Authentication plugin to use</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_defaults-extra-file">--defaults-extra-file</a></td> <td>Read named option file in addition to usual option files</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_defaults-file">--defaults-file</a></td> <td>Read only named option file</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_defaults-group-suffix">--defaults-group-suffix</a></td> <td>Option group suffix value</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_delay">--delay</a></td> <td>Number of seconds between iterations</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_enable-cleartext-plugin">--enable-cleartext-plugin</a></td> <td>Enable cleartext authentication plugin</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_get-server-public-key">--get-server-public-key</a></td> <td>Request RSA public key from server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_help">--help</a></td> <td>Display help message and exit</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_host">--host</a></td> <td>Host on which MySQL server is located</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_iterations">--iterations</a></td> <td>Number of iterations</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_login-path">--login-path</a></td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_no-defaults">--no-defaults</a></td> <td>Read no option files</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_no-login-paths">--no-login-paths</a></td> <td>Do not read login paths from the login path file</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_oci-config-file">--oci-config-file</a></td> <td>Defines an alternate location for the Oracle Cloud Infrastructure CLI configuration file.</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_output-dir">--output-dir</a></td> <td>Path where output is written</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_password">--password</a></td> <td>Password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_password1">--password1</a></td> <td>First multifactor authentication password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_password2">--password2</a></td> <td>Second multifactor authentication password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_password3">--password3</a></td> <td>Third multifactor authentication password to use when connecting to server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_pipe">--pipe</a></td> <td>Connect to server using named pipe (Windows only)</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_plugin-authentication-kerberos-client-mode">--plugin-authentication-kerberos-client-mode</a></td> <td>Permit GSSAPI pluggable authentication through the MIT Kerberos library on Windows</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_plugin-authentication-webauthn-client-preserve-privacy">--plugin-authentication-webauthn-client-preserve-privacy</a></td> <td>Permit user to choose a key to be used for assertion</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_plugin-authentication-webauthn-device">--plugin-authentication-webauthn-device</a></td> <td>Specifies which libfido2 device to use. Default is 0 (first device)</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_plugin-dir">--plugin-dir</a></td> <td>Directory where plugins are installed</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_port">--port</a></td> <td>TCP/IP port number for connection</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_print-defaults">--print-defaults</a></td> <td>Print default options</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_protocol">--protocol</a></td> <td>Transport protocol to use</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_server-public-key-path">--server-public-key-path</a></td> <td>Path name to file containing RSA public key</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_shared-memory-base-name">--shared-memory-base-name</a></td> <td>Shared-memory name for shared-memory connections (Windows only)</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_socket">--socket</a></td> <td>Unix socket file or Windows named pipe to use</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-ca</a></td> <td>File that contains list of trusted SSL Certificate Authorities</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-capath</a></td> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-cert</a></td> <td>File that contains X.509 certificate</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-cipher</a></td> <td>Permissible ciphers for connection encryption</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-crl</a></td> <td>File that contains certificate revocation lists</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-crlpath</a></td> <td>Directory that contains certificate revocation-list files</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl-fips-mode">--ssl-fips-mode</a></td> <td>Whether to enable FIPS mode on client side</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-key</a></td> <td>File that contains X.509 key</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-mode</a></td> <td>Desired security state of connection to server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-session-data</a></td> <td>File that contains SSL session data</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_ssl">--ssl-session-data-continue-on-failed-reuse</a></td> <td>Whether to establish connections if session reuse fails</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_tls-ciphersuites">--tls-ciphersuites</a></td> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_tls-sni-servername">--tls-sni-servername</a></td> <td>Server name supplied by the client</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_tls-version">--tls-version</a></td> <td>Permissible TLS protocols for encrypted connections</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_user">--user</a></td> <td>MySQL user name to use when connecting to server</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_version">--version</a></td> <td>Display version information and exit</td> </tr><tr><td><a class="link" href="mysqldm-options.html#option_mysqldm_zstd-compression-level">--zstd-compression-level</a></td> <td>Compression level for connections to server that use zstd compression</td> </tr></tbody></table>

* `--delay=numberOfSeconds`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>

  A length of delay between diagnostic iterations, in seconds.

* `--iterations=numberOfIterations`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>

  The number of diagnostic iterations.

* `--output-dir=path`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>

  The path where the diagnostics archive is generated. A temporary directory containing the generated files is also created at this location, then deleted when the diagnostics are complete and the archive generated.

##### mysqldm Server options

This section lists the common server options used by **mysqldm**.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--authentication-oci-client-config-profile`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Specify the name of the OCI configuration profile to use. If not set, the default profile is used.

* `--authentication-openid-connect-client-id-token-file`

  <table frame="box" rules="all" summary="Properties for authentication-openid-connect-client-id-token-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--authentication-openid-connect-client-id-token-file</code></td> </tr></tbody></table>

  For OpenID Connect, this sets the required Identity token to authenticate with a mapped MySQL user. It's a full filepath to the Identity token file used when connecting to the MySQL server. For additional information, see Section 8.4.1.9, “OpenID Connect Pluggable Authentication”.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  This option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--compression-algorithms=value</code></td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code class="literal">uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">zlib</code></p><p class="valid-value"><code class="literal">zstd</code></p><p class="valid-value"><code class="literal">uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>0

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysql.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>1

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysql** normally reads the `[client]` and `[mysql]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysql** also reads the `[client_other]` and `[mysql_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>5

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”.)

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>6

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>7

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>8

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">30</code></td> </tr></tbody></table>9

  Skips reading options from the login path file.

  See `--login-path` for related information.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>0

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--oci-config-file=PATH`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>1

  Alternate path to the Oracle Cloud Infrastructure CLI configuration file. Specify the location of the configuration file. If your existing default profile is the correct one, you do not need to specify this option. However, if you have an existing configuration file, with multiple profiles or a different default from the tenancy of the user you want to connect with, specify this option.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>2

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqldm** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqldm** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  `--password1` and `--password` are synonymous.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>3

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-authentication-kerberos-client-mode=value`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>4

  On Windows, the `authentication_kerberos_client` authentication plugin supports this plugin option. It provides two possible values that the client user can set at runtime: `SSPI` and `GSSAPI`.

  The default value for the client-side plugin option uses Security Support Provider Interface (SSPI), which is capable of acquiring credentials from the Windows in-memory cache. Alternatively, the client user can select a mode that supports Generic Security Service Application Program Interface (GSSAPI) through the MIT Kerberos library on Windows. GSSAPI is capable of acquiring cached credentials previously generated by using the **kinit** command.

  For more information, see Commands for Windows Clients in GSSAPI Mode.

* `--plugin-authentication-webauthn-client-preserve-privacy={OFF|ON}`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>5

  Determines how assertions are sent to server in case there is more than one discoverable credential stored for a given RP ID (a unique name given to the relying-party server, which is the MySQL server). If the FIDO2 device contains multiple resident keys for a given RP ID, this option allows the user to choose a key to be used for assertion. It provides two possible values that the client user can set. The default value is `OFF`. If set to `OFF`, the challenge is signed by all credentials available for a given RP ID and all signatures are sent to server. If set to `ON`, the user is prompted to choose the credential to be used for signature.

  Note

  This option has no effect if the device does not support the resident-key feature.

  For more information, see Section 8.4.1.11, “WebAuthn Pluggable Authentication”.

* `--plugin-authentication-webauthn-device=#`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>6

  Determiens which device to use for `libfido` authentication. The default is the first device (`0`).

  Note

  Specifying a nonexistent device raises an error.

  For more information, see Section 8.4.1.11, “WebAuthn Pluggable Authentication”.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>7

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqldm** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>8

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for iterations"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--iterations=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>9

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>0

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>1

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.2, “SHA-256 Pluggable Authentication”, and Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>2

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>3

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>4

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  This option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>5

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>6

  When specified, the name is passed to the `libmysqlclient` C API library using the `MYSQL_OPT_TLS_SNI_SERVERNAME` option of `mysql_options()`. The server name is not case-sensitive. To show which server name the client specified for the current session, if any, check the `Tls_sni_server_name` status variable.

  Server Name Indication (SNI) is an extension to the TLS protocol (OpenSSL must be compiled using TLS extensions for this option to function). The MySQL implementation of SNI represents the client-side only.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>7

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>8

  The user name of the MySQL account to use for connecting to the server.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for output-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--output-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">.</code></td> </tr></tbody></table>9

  Display version information and exit.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>0

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.
