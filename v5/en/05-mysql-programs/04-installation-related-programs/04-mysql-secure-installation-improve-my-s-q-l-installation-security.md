### 4.4.4 mysql_secure_installation — Improve MySQL Installation Security

This program enables you to improve the security of your MySQL installation in the following ways:

* You can set a password for `root` accounts.
* You can remove `root` accounts that are accessible from outside the local host.

* You can remove anonymous-user accounts.
* You can remove the `test` database (which by default can be accessed by all users, even anonymous users), and privileges that permit anyone to access databases with names that start with `test_`.

**mysql_secure_installation** helps you implement security recommendations similar to those described at Section 2.9.4, “Securing the Initial MySQL Account”.

Normal usage is to connect to the local MySQL server; invoke **mysql_secure_installation** without arguments:

```sql
mysql_secure_installation
```

When executed, **mysql_secure_installation** prompts you to determine which actions to perform.

The `validate_password` plugin can be used for password strength checking. If the plugin is not installed, **mysql_secure_installation** prompts the user whether to install it. Any passwords entered later are checked using the plugin if it is enabled.

Most of the usual MySQL client options such as `--host` and `--port` can be used on the command line and in option files. For example, to connect to the local server over IPv6 using port 3307, use this command:

```sql
mysql_secure_installation --host=::1 --port=3307
```

**mysql_secure_installation** supports the following options, which can be specified on the command line or in the `[mysql_secure_installation]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.10 mysql_secure_installation Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_secure_installation."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th>Option Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th>--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> </tr><tr><th>--defaults-file</th> <td>Read only named option file</td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> </tr><tr><th>--help</th> <td>Display help message and exit</td> <td></td> </tr><tr><th>--host</th> <td>Host on which MySQL server is located</td> <td></td> </tr><tr><th>--no-defaults</th> <td>Read no option files</td> <td></td> </tr><tr><th>--password</th> <td>Accepted but always ignored. Whenever mysql_secure_installation is invoked, the user is prompted for a password, regardless</td> <td></td> </tr><tr><th>--port</th> <td>TCP/IP port number for connection</td> <td></td> </tr><tr><th>--print-defaults</th> <td>Print default options</td> <td></td> </tr><tr><th>--protocol</th> <td>Transport protocol to use</td> <td></td> </tr><tr><th>--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> </tr><tr><th>--ssl</th> <td>Enable connection encryption</td> <td></td> </tr><tr><th>--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> </tr><tr><th>--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> </tr><tr><th>--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> </tr><tr><th>--ssl-key</th> <td>File that contains X.509 key</td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Desired security state of connection to server</td> <td>5.7.11</td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verify host name against server certificate Common Name identity</td> <td></td> </tr><tr><th>--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td>5.7.10</td> </tr><tr><th>--use-default</th> <td>Execute with no user interactivity</td> <td></td> </tr><tr><th>--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysql_secure_installation** normally reads the `[client]` and `[mysql_secure_installation]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysql_secure_installation** also reads the `[client_other]` and `[mysql_secure_installation_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password=password`, `-p password`

  <table frame="box" rules="all" summary="Properties for password"><tbody><tr><th>Command-Line Format</th> <td><code>--password=password</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  This option is accepted but ignored. Whether or not this option is used, **mysql_secure_installation** always prompts the user for a password.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--use-default`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Execute noninteractively. This option can be used for unattended installation operations.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.
