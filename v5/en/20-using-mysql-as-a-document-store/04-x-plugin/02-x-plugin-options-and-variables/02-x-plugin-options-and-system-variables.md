#### 19.4.2.2 X Plugin Options and System Variables

To control activation of X Plugin, use this option:

* `--mysqlx[=value]`

  <table frame="box" rules="all" summary="Properties for mysqlx"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx[=value]</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads X Plugin at startup. It is available only if the plugin has been previously registered with `INSTALL PLUGIN` or is loaded with `--plugin-load` or `--plugin-load-add`.

  The option value should be one of those available for plugin-loading options, as described in Section 5.5.1, “Installing and Uninstalling Plugins”. For example, `--mysqlx=FORCE_PLUS_PERMANENT` tells the server to load the plugin and prevent it from being removed while the server is running.

If X Plugin is enabled, it exposes several system variables that permit control over its operation:

* `mysqlx_bind_address`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The network address on which X Plugin listens for TCP/IP connections. This variable is not dynamic and can be configured only at startup. This is the X Plugin equivalent of the `bind_address` system variable; see that variable description for more information.

  `mysqlx_bind_address` accepts a single address value, which may specify a single non-wildcard IP address or host name, or one of the wildcard address formats that permit listening on multiple network interfaces (`*`, `0.0.0.0`, or `::`).

  An IP address can be specified as an IPv4 or IPv6 address. If the value is a host name, X Plugin resolves the name to an IP address and binds to that address. If a host name resolves to multiple IP addresses, X Plugin uses the first IPv4 address if there are any, or the first IPv6 address otherwise.

  X Plugin treats different types of addresses as follows:

  + If the address is `*`, X Plugin accepts TCP/IP connections on all server host IPv4 interfaces, and, if the server host supports IPv6, on all IPv6 interfaces. Use this address to permit both IPv4 and IPv6 connections for X Plugin. This value is the default.

  + If the address is `0.0.0.0`, X Plugin accepts TCP/IP connections on all server host IPv4 interfaces.

  + If the address is `::`, X Plugin accepts TCP/IP connections on all server host IPv4 and IPv6 interfaces.

  + If the address is an IPv4-mapped address, X Plugin accepts TCP/IP connections for that address, in either IPv4 or IPv6 format. For example, if X Plugin is bound to `::ffff:127.0.0.1`, a client such as MySQL Shell can connect using `--host=127.0.0.1` or `--host=::ffff:127.0.0.1`.

  + If the address is a “regular” IPv4 or IPv6 address (such as `127.0.0.1` or `::1`), X Plugin accepts TCP/IP connections only for that IPv4 or IPv6 address.

  If binding to the address fails, X Plugin produces an error and the server does not load it.

* `mysqlx_connect_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_connect_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-connect-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_connect_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>30</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1000000000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The number of seconds X Plugin waits for the first packet to be received from newly connected clients. This is the X Plugin equivalent of `connect_timeout`; see that variable description for more information.

* `mysqlx_idle_worker_thread_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_idle_worker_thread_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-idle-worker-thread-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_idle_worker_thread_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>60</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The number of seconds after which idle worker threads are terminated.

* `mysqlx_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for mysqlx_max_allowed_packet"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-max-allowed-packet=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_max_allowed_packet</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>67108864</code></td> </tr><tr><th>Minimum Value</th> <td><code>512</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  The maximum size of network packets that can be received by X Plugin. This is the X Plugin equivalent of `max_allowed_packet`; see that variable description for more information.

* `mysqlx_max_connections`

  <table frame="box" rules="all" summary="Properties for mysqlx_max_connections"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-max-connections=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_max_connections</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>100</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  The maximum number of concurrent client connections X Plugin can accept. This is the X Plugin equivalent of `max_connections`; see that variable description for more information.

  For modifications to this variable, if the new value is smaller than the current number of connections, the new limit is taken into account only for new connections.

* `mysqlx_min_worker_threads`

  <table frame="box" rules="all" summary="Properties for mysqlx_min_worker_threads"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-min-worker-threads=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_min_worker_threads</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>100</code></td> </tr></tbody></table>

  The minimum number of worker threads used by X Plugin for handling client requests.

* `mysqlx_port`

  <table frame="box" rules="all" summary="Properties for mysqlx_port"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-port=port_num</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_port</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>33060</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  The network port on which X Plugin listens for TCP/IP connections. This is the X Plugin equivalent of `port`; see that variable description for more information.

* `mysqlx_port_open_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_port_open_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-port-open-timeout=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_port_open_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>120</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The number of seconds X Plugin waits for a TCP/IP port to become free.

* `mysqlx_socket`

  <table frame="box" rules="all" summary="Properties for mysqlx_socket"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-socket=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.15</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_socket</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>/tmp/mysqlx.sock</code></td> </tr></tbody></table>

  The path to a Unix socket file which X Plugin uses for connections. This setting is only used by MySQL Server when running on Unix operating systems. Clients can use this socket to connect to MySQL Server using X Plugin.

  The default `mysqlx_socket` path and file name is based on the default path and file name for the main socket file for MySQL Server, with the addition of an `x` appended to the file name. The default path and file name for the main socket file is `/tmp/mysql.sock`, therefore the default path and file name for the X Plugin socket file is `/tmp/mysqlx.sock`.

  If you specify an alternative path and file name for the main socket file at server startup using the `socket` system variable, this does not affect the default for the X Plugin socket file. In this situation, if you want to store both sockets at a single path, you must set the `mysqlx_socket` system variable as well. For example in a configuration file:

  ```sql
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

  If you change the default path and file name for the main socket file at compile time using the `MYSQL_UNIX_ADDR` compile option, this does affect the default for the X Plugin socket file, which is formed by appending an `x` to the `MYSQL_UNIX_ADDR` file name. If you want to set a different default for the X Plugin socket file at compile time, use the `MYSQLX_UNIX_ADDR` compile option.

  The `MYSQLX_UNIX_PORT` environment variable can also be used to set a default for the X Plugin socket file at server startup (see Section 4.9, “Environment Variables”). If you set this environment variable, it overrides the compiled `MYSQLX_UNIX_ADDR` value, but is overridden by the `mysqlx_socket` value.

* `mysqlx_ssl_ca`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_ca` system variable is like `ssl_ca`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 19.4.1, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_capath`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_capath` system variable is like `ssl_capath`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 19.4.1, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_cert`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_cert` system variable is like `ssl_cert`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 19.4.1, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_cipher`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_cipher` system variable is like `ssl_cipher`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 19.4.1, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_crl`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_crl` system variable is like `ssl_crl`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 19.4.1, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_crlpath`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_crlpath` system variable is like `ssl_crlpath`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 19.4.1, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_key`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

  The `mysqlx_ssl_key` system variable is like `ssl_key`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 19.4.1, “Using Encrypted Connections with X Plugin”.
