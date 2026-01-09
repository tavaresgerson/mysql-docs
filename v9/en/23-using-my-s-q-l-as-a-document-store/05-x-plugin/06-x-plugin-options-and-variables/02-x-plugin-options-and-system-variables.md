#### 22.5.6.2 X Plugin Options and System Variables

To control activation of X Plugin, use this option:

* `--mysqlx[=value]`

  <table frame="box" rules="all" summary="Properties for mysqlx"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads X Plugin at startup. In MySQL 9.5, X Plugin is enabled by default, but this option may be used to control its activation state.

  The option value should be one of those available for plugin-loading options, as described in Section 7.6.1, “Installing and Uninstalling Plugins”.

If X Plugin is enabled, it exposes several system variables that permit control over its operation:

* `mysqlx_bind_address`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The network address on which X Plugin listens for TCP/IP connections. This variable is not dynamic and can be configured only at startup. This is the X Plugin equivalent of the `bind_address` system variable; see that variable description for more information.

  By default, X Plugin accepts TCP/IP connections on all server host IPv4 interfaces, and, if the server host supports IPv6, on all IPv6 interfaces. If `mysqlx_bind_address` is specified, its value must satisfy these requirements:

  + A single address value, which may specify a single non-wildcard IP address (either IPv4 or IPv6), or a host name, or one of the wildcard address formats that permit listening on multiple network interfaces (`*`, `0.0.0.0`, or `::`).

  + A list of comma-separated values. When the variable names a list of multiple values, each value must specify a single non-wildcard IP address (either IPv4 or IPv6) or a host name. Wildcard address formats (`*`, `0.0.0.0`, or `::`) are not allowed in a list of values.

  + The value may also include a network namespace specifier.

  IP addresses can be specified as IPv4 or IPv6 addresses. For any value that is a host name, X Plugin resolves the name to an IP address and binds to that address. If a host name resolves to multiple IP addresses, X Plugin uses the first IPv4 address if there are any, or the first IPv6 address otherwise.

  X Plugin treats different types of addresses as follows:

  + If the address is `*`, X Plugin accepts TCP/IP connections on all server host IPv4 interfaces, and, if the server host supports IPv6, on all IPv6 interfaces. Use this address to permit both IPv4 and IPv6 connections for X Plugin. This value is the default. If the variable specifies a list of multiple values, this value is not permitted.

  + If the address is `0.0.0.0`, X Plugin accepts TCP/IP connections on all server host IPv4 interfaces. If the variable specifies a list of multiple values, this value is not permitted.

  + If the address is `::`, X Plugin accepts TCP/IP connections on all server host IPv4 and IPv6 interfaces. If the variable specifies a list of multiple values, this value is not permitted.

  + If the address is an IPv4-mapped address, X Plugin accepts TCP/IP connections for that address, in either IPv4 or IPv6 format. For example, if X Plugin is bound to `::ffff:127.0.0.1`, a client such as MySQL Shell can connect using `--host=127.0.0.1` or `--host=::ffff:127.0.0.1`.

  + If the address is a “regular” IPv4 or IPv6 address (such as `127.0.0.1` or `::1`), X Plugin accepts TCP/IP connections only for that IPv4 or IPv6 address.

  These rules apply to specifying a network namespace for an address:

  + A network namespace can be specified for an IP address or a host name.

  + A network namespace cannot be specified for a wildcard IP address.

  + For a given address, the network namespace is optional. If given, it must be specified as a `/ns` suffix immediately following the address.

  + An address with no `/ns` suffix uses the host system global namespace. The global namespace is therefore the default.

  + An address with a `/ns` suffix uses the namespace named *`ns`*.

  + The host system must support network namespaces and each named namespace must previously have been set up. Naming a nonexistent namespace produces an error.

  + If the variable value specifies multiple addresses, it can include addresses in the global namespace, in named namespaces, or a mix.

  For additional information about network namespaces, see Section 7.1.14, “Network Namespace Support”.

  Important

  Because X Plugin is not a mandatory plugin, it does not prevent server startup if there is an error in the specified address or list of addresses (as MySQL Server does for `bind_address` errors). With X Plugin, if one of the listed addresses cannot be parsed or if X Plugin cannot bind to it, the address is skipped, an error message is logged, and X Plugin attempts to bind to each of the remaining addresses. X Plugin's `Mysqlx_address` status variable displays only those addresses from the list for which the bind succeeded. If none of the listed addresses results in a successful bind, or if a single specified address fails, X Plugin logs the error message `ER_XPLUGIN_FAILED_TO_PREPARE_IO_INTERFACES` stating that X Protocol cannot be used. `mysqlx_bind_address` is not dynamic, so to fix any issues you must stop the server, correct the system variable value, and restart the server.

* `mysqlx_compression_algorithms`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The compression algorithms that are permitted for use on X Protocol connections. By default, the Deflate, LZ4, and zstd algorithms are all permitted. To disallow any of the algorithms, set `mysqlx_compression_algorithms` to include only the ones you permit. The algorithm names `deflate_stream`, `lz4_message`, and `zstd_stream` can be specified in any combination, and the order and case are not important. If you set the system variable to the empty string, no compression algorithms are permitted and only uncompressed connections are used. Use the algorithm-specific system variables to adjust the default and maximum compression level for each permitted algorithm. For more details, and information on how connection compression for X Protocol relates to the equivalent settings for MySQL Server, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_connect_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_connect_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-connect-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_connect_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>30</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1000000000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The number of seconds X Plugin waits for the first packet to be received from newly connected clients. This is the X Plugin equivalent of `connect_timeout`; see that variable description for more information.

* `mysqlx_deflate_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_deflate_default_compression_level"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx_deflate_default_compression_level=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_deflate_default_compression_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>9</code></td> </tr></tbody></table>

  The default compression level that the server uses for the Deflate algorithm on X Protocol connections. Specify the level as an integer from 1 (the lowest compression effort) to 9 (the highest effort). This level is used if the client does not request a compression level during capability negotiation. If you do not specify this system variable, the server uses level 3 as the default. For more information, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_deflate_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_deflate_max_client_compression_level"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx_deflate_max_client_compression_level=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_deflate_max_client_compression_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>9</code></td> </tr></tbody></table>

  The maximum compression level that the server permits for the Deflate algorithm on X Protocol connections. The range is the same as for the default compression level for this algorithm. If the client requests a higher compression level than this, the server uses the level you set here. If you do not specify this system variable, the server sets a maximum compression level of 5.

* `mysqlx_document_id_unique_prefix`

  <table frame="box" rules="all" summary="Properties for mysqlx_document_id_unique_prefix"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-document-id-unique-prefix=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_document_id_unique_prefix</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  Sets the first 4 bytes of document IDs generated by the server when documents are added to a collection. By setting this variable to a unique value per instance, you can ensure document IDs are unique across instances. See Understanding Document IDs.

* `mysqlx_enable_hello_notice`

  <table frame="box" rules="all" summary="Properties for mysqlx_enable_hello_notice"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-enable-hello-notice[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_enable_hello_notice</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls messages sent to classic MySQL protocol clients that try to connect over X Protocol. When enabled, clients which do not support X Protocol that attempt to connect to the server X Protocol port receive an error explaining they are using the wrong protocol.

* `mysqlx_idle_worker_thread_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_idle_worker_thread_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-idle-worker-thread-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_idle_worker_thread_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>60</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The number of seconds after which idle worker threads are terminated.

* `mysqlx_interactive_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_interactive_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-interactive-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_interactive_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>28800</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The default value of the `mysqlx_wait_timeout` session variable for interactive clients. (The number of seconds to wait for interactive clients to timeout.)

* `mysqlx_lz4_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The default compression level that the server uses for the LZ4 algorithm on X Protocol connections. Specify the level as an integer from 0 (the lowest compression effort) to 16 (the highest effort). This level is used if the client does not request a compression level during capability negotiation. If you do not specify this system variable, the server uses level 2 as the default. For more information, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_lz4_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The maximum compression level that the server permits for the LZ4 algorithm on X Protocol connections. The range is the same as for the default compression level for this algorithm. If the client requests a higher compression level than this, the server uses the level you set here. If you do not specify this system variable, the server sets a maximum compression level of 8.

* `mysqlx_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The maximum size of network packets that can be received by X Plugin. This limit also applies when compression is used for the connection, so the network packet must be smaller than this size after the message has been decompressed. This is the X Plugin equivalent of `max_allowed_packet`; see that variable description for more information.

* `mysqlx_max_connections`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The maximum number of concurrent client connections X Plugin can accept. This is the X Plugin equivalent of `max_connections`; see that variable description for more information.

  For modifications to this variable, if the new value is smaller than the current number of connections, the new limit is taken into account only for new connections.

* `mysqlx_min_worker_threads`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The minimum number of worker threads used by X Plugin for handling client requests.

* `mysqlx_port`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The network port on which X Plugin listens for TCP/IP connections. This is the X Plugin equivalent of `port`; see that variable description for more information.

* `mysqlx_port_open_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The number of seconds X Plugin waits for a TCP/IP port to become free.

* `mysqlx_read_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The number of seconds that X Plugin waits for blocking read operations to complete. After this time, if the read operation is not successful, X Plugin closes the connection and returns a warning notice with the error code ER_IO_READ_ERROR to the client application.

* `mysqlx_socket`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The path to a Unix socket file which X Plugin uses for connections. This setting is only used by MySQL Server when running on Unix operating systems. Clients can use this socket to connect to MySQL Server using X Plugin.

  The default `mysqlx_socket` path and file name is based on the default path and file name for the main socket file for MySQL Server, with the addition of an `x` appended to the file name. The default path and file name for the main socket file is `/tmp/mysql.sock`, therefore the default path and file name for the X Plugin socket file is `/tmp/mysqlx.sock`.

  If you specify an alternative path and file name for the main socket file at server startup using the `socket` system variable, this does not affect the default for the X Plugin socket file. In this situation, if you want to store both sockets at a single path, you must set the `mysqlx_socket` system variable as well. For example in a configuration file:

  ```
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

  If you change the default path and file name for the main socket file at compile time using the `MYSQL_UNIX_ADDR` compile option, this does affect the default for the X Plugin socket file, which is formed by appending an `x` to the `MYSQL_UNIX_ADDR` file name. If you want to set a different default for the X Plugin socket file at compile time, use the `MYSQLX_UNIX_ADDR` compile option.

  The `MYSQLX_UNIX_PORT` environment variable can also be used to set a default for the X Plugin socket file at server startup (see Section 6.9, “Environment Variables”). If you set this environment variable, it overrides the compiled `MYSQLX_UNIX_ADDR` value, but is overridden by the `mysqlx_socket` value.

* `mysqlx_ssl_ca`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_ca` system variable is like `ssl_ca`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_capath`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The `mysqlx_ssl_capath` system variable is like `ssl_capath`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_cert`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The `mysqlx_ssl_cert` system variable is like `ssl_cert`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_cipher`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The `mysqlx_ssl_cipher` system variable is like `ssl_cipher`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_crl`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The `mysqlx_ssl_crl` system variable is like `ssl_crl`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_crlpath`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The `mysqlx_ssl_crlpath` system variable is like `ssl_crlpath`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_key`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The `mysqlx_ssl_key` system variable is like `ssl_key`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_wait_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The number of seconds that X Plugin waits for activity on a connection. After this time, if the read operation is not successful, X Plugin closes the connection. If the client is noninteractive, the initial value of the session variable is copied from the global `mysqlx_wait_timeout` variable. For interactive clients, the initial value is copied from the session `mysqlx_interactive_timeout`.

* `mysqlx_write_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The number of seconds that X Plugin waits for blocking write operations to complete. After this time, if the write operation is not successful, X Plugin closes the connection.

* `mysqlx_zstd_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The default compression level that the server uses for the zstd algorithm on X Protocol connections. For versions of the zstd library from 1.4.0, you can set positive values from 1 to 22 (the highest compression effort), or negative values which represent progressively lower effort. A value of 0 is converted to a value of 1. For earlier versions of the zstd library, you can only specify the value 3. This level is used if the client does not request a compression level during capability negotiation. If you do not specify this system variable, the server uses level 3 as the default. For more information, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_zstd_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p><code>deflate_stream</code></p><p><code>lz4_message</code></p><p><code>zstd_stream</code></p></td> </tr></tbody></table>

  The maximum compression level that the server permits for the zstd algorithm on X Protocol connections. The range is the same as for the default compression level for this algorithm. If the client requests a higher compression level than this, the server uses the level you set here. If you do not specify this system variable, the server sets a maximum compression level of 11.
