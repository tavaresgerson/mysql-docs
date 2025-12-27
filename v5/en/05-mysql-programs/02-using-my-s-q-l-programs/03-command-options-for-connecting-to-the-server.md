### 4.2.3 Command Options for Connecting to the Server

This section describes options supported by most MySQL client programs that control how client programs establish connections to the server and whether connections are encrypted. These options can be given on the command line or in an option file.

* Command Options for Connection Establishment
* Command Options for Encrypted Connections

#### Command Options for Connection Establishment

This section describes options that control how client programs establish connections to the server. For additional information and examples showing how to use them, see Section 4.2.4, “Connecting to the MySQL Server Using Command Options”.

**Table 4.4 Connection-Establishment Option Summary**

<table frame="box" rules="all" summary="Command-line options available for establishing connections to the server."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="connection-options.html#option_general_default-auth">--default-auth</a></th> <td>Authentication plugin to use</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_host">--host</a></th> <td>Host on which MySQL server is located</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_password">--password</a></th> <td>Password to use when connecting to server</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_pipe">--pipe</a></th> <td>Connect to server using named pipe (Windows only)</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_plugin-dir">--plugin-dir</a></th> <td>Directory where plugins are installed</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_port">--port</a></th> <td>TCP/IP port number for connection</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_protocol">--protocol</a></th> <td>Transport protocol to use</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_secure-auth">--secure-auth</a></th> <td>Do not send passwords to server in old (pre-4.1) format</td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_socket">--socket</a></th> <td>Unix socket file or Windows named pipe to use</td> <td></td> </tr><tr><th scope="row"><a class="link" href="connection-options.html#option_general_user">--user</a></th> <td>MySQL user name to use when connecting to server</td> <td></td> </tr></tbody></table>

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>

  The host on which the MySQL server is running. The value can be a host name, IPv4 address, or IPv6 address. The default value is `localhost`.

* `--password[=pass_val]`, `-p[pass_val]`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, the client program prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that the client program should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but the client program does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use. The default port number is 3306.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for protocol"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--protocol=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[see text]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">TCP</code></p><p class="valid-value"><code class="literal">SOCKET</code></p><p class="valid-value"><code class="literal">PIPE</code></p><p class="valid-value"><code class="literal">MEMORY</code></p></td> </tr></tbody></table>

  This option explicitly specifies which transport protocol to use for connecting to the server. It is useful when other connection parameters normally result in use of a protocol other than the one you want. For example, connections on Unix to `localhost` are made using a Unix socket file by default:

  ```sql
  mysql --host=localhost
  ```

  To force TCP/IP transport to be used instead, specify a `--protocol` option:

  ```sql
  mysql --host=localhost --protocol=TCP
  ```

  The following table shows the permissible `--protocol` option values and indicates the applicable platforms for each value. The values are not case-sensitive.

  <table summary="Permissible transport protocol values, the resulting transport protocol used, and the applicable platforms for each value."><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th scope="col"><a class="link" href="connection-options.html#option_general_protocol"><code class="option">--protocol</code></a> Value</th> <th scope="col">Transport Protocol Used</th> <th scope="col">Applicable Platforms</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">TCP</code></th> <td>TCP/IP transport to local or remote server</td> <td>All</td> </tr><tr> <th scope="row"><code class="literal">SOCKET</code></th> <td>Unix socket-file transport to local server</td> <td>Unix and Unix-like systems</td> </tr><tr> <th scope="row"><code class="literal">PIPE</code></th> <td>Named-pipe transport to local server</td> <td>Windows</td> </tr><tr> <th scope="row"><code class="literal">MEMORY</code></th> <td>Shared-memory transport to local server</td> <td>Windows</td> </tr></tbody></table>

  See also Section 4.2.5, “Connection Transport Protocols”

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for secure-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--secure-auth</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  On Unix, the name of the Unix socket file to use for connections made using a named pipe to a local server. The default Unix socket file name is `/tmp/mysql.sock`.

  On Windows, the name of the named pipe to use for connections to a local server. The default Windows pipe name is `MySQL`. The pipe name is not case-sensitive.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  The user name of the MySQL account to use for connecting to the server. The default user name is `ODBC` on Windows or your Unix login name on Unix.

#### Command Options for Encrypted Connections

This section describes options for client programs that specify whether to use encrypted connections to the server, the names of certificate and key files, and other parameters related to encrypted-connection support. For examples of suggested use and how to check whether a connection is encrypted, see Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

Note

These options have an effect only for connections that use a transport protocol subject to encryption; that is, TCP/IP and Unix socket-file connections. See Section 4.2.5, “Connection Transport Protocols”

For information about using encrypted connections from the MySQL C API, see Support for Encrypted Connections.

**Table 4.5 Connection-Encryption Option Summary**

<table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  This option is available only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

* `--ssl`, `--skip-ssl`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Note

  The client-side `--ssl` option is deprecated as of MySQL 5.7.11 and is removed in MySQL 8.0. For client programs, use `--ssl-mode` instead:

  + Use `--ssl-mode=REQUIRED` instead of `--ssl=1` or `--enable-ssl`.

  + Use `--ssl-mode=DISABLED` instead of `--ssl=0`, `--skip-ssl`, or `--disable-ssl`.

  + No explicit `--ssl-mode` option is equivalent to no explicit `--ssl` option.

  The server-side `--ssl` option is *not* deprecated.

  By default, MySQL client programs attempt to establish an encrypted connection if the server supports encrypted connections, with further control available through the `--ssl` option: The client-side `--ssl` option works as follows:

  + In the absence of an `--ssl` option, clients attempt to connect using encryption, falling back to an unencrypted connection if an encrypted connection cannot be established.

  + The presence of an explicit `--ssl` option or a synonym (`--ssl=1`, `--enable-ssl`) is prescriptive: Clients require an encrypted connection and fail if one cannot be established.

  + With an `--ssl=0` option or a synonym (`--skip-ssl`, `--disable-ssl`), clients use an unencrypted connection.

  To require use of encrypted connections by a MySQL account, use `CREATE USER` to create the account with a `REQUIRE SSL` clause, or use `ALTER USER` for an existing account to add a `REQUIRE SSL` clause. This causes connection attempts by clients that use the account to be rejected unless MySQL supports encrypted connections and an encrypted connection can be established.

  The `REQUIRE` clause permits other encryption-related options, which can be used to enforce security requirements stricter than `REQUIRE SSL`. For additional details about which command options may or must be specified by clients that connect using accounts configured using the various `REQUIRE` options, see CREATE USER SSL/TLS Options.

  To specify additional parameters for encrypted connections, consider setting at least the `ssl_cert` and `ssl_key` system variables on the server side and the `--ssl-ca` option on the client side. See Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”, which also describes server capabilities for certificate and key file autogeneration and autodiscovery.

* `--ssl-ca=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  The path name of the Certificate Authority (CA) certificate file in PEM format. The file contains a list of trusted SSL Certificate Authorities.

  To tell the client not to authenticate the server certificate when establishing an encrypted connection to the server, specify neither `--ssl-ca` nor `--ssl-capath`. The server still verifies the client according to any applicable requirements established for the client account, and it still uses any `ssl_ca` or `ssl_capath` system variable values specified on the server side.

  To specify the CA file for the server, set the `ssl_ca` system variable.

* `--ssl-capath=dir_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  The path name of the directory that contains trusted SSL certificate authority (CA) certificate files in PEM format. Support for this capability depends on the SSL library used to compile MySQL; see Section 6.3.4, “SSL Library-Dependent Capabilities”.

  To tell the client not to authenticate the server certificate when establishing an encrypted connection to the server, specify neither `--ssl-ca` nor `--ssl-capath`. The server still verifies the client according to any applicable requirements established for the client account, and it still uses any `ssl_ca` or `ssl_capath` system variable values specified on the server side.

  To specify the CA directory for the server, set the `ssl_capath` system variable.

* `--ssl-cert=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>0

  The path name of the client SSL public key certificate file in PEM format.

  To specify the server SSL public key certificate file, set the `ssl_cert` system variable.

* `--ssl-cipher=cipher_list`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>1

  The list of permissible ciphers for connection encryption. If no cipher in the list is supported, encrypted connections do not work.

  For greatest portability, *`cipher_list`* should be a list of one or more cipher names, separated by colons. This format is understood both by OpenSSL and yaSSL. Examples:

  ```sql
  --ssl-cipher=AES128-SHA
  --ssl-cipher=DHE-RSA-AES128-GCM-SHA256:AES128-SHA
  ```

  OpenSSL supports a more flexible syntax for specifying ciphers, as described in the OpenSSL documentation at <https://www.openssl.org/docs/manmaster/man1/ciphers.html>. yaSSL does not, so attempts to use that extended syntax fail for a MySQL distribution compiled using yaSSL.

  For information about which encryption ciphers MySQL supports, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  To specify the encryption ciphers for the server, set the `ssl_cipher` system variable.

* `--ssl-crl=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>2

  The path name of the file containing certificate revocation lists in PEM format. Support for revocation-list capability depends on the SSL library used to compile MySQL. See Section 6.3.4, “SSL Library-Dependent Capabilities”.

  If neither `--ssl-crl` nor `--ssl-crlpath` is given, no CRL checks are performed, even if the CA path contains certificate revocation lists.

  To specify the revocation-list file for the server, set the `ssl_crl` system variable.

* `--ssl-crlpath=dir_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>3

  The path name of the directory that contains certificate revocation-list files in PEM format. Support for revocation-list capability depends on the SSL library used to compile MySQL. See Section 6.3.4, “SSL Library-Dependent Capabilities”.

  If neither `--ssl-crl` nor `--ssl-crlpath` is given, no CRL checks are performed, even if the CA path contains certificate revocation lists.

  To specify the revocation-list directory for the server, set the `ssl_crlpath` system variable.

* `--ssl-key=file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>4

  The path name of the client SSL private key file in PEM format. For better security, use a certificate with an RSA key size of at least 2048 bits.

  If the key file is protected by a passphrase, the client program prompts the user for the passphrase. The password must be given interactively; it cannot be stored in a file. If the passphrase is incorrect, the program continues as if it could not read the key.

  To specify the server SSL private key file, set the `ssl_key` system variable.

* `--ssl-mode=mode`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>5

  This option specifies the desired security state of the connection to the server. These mode values are permissible, in order of increasing strictness:

  + `DISABLED`: Establish an unencrypted connection. This is like the legacy `--ssl=0` option or its synonyms (`--skip-ssl`, `--disable-ssl`).

  + `PREFERRED`: Establish an encrypted connection if the server supports encrypted connections, falling back to an unencrypted connection if an encrypted connection cannot be established. This is the default if `--ssl-mode` is not specified.

    Connections over Unix socket files are not encrypted with a mode of `PREFERRED`. To enforce encryption for Unix socket-file connections, use a mode of `REQUIRED` or stricter. (However, socket-file transport is secure by default, so encrypting a socket-file connection makes it no more secure and increases CPU load.)

  + `REQUIRED`: Establish an encrypted connection if the server supports encrypted connections. The connection attempt fails if an encrypted connection cannot be established.

  + `VERIFY_CA`: Like `REQUIRED`, but additionally verify the server Certificate Authority (CA) certificate against the configured CA certificates. The connection attempt fails if no valid matching CA certificates are found.

  + `VERIFY_IDENTITY`: Like `VERIFY_CA`, but additionally perform host name identity verification by checking the host name the client uses for connecting to the server against the identity in the certificate that the server sends to the client:

    - As of MySQL 5.7.23, if the client uses OpenSSL 1.0.2 or higher, the client checks whether the host name that it uses for connecting matches either the Subject Alternative Name value or the Common Name value in the server certificate. Host name identity verification also works with certificates that specify the Common Name using wildcards.

    - Otherwise, the client checks whether the host name that it uses for connecting matches the Common Name value in the server certificate.

    The connection fails if there is a mismatch. For encrypted connections, this option helps prevent man-in-the-middle attacks. This is like the legacy `--ssl-verify-server-cert` option.

    Note

    Host name identity verification with `VERIFY_IDENTITY` does not work with self-signed certificates that are created automatically by the server or manually using **mysql\_ssl\_rsa\_setup** (see Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”). Such self-signed certificates do not contain the server name as the Common Name value.

  Important

  The default setting, `--ssl-mode=PREFERRED`, produces an encrypted connection if the other default settings are unchanged. However, to help prevent sophisticated man-in-the-middle attacks, it is important for the client to verify the server’s identity. The settings `--ssl-mode=VERIFY_CA` and `--ssl-mode=VERIFY_IDENTITY` are a better choice than the default setting to help prevent this type of attack. To implement one of these settings, you must first ensure that the CA certificate for the server is reliably available to all the clients that use it in your environment, otherwise availability issues will result. For this reason, they are not the default setting.

  The `--ssl-mode` option interacts with CA certificate options as follows:

  + If `--ssl-mode` is not explicitly set otherwise, use of `--ssl-ca` or `--ssl-capath` implies `--ssl-mode=VERIFY_CA`.

  + For `--ssl-mode` values of `VERIFY_CA` or `VERIFY_IDENTITY`, `--ssl-ca` or `--ssl-capath` is also required, to supply a CA certificate that matches the one used by the server.

  + An explicit `--ssl-mode` option with a value other than `VERIFY_CA` or `VERIFY_IDENTITY`, together with an explicit `--ssl-ca` or `--ssl-capath` option, produces a warning that no verification of the server certificate is performed, despite a CA certificate option being specified.

  The `--ssl-mode` option was added in MySQL 5.7.11.

  To require use of encrypted connections by a MySQL account, use `CREATE USER` to create the account with a `REQUIRE SSL` clause, or use `ALTER USER` for an existing account to add a `REQUIRE SSL` clause. This causes connection attempts by clients that use the account to be rejected unless MySQL supports encrypted connections and an encrypted connection can be established.

  The `REQUIRE` clause permits other encryption-related options, which can be used to enforce security requirements stricter than `REQUIRE SSL`. For additional details about which command options may or must be specified by clients that connect using accounts configured using the various `REQUIRE` options, see CREATE USER SSL/TLS Options.

* `--ssl-verify-server-cert`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>6

  Note

  The `--ssl-verify-server-cert` option is deprecated as of MySQL 5.7.11 and is removed in MySQL 8.0. Use `--ssl-mode=VERIFY_IDENTITY` instead.

  This option causes the client to perform host name identity verification by checking the host name the client uses for connecting to the server against the identity in the certificate that the server sends to the client:

  + As of MySQL 5.7.23, if the client uses OpenSSL 1.0.2 or higher, the client checks whether the host name that it uses for connecting matches either the Subject Alternative Name value or the Common Name value in the server certificate.

  + Otherwise, the client checks whether the host name that it uses for connecting matches the Common Name value in the server certificate.

  The connection fails if there is a mismatch. For encrypted connections, this option helps prevent man-in-the-middle attacks. Host name identity verification is disabled by default.

  Note

  Host name identity verification does not work with self-signed certificates created automatically by the server, or manually using **mysql\_ssl\_rsa\_setup** (see Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”). Such self-signed certificates do not contain the server name as the Common Name value.

  Host name identity verification also does not work with certificates that specify the Common Name using wildcards because that name is compared verbatim to the server name.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">localhost</code></td> </tr></tbody></table>7

  This option specifies the TLS protocols the client permits for encrypted connections. The value is a list of one or more comma-separated protocol versions. For example:

  ```sql
  mysql --tls-version="TLSv1.1,TLSv1.2"
  ```

  The protocols that can be named for this option depend on the SSL library used to compile MySQL. Permitted protocols should be chosen such as not to leave “holes” in the list. For example, these values do not have holes:

  ```sql
  --tls-version="TLSv1,TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.1,TLSv1.2"
  --tls-version="TLSv1.2"
  ```

  This value does have a hole and should not be used:

  ```sql
  --tls-version="TLSv1,TLSv1.2"
  ```

  For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

  To specify which TLS protocols the server permits, set the `tls_version` system variable.
