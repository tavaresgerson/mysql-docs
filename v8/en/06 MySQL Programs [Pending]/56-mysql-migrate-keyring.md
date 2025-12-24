### 6.6.8 `mysql_migrate_keyring` — Keyring Key Migration Utility

The `mysql_migrate_keyring` utility migrates keys between one keyring component and another. It supports offline and online migrations.

Invoke `mysql_migrate_keyring` like this (enter the command on a single line):

```
mysql_migrate_keyring
  --component-dir=dir_name
  --source-keyring=name
  --destination-keyring=name
  [other options]
```

For information about key migrations and instructions describing how to perform them using `mysql_migrate_keyring` and other methods, see Section 8.4.4.11, “Migrating Keys Between Keyring Keystores”.

`mysql_migrate_keyring` supports the following options, which can be specified on the command line or in the `[mysql_migrate_keyring]` group of an option file. For information about option files used by MySQL programs, see  Section 6.2.2.2, “Using Option Files”.

**Table 6.19 `mysql_migrate_keyring` Options**

<table>
   <thead>
      <tr>
         <th>Option Name</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--component-dir</code></td>
         <td>Directory for keyring components</td>
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
         <td><code>--destination-keyring</code></td>
         <td>Destination keyring component name</td>
      </tr>
      <tr>
         <td><code>--destination-keyring-configuration-dir</code></td>
         <td>Destination keyring component configuration directory</td>
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
         <td><code>--login-path</code></td>
         <td>Read login path options from .mylogin.cnf</td>
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
         <td><code>--online-migration</code></td>
         <td>Migration source is an active server</td>
      </tr>
      <tr>
         <td><code>--password</code></td>
         <td>Password to use when connecting to server</td>
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
         <td><code>--server-public-key-path</code></td>
         <td>Path name to file containing RSA public key</td>
      </tr>
      <tr>
         <td><code>--socket</code></td>
         <td>Unix socket file or Windows named pipe to use</td>
      </tr>
      <tr>
         <td><code>--source-keyring</code></td>
         <td>Source keyring component name</td>
      </tr>
      <tr>
         <td><code>--source-keyring-configuration-dir</code></td>
         <td>Source keyring component configuration directory</td>
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
         <td>Whether to enable <code>FIPS</code> mode on client side</td>
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
   </tbody>
</table>

*  `--help`, `-h`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.
*  `--component-dir=dir_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--component-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where keyring components are located. This is typically the value of the `plugin_dir` system variable for the local MySQL server.

  ::: info Note

   `--component-dir`, `--source-keyring`, and `--destination-keyring` are mandatory for all keyring migration operations performed by  `mysql_migrate_keyring`. In addition, the source and destination components must differ, and both components must be properly configured so that  `mysql_migrate_keyring` can load and use them.

  :::
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, `mysql_migrate_keyring` normally reads the `[mysql_migrate_keyring]` group. If this option is given as `--defaults-group-suffix=_other`, `mysql_migrate_keyring` also reads the `[mysql_migrate_keyring_other]` group.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--destination-keyring=name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--destination-keyring=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The destination keyring component for key migration. The format and interpretation of the option value is the same as described for the `--source-keyring` option.

  ::: info Note

   `--component-dir`, `--source-keyring`, and `--destination-keyring` are mandatory for all keyring migration operations performed by  `mysql_migrate_keyring`. In addition, the source and destination components must differ, and both components must be properly configured so that  `mysql_migrate_keyring` can load and use them.

  :::
*  `--destination-keyring-configuration-dir=dir_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--destination-keyring-configuration-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  This option applies only if the destination keyring component global configuration file contains `"read_local_config": true`, indicating that component configuration is contained in the local configuration file. The option value specifies the directory containing that local file.
*  `--get-server-public-key`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
*  `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  The host location of the running server that is currently using one of the key migration keystores. Migration always occurs on the local host, so the option always specifies a value for connecting to a local server, such as `localhost`, `127.0.0.1`, `::1`, or the local host IP address or host name.
*  `--login-path=name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the `mysql_config_editor` utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-login-paths`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

  See `--login-path` for related information.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-defaults`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the  `mysql_config_editor` utility.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--online-migration`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--online-migration</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  This option is mandatory when a running server is using the keyring. It tells  `mysql_migrate_keyring` to perform an online key migration. The option has these effects:

  +  `mysql_migrate_keyring` connects to the server using any connection options specified; these options are otherwise ignored.
  + After  `mysql_migrate_keyring` connects to the server, it tells the server to pause keyring operations. When key copying is complete, `mysql_migrate_keyring` tells the server it can resume keyring operations before disconnecting.
*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. The password value is optional. If not given,  `mysql_migrate_keyring` prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that `mysql_migrate_keyring` should not prompt for one, use the `--skip-password` option.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number for connecting to the running server that is currently using one of the key migration keystores.
*  `--print-defaults`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--server-public-key-path=file_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` (deprecated) or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password` (deprecated), this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
*  `--socket=path`, `-S path`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--socket={file_name|pipe_name}</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  For Unix socket file or Windows named pipe connections, the socket file or named pipe for connecting to the running server that is currently using one of the key migration keystores.

  On Windows, this option applies only if the server was started with the  `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.
*  `--source-keyring=name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--source-keyring=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The source keyring component for key migration. This is the component library file name specified without any platform-specific extension such as `.so` or `.dll`. For example, to use the component for which the library file is `component_keyring_file.so`, specify the option as `--source-keyring=component_keyring_file`.

  ::: info Note

  `--component-dir`, `--source-keyring`, and `--destination-keyring` are mandatory for all keyring migration operations performed by  `mysql_migrate_keyring`. In addition, the source and destination components must differ, and both components must be properly configured so that  `mysql_migrate_keyring` can load and use them.

  :::
*  `--source-keyring-configuration-dir=dir_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--source-keyring-configuration-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  This option applies only if the source keyring component global configuration file contains `"read_local_config": true`, indicating that component configuration is contained in the local configuration file. The option value specifies the directory containing that local file.
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

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user name of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Produce more output about what the program does.
*  `--version`, `-V`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Display version information and exit.
