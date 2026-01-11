### 6.2.5 Connecting to the Server Using URI-Like Strings or Key-Value Pairs

This section describes use of URI-like connection strings or key-value pairs to specify how to establish connections to the MySQL server, for clients such as MySQL Shell. For information on establishing connections using command-line options, for clients such as **mysql** or **mysqldump**, see Section 6.2.4, “Connecting to the MySQL Server Using Command Options”. For additional information if you are unable to connect, see Section 8.2.22, “Troubleshooting Problems Connecting to MySQL”.

Note

The term “URI-like” signifies connection-string syntax that is similar to but not identical to the URI (uniform resource identifier) syntax defined by RFC 3986.

The following MySQL clients support connecting to a MySQL server using a URI-like connection string or key-value pairs:

* MySQL Shell
* MySQL Connectors which implement X DevAPI

This section documents all valid URI-like string and key-value pair connection parameters, many of which are similar to those specified with command-line options:

* Parameters specified with a URI-like string use a syntax such as `myuser@example.com:3306/main-schema`. For the full syntax, see Connecting Using URI-Like Connection Strings.

* Parameters specified with key-value pairs use a syntax such as `{user:'myuser', host:'example.com', port:3306, schema:'main-schema'}`. For the full syntax, see Connecting Using Key-Value Pairs.

Connection parameters are not case-sensitive. Each parameter, if specified, can be given only once. If a parameter is specified more than once, an error occurs.

This section covers the following topics:

* Base Connection Parameters
* Additional Connection parameters
* Connecting Using URI-Like Connection Strings
* Connecting Using Key-Value Pairs

#### Base Connection Parameters

The following discussion describes the parameters available when specifying a connection to MySQL. These parameters can be provided using either a string that conforms to the base URI-like syntax (see Connecting Using URI-Like Connection Strings), or as key-value pairs (see Connecting Using Key-Value Pairs).

* *`scheme`*: The transport protocol to use. Use `mysqlx` for X Protocol connections and `mysql` for classic MySQL protocol connections. If no protocol is specified, the server attempts to guess the protocol. Connectors that support DNS SRV can use the `mysqlx+srv` scheme (see Connections Using DNS SRV Records).

* *`user`*: The MySQL user account to provide for the authentication process.

* *`password`*: The password to use for the authentication process.

  Warning

  Specifying an explicit password in the connection specification is insecure and not recommended. Later discussion shows how to cause an interactive prompt for the password to occur.

* *`host`*: The host on which the server instance is running. The value can be a host name, IPv4 address, or IPv6 address. If no host is specified, the default is `localhost`.

* *`port`*: The TCP/IP network port on which the target MySQL server is listening for connections. If no port is specified, the default is 33060 for X Protocol connections and 3306 for classic MySQL protocol connections.

* *`socket`*: The path to a Unix socket file or the name of a Windows named pipe. Values are local file paths. In URI-like strings, they must be encoded, using either percent encoding or by surrounding the path with parentheses. Parentheses eliminate the need to percent encode characters such as the `/` directory separator character. For example, to connect as `root@localhost` using the Unix socket `/tmp/mysql.sock`, specify the path using percent encoding as `root@localhost?socket=%2Ftmp%2Fmysql.sock`, or using parentheses as `root@localhost?socket=(/tmp/mysql.sock)`.

* *`schema`*: The default database for the connection. If no database is specified, the connection has no default database.

The handling of `localhost` on Unix depends on the type of transport protocol. Connections using classic MySQL protocol handle `localhost` the same way as other MySQL clients, which means that `localhost` is assumed to be for socket-based connections. For connections using X Protocol, the behavior of `localhost` differs in that it is assumed to represent the loopback address, for example, IPv4 address 127.0.0.1.

#### Additional Connection parameters

You can specify options for the connection, either as attributes in a URI-like string by appending `?attribute=value`, or as key-value pairs. The following options are available:

* `ssl-mode`: The desired security state for the connection. The following modes are permissible:

  + `DISABLED`
  + `PREFERRED`
  + `REQUIRED`
  + `VERIFY_CA`
  + `VERIFY_IDENTITY`

  Important

  `VERIFY_CA` and `VERIFY_IDENTITY` are better choices than the default `PREFERRED`, because they help prevent man-in-the-middle attacks.

  For information about these modes, see the `--ssl-mode` option description in Command Options for Encrypted Connections.

* `ssl-ca`: The path to the X.509 certificate authority file in PEM format.

* `ssl-capath`: The path to the directory that contains the X.509 certificates authority files in PEM format.

* `ssl-cert`: The path to the X.509 certificate file in PEM format.

* `ssl-cipher`: The encryption cipher to use for connections that use TLS protocols up through TLSv1.2.

* `ssl-crl`: The path to the file that contains certificate revocation lists in PEM format.

* `ssl-crlpath`: The path to the directory that contains certificate revocation-list files in PEM format.

* `ssl-key`: The path to the X.509 key file in PEM format.

* `tls-version`: The TLS protocols permitted for classic MySQL protocol encrypted connections. This option is supported by MySQL Shell only. The value of `tls-version` (singular) is a comma separated list, for example `TLSv1.2,TLSv1.3`. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. This option depends on the `ssl-mode` option not being set to `DISABLED`.

* `tls-versions`: The permissible TLS protocols for encrypted X Protocol connections. The value of `tls-versions` (plural) is an array such as `[TLSv1.2,TLSv1.3]`. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. This option depends on the `ssl-mode` option not being set to `DISABLED`.

* `tls-ciphersuites`: The permitted TLS cipher suites. The value of `tls-ciphersuites` is a list of IANA cipher suite names as listed at TLS Ciphersuites. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. This option depends on the `ssl-mode` option not being set to `DISABLED`.

* `auth-method`: The authentication method to use for the connection. The default is `AUTO`, meaning that the server attempts to guess. The following methods are permissible:

  + `AUTO`
  + `MYSQL41`
  + `SHA256_MEMORY`
  + `FROM_CAPABILITIES`
  + `FALLBACK`
  + `PLAIN`

  For X Protocol connections, any configured `auth-method` is overridden to this sequence of authentication methods: `MYSQL41`, `SHA256_MEMORY`, `PLAIN`.

* `get-server-public-key`: Request from the server the public key required for RSA key pair-based password exchange. Use when connecting to MySQL 8+ servers over classic MySQL protocol with SSL mode `DISABLED`. You must specify the protocol in this case. For example:

  ```
  mysql://user@localhost:3306?get-server-public-key=true
  ```

  This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `server-public-key-path`: The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. Use when connecting to MySQL 8+ servers over classic MySQL protocol with SSL mode `DISABLED`.

  This option applies to clients that authenticate with the `sha256_password` (deprecated) or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `get-server-public-key`.

  For information about the `sha256_password` (deprecated) and `caching_sha2_password` plugins, see Section 8.4.1.2, “SHA-256 Pluggable Authentication”, and Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `ssh`: The URI for connection to an SSH server to access a MySQL server instance using SSH tunneling. The URI format is `[user@]host[:port]`. Use the `uri` option to specify the URI of the target MySQL server instance. For information on SSH tunnel connections from MySQL Shell, see Using an SSH Tunnel.

* `uri`: The URI for a MySQL server instance that is to be accessed through an SSH tunnel from the server specified by the `ssh` option. The URI format is `[scheme://][user@]host[:port]`. Do not use the base connection parameters (`scheme`, `user`, `host`, `port`) to specify the MySQL server connection for SSH tunneling, just use the `uri` option.

* `ssh-password`: The password for the connection to the SSH server.

  Warning

  Specifying an explicit password in the connection specification is insecure and not recommended. MySQL Shell prompts for a password interactively when one is required.

* `ssh-config-file`: The SSH configuration file for the connection to the SSH server. You can use the MySQL Shell configuration option `ssh.configFile` to set a custom file as the default if this option is not specified. If `ssh.configFile` has not been set, the default is the standard SSH configuration file `~/.ssh/config`.

* `ssh-identity-file`: The identity file to use for the connection to the SSH server. The default if this option is not specified is any identity file configured in an SSH agent (if used), or in the SSH configuration file, or the standard private key file in the SSH configuration folder (`~/.ssh/id_rsa`).

* `ssh-identity-pass`: The passphrase for the identity file specified by the `ssh-identity-file` option.

  Warning

  Specifying an explicit password in the connection specification is insecure and not recommended. MySQL Shell prompts for a password interactively when one is required.

* `connect-timeout`: An integer value used to configure the number of seconds that clients, such as MySQL Shell, wait until they stop trying to connect to an unresponsive MySQL server.

* `compression`: This option requests or disables compression for the connection.

  The values available for this option are: `required`, which requests compression and fails if the server does not support it; `preferred`, which requests compression and falls back to an uncompressed connection; and `disabled`, which requests an uncompressed connection and fails if the server does not permit those. `preferred` is the default for X Protocol connections, and `disabled` is the default for classic MySQL protocol connections. For information on X Plugin connection compression control, see Section 22.5.5, “Connection Compression with X Plugin”.

  Note

  Different MySQL clients implement their support for connection compression differently. Consult your client's documentation for details.

* `compression-algorithms` and `compression-level`: These options are available in MySQL Shell for more control over connection compression. You can specify them to select the compression algorithm used for the connection, and the numeric compression level used with that algorithm. You can also use `compression-algorithms` in place of `compression` to request compression for the connection. For information on MySQL Shell's connection compression control, see Using Compressed Connections.

* `connection-attributes`: Controls the key-value pairs that application programs pass to the server at connect time. For general information about connection attributes, see Section 29.12.9, “Performance Schema Connection Attribute Tables”. Clients usually define a default set of attributes, which can be disabled or enabled. For example:

  ```
  mysqlx://user@host?connection-attributes
  mysqlx://user@host?connection-attributes=true
  mysqlx://user@host?connection-attributes=false
  ```

  The default behavior is to send the default attribute set. Applications can specify attributes to be passed in addition to the default attributes. You specify additional connection attributes as a `connection-attributes` parameter in a connection string. The `connection-attributes` parameter value must be empty (the same as specifying `true`), a `Boolean` value (`true` or `false` to enable or disable the default attribute set), or a list or zero or more `key=value` specifiers separated by commas (to be sent in addition to the default attribute set). Within a list, a missing key value evaluates as an empty string. Further examples:

  ```
  mysqlx://user@host?connection-attributes=[attr1=val1,attr2,attr3=]
  mysqlx://user@host?connection-attributes=[]
  ```

  Application-defined attribute names cannot begin with `_` because such names are reserved for internal attributes.

#### Connecting Using URI-Like Connection Strings

You can specify a connection to MySQL Server using a URI-like string. Such strings can be used with the MySQL Shell with the `--uri` command option, the MySQL Shell `\connect` command, and MySQL Connectors which implement X DevAPI.

Note

The term “URI-like” signifies connection-string syntax that is similar to but not identical to the URI (uniform resource identifier) syntax defined by RFC 3986.

A URI-like connection string has the following syntax:

```
[scheme://][user[:[password@]host[:port][/schema][?attribute1=value1&attribute2=value2...
```

Important

Percent encoding must be used for reserved characters in the elements of the URI-like string. For example, if you specify a string that includes the `@` character, the character must be replaced by `%40`. If you include a zone ID in an IPv6 address, the `%` character used as the separator must be replaced with `%25`.

The parameters you can use in a URI-like connection string are described at Base Connection Parameters.

MySQL Shell's `shell.parseUri()` and `shell.unparseUri()` methods can be used to deconstruct and assemble a URI-like connection string. Given a URI-like connection string, `shell.parseUri()` returns a dictionary containing each element found in the string. `shell.unparseUri()` converts a dictionary of URI components and connection options into a valid URI-like connection string for connecting to MySQL, which can be used in MySQL Shell or by MySQL Connectors which implement X DevAPI.

If no password is specified in the URI-like string, which is recommended, interactive clients prompt for the password. The following examples show how to specify URI-like strings with the user name *`user_name`*. In each case, the password is prompted for.

* An X Protocol connection to a local server instance listening at port 33065.

  ```
  mysqlx://user_name@localhost:33065
  ```

* A classic MySQL protocol connection to a local server instance listening at port 3333.

  ```
  mysql://user_name@localhost:3333
  ```

* An X Protocol connection to a remote server instance, using a host name, an IPv4 address, and an IPv6 address.

  ```
  mysqlx://user_name@server.example.com/
  mysqlx://user_name@198.51.100.14:123
  mysqlx://user_name@[2001:db8:85a3:8d3:1319:8a2e:370:7348]
  ```

* An X Protocol connection using a socket, with the path provided using either percent encoding or parentheses.

  ```
  mysqlx://user_name@/path%2Fto%2Fsocket.sock
  mysqlx://user_name@(/path/to/socket.sock)
  ```

* An optional path can be specified, which represents a database.

  ```
  # use 'world' as the default database
  mysqlx://user_name@198.51.100.1/world

  # use 'world_x' as the default database, encoding _ as %5F
  mysqlx://user_name@198.51.100.2:33060/world%5Fx
  ```

* An optional query can be specified, consisting of values each given as a `key=value` pair or as a single *`key`*. To specify multiple values, separate them by `,` characters. A mix of `key=value` and *`key`* values is permissible. Values can be of type list, with list values ordered by appearance. Strings must be either percent encoded or surrounded by parentheses. The following are equivalent.

  ```
  ssluser@127.0.0.1?ssl-ca=%2Froot%2Fclientcert%2Fca-cert.pem\
  &ssl-cert=%2Froot%2Fclientcert%2Fclient-cert.pem\
  &ssl-key=%2Froot%2Fclientcert%2Fclient-key

  ssluser@127.0.0.1?ssl-ca=(/root/clientcert/ca-cert.pem)\
  &ssl-cert=(/root/clientcert/client-cert.pem)\
  &ssl-key=(/root/clientcert/client-key)
  ```

* To specify a TLS version and ciphersuite to use for encrypted connections:

  ```
  mysql://user_name@198.51.100.2:3306/world%5Fx?\
  tls-versions=[TLSv1.2,TLSv1.3]&tls-ciphersuites=[TLS_DHE_PSK_WITH_AES_128_\
  GCM_SHA256, TLS_CHACHA20_POLY1305_SHA256]
  ```

The previous examples assume that connections require a password. With interactive clients, the specified user's password is requested at the login prompt. If the user account has no password (which is insecure and not recommended), or if socket peer-credential authentication is in use (for example, with Unix socket connections), you must explicitly specify in the connection string that no password is being provided and the password prompt is not required. To do this, place a `:` after the *`user_name`* in the string but do not specify a password after it. For example:

```
mysqlx://user_name:@localhost
```

#### Connecting Using Key-Value Pairs

In MySQL Shell and some MySQL Connectors which implement X DevAPI, you can specify a connection to MySQL Server using key-value pairs, supplied in language-natural constructs for the implementation. For example, you can supply connection parameters using key-value pairs as a JSON object in JavaScript, or as a dictionary in Python. Regardless of the way the key-value pairs are supplied, the concept remains the same: the keys as described in this section can be assigned values that are used to specify a connection. You can specify connections using key-value pairs in MySQL Shell's `shell.connect()` method or InnoDB Cluster's `dba.createCluster()` method, and with some of the MySQL Connectors which implement X DevAPI.

Generally, key-value pairs are surrounded by `{` and `}` characters and the `,` character is used as a separator between key-value pairs. The `:` character is used between keys and values, and strings must be delimited (for example, using the `'` character). It is not necessary to percent encode strings, unlike URI-like connection strings.

A connection specified as key-value pairs has the following format:

```
{ key: value, key: value, ...}
```

The parameters you can use as keys for a connection are described at Base Connection Parameters.

If no password is specified in the key-value pairs, which is recommended, interactive clients prompt for the password. The following examples show how to specify connections using key-value pairs with the user name `'user_name'`. In each case, the password is prompted for.

* An X Protocol connection to a local server instance listening at port 33065.

  ```
  {user:'user_name', host:'localhost', port:33065}
  ```

* A classic MySQL protocol connection to a local server instance listening at port 3333.

  ```
  {user:'user_name', host:'localhost', port:3333}
  ```

* An X Protocol connection to a remote server instance, using a host name, an IPv4 address, and an IPv6 address.

  ```
  {user:'user_name', host:'server.example.com'}
  {user:'user_name', host:198.51.100.14:123}
  {user:'user_name', host:[2001:db8:85a3:8d3:1319:8a2e:370:7348]}
  ```

* An X Protocol connection using a socket.

  ```
  {user:'user_name', socket:'/path/to/socket/file'}
  ```

* An optional schema can be specified, which represents a database.

  ```
  {user:'user_name', host:'localhost', schema:'world'}
  ```

The previous examples assume that connections require a password. With interactive clients, the specified user's password is requested at the login prompt. If the user account has no password (which is insecure and not recommended), or if socket peer-credential authentication is in use (for example, with Unix socket connections), you must explicitly specify that no password is being provided and the password prompt is not required. To do this, provide an empty string using `''` after the `password` key. For example:

```
{user:'user_name', password:'', host:'localhost'}
```
