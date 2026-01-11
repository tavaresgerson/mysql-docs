### 6.6.8 mysql\_migrate\_keyring — Keyring Key Migration Utility

The **mysql\_migrate\_keyring** utility migrates keys between one keyring component and another. It supports offline and online migrations.

Invoke **mysql\_migrate\_keyring** like this (enter the command on a single line):

```
mysql_migrate_keyring
  --component-dir=dir_name
  --source-keyring=name
  --destination-keyring=name
  [other options]
```

For information about key migrations and instructions describing how to perform them using **mysql\_migrate\_keyring** and other methods, see Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

**mysql\_migrate\_keyring** supports the following options, which can be specified on the command line or in the `[mysql_migrate_keyring]` group of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.20 mysql\_migrate\_keyring Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_migrate_keyring."><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--component-dir</td> <td>Directory for keyring components</td> </tr><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--defaults-group-suffix</td> <td>Option group suffix value</td> </tr><tr><td>--destination-keyring</td> <td>Destination keyring component name</td> </tr><tr><td>--destination-keyring-configuration-dir</td> <td>Destination keyring component configuration directory</td> </tr><tr><td>--get-server-public-key</td> <td>Request RSA public key from server</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--host</td> <td>Host on which MySQL server is located</td> </tr><tr><td>--login-path</td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--no-login-paths</td> <td>Do not read login paths from the login path file</td> </tr><tr><td>--online-migration</td> <td>Migration source is an active server</td> </tr><tr><td>--password</td> <td>Password to use when connecting to server</td> </tr><tr><td>--port</td> <td>TCP/IP port number for connection</td> </tr><tr><td>--print-defaults</td> <td>Print default options</td> </tr><tr><td>--server-public-key-path</td> <td>Path name to file containing RSA public key</td> </tr><tr><td>--socket</td> <td>Unix socket file or Windows named pipe to use</td> </tr><tr><td>--source-keyring</td> <td>Source keyring component name</td> </tr><tr><td>--source-keyring-configuration-dir</td> <td>Source keyring component configuration directory</td> </tr><tr><td>--ssl-ca</td> <td>File that contains list of trusted SSL Certificate Authorities</td> </tr><tr><td>--ssl-capath</td> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> </tr><tr><td>--ssl-cert</td> <td>File that contains X.509 certificate</td> </tr><tr><td>--ssl-cipher</td> <td>Permissible ciphers for connection encryption</td> </tr><tr><td>--ssl-crl</td> <td>File that contains certificate revocation lists</td> </tr><tr><td>--ssl-crlpath</td> <td>Directory that contains certificate revocation-list files</td> </tr><tr><td>--ssl-fips-mode</td> <td>Whether to enable FIPS mode on client side</td> </tr><tr><td>--ssl-key</td> <td>File that contains X.509 key</td> </tr><tr><td>--ssl-mode</td> <td>Desired security state of connection to server</td> </tr><tr><td>--ssl-session-data</td> <td>File that contains SSL session data</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Whether to establish connections if session reuse fails</td> </tr><tr><td>--tls-ciphersuites</td> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> </tr><tr><td>--tls-sni-servername</td> <td>Server name supplied by the client</td> </tr><tr><td>--tls-version</td> <td>Permissible TLS protocols for encrypted connections</td> </tr><tr><td>--user</td> <td>MySQL user name to use when connecting to server</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr></tbody></table>

* `--help`, `-h`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--component-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where keyring components are located. This is typically the value of the `plugin_dir` system variable for the local MySQL server.

  Note

  `--component-dir`, `--source-keyring`, and `--destination-keyring` are mandatory for all keyring migration operations performed by **mysql\_migrate\_keyring**. In addition, the source and destination components must differ, and both components must be properly configured so that **mysql\_migrate\_keyring** can load and use them.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysql\_migrate\_keyring** normally reads the `[mysql_migrate_keyring]` group. If this option is given as `--defaults-group-suffix=_other`, **mysql\_migrate\_keyring** also reads the `[mysql_migrate_keyring_other]` group.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--destination-keyring=name`

  <table frame="box" rules="all" summary="Properties for destination-keyring"><tbody><tr><th>Command-Line Format</th> <td><code>--destination-keyring=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The destination keyring component for key migration. The format and interpretation of the option value is the same as described for the `--source-keyring` option.

  Note

  `--component-dir`, `--source-keyring`, and `--destination-keyring` are mandatory for all keyring migration operations performed by **mysql\_migrate\_keyring**. In addition, the source and destination components must differ, and both components must be properly configured so that **mysql\_migrate\_keyring** can load and use them.

* `--destination-keyring-configuration-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for destination-keyring-configuration-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--destination-keyring-configuration-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  This option applies only if the destination keyring component global configuration file contains `"read_local_config": true`, indicating that component configuration is contained in the local configuration file. The option value specifies the directory containing that local file.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  The host location of the running server that is currently using one of the key migration keystores. Migration always occurs on the local host, so the option always specifies a value for connecting to a local server, such as `localhost`, `127.0.0.1`, `::1`, or the local host IP address or host name.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Skips reading options from the login path file.

  See `--login-path` for related information.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--online-migration`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  This option is mandatory when a running server is using the keyring. It tells **mysql\_migrate\_keyring** to perform an online key migration. The option has these effects:

  + **mysql\_migrate\_keyring** connects to the server using any connection options specified; these options are otherwise ignored.

  + After **mysql\_migrate\_keyring** connects to the server, it tells the server to pause keyring operations. When key copying is complete, **mysql\_migrate\_keyring** tells the server it can resume keyring operations before disconnecting.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  The password of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. The password value is optional. If not given, **mysql\_migrate\_keyring** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysql\_migrate\_keyring** should not prompt for one, use the `--skip-password` option.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  For TCP/IP connections, the port number for connecting to the running server that is currently using one of the key migration keystores.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.2, “SHA-256 Pluggable Authentication”, and Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  For Unix socket file or Windows named pipe connections, the socket file or named pipe for connecting to the running server that is currently using one of the key migration keystores.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--source-keyring=name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  The source keyring component for key migration. This is the component library file name specified without any platform-specific extension such as `.so` or `.dll`. For example, to use the component for which the library file is `component_keyring_file.so`, specify the option as `--source-keyring=component_keyring_file`.

  Note

  `--component-dir`, `--source-keyring`, and `--destination-keyring` are mandatory for all keyring migration operations performed by **mysql\_migrate\_keyring**. In addition, the source and destination components must differ, and both components must be properly configured so that **mysql\_migrate\_keyring** can load and use them.

* `--source-keyring-configuration-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

  This option applies only if the source keyring component global configuration file contains `"read_local_config": true`, indicating that component configuration is contained in the local configuration file. The option value specifies the directory containing that local file.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  This option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

  When specified, the name is passed to the `libmysqlclient` C API library using the `MYSQL_OPT_TLS_SNI_SERVERNAME` option of `mysql_options()`. The server name is not case-sensitive. To show which server name the client specified for the current session, if any, check the `Tls_sni_server_name` status variable.

  Server Name Indication (SNI) is an extension to the TLS protocol (OpenSSL must be compiled using TLS extensions for this option to function). The MySQL implementation of SNI represents the client-side only.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

  The user name of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>6

  Verbose mode. Produce more output about what the program does.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for component-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>7

  Display version information and exit.
