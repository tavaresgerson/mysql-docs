### 6.2.7 Connection Transport Protocols

For programs that use the MySQL client library (for example, `mysql` and  `mysqldump`), MySQL supports connections to the server based on several transport protocols: TCP/IP, Unix socket file, named pipe, and shared memory. This section describes how to select these protocols, and how they are similar and different.

*  Transport Protocol Selection
*  Transport Support for Local and Remote Connections
*  Interpretation of localhost
*  Encryption and Security Characteristics
*  Connection Compression

#### Transport Protocol Selection

For a given connection, if the transport protocol is not specified explicitly, it is determined implicitly. For example, connections to `localhost` result in a socket file connection on Unix and Unix-like systems, and a TCP/IP connection to `127.0.0.1` otherwise. For additional information, see  Section 6.2.4, “Connecting to the MySQL Server Using Command Options”.

To specify the protocol explicitly, use the `--protocol` command option. The following table shows the permissible values for `--protocol` and indicates the applicable platforms for each value. The values are not case-sensitive.

<table><col style="width: 20%"/><col style="width: 50%"/><col style="width: 30%"/><thead><tr> <th scope="col"><code class="option">--protocol</code> Value</th> <th scope="col">Transport Protocol Used</th> <th scope="col">Applicable Platforms</th> </tr></thead><tbody><tr> <th><code>TCP</code></th> <td>TCP/IP</td> <td>All</td> </tr><tr> <th><code>SOCKET</code></th> <td>Unix socket file</td> <td>Unix and Unix-like systems</td> </tr><tr> <th><code>PIPE</code></th> <td>Named pipe</td> <td>Windows</td> </tr><tr> <th><code>MEMORY</code></th> <td>Shared memory</td> <td>Windows</td> </tr></tbody></table>

#### Transport Support for Local and Remote Connections

TCP/IP transport supports connections to local or remote MySQL servers.

Socket-file, named-pipe, and shared-memory transports support connections only to local MySQL servers. (Named-pipe transport does allow for remote connections, but this capability is not implemented in MySQL.)

#### Interpretation of localhost

If the transport protocol is not specified explicitly, `localhost` is interpreted as follows:

* On Unix and Unix-like systems, a connection to `localhost` results in a socket-file connection.
* Otherwise, a connection to `localhost` results in a TCP/IP connection to `127.0.0.1`.

If the transport protocol is specified explicitly, `localhost` is interpreted with respect to that protocol. For example, with `--protocol=TCP`, a connection to `localhost` results in a TCP/IP connection to `127.0.0.1` on all platforms.

#### Encryption and Security Characteristics

TCP/IP and socket-file transports are subject to TLS/SSL encryption, using the options described in Command Options for Encrypted Connections. Named-pipe and shared-memory transports are not subject to TLS/SSL encryption.

A connection is secure by default if made over a transport protocol that is secure by default. Otherwise, for protocols that are subject to TLS/SSL encryption, a connection may be made secure using encryption:

* TCP/IP connections are not secure by default, but can be encrypted to make them secure.
* Socket-file connections are secure by default. They can also be encrypted, but encrypting a socket-file connection makes it no more secure and increases CPU load.
* Named-pipe connections are not secure by default, and are not subject to encryption to make them secure. However, the `named_pipe_full_access_group` system variable is available to control which MySQL users are permitted to use named-pipe connections.
* Shared-memory connections are secure by default.

If the  `require_secure_transport` system variable is enabled, the server permits only connections that use some form of secure transport. Per the preceding remarks, connections that use TCP/IP encrypted using TLS/SSL, a socket file, or shared memory are secure connections. TCP/IP connections not encrypted using TLS/SSL and named-pipe connections are not secure.

See also  Configuring Encrypted Connections as Mandatory.

#### Connection Compression

All transport protocols are subject to use of compression on the traffic between the client and server. If both compression and encryption are used for a given connection, compression occurs before encryption. For more information, see Section 6.2.8, “Connection Compression Control”.
