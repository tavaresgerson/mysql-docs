## 22.5 X Plugin

This section explains how to use, configure and monitor X Plugin.


### 22.5.1 Checking X Plugin Installation

X Plugin is enabled by default in MySQL 8, therefore installing or upgrading to MySQL 8 makes the plugin available. You can verify X Plugin is installed on an instance of MySQL server by using the `SHOW plugins` statement to view the plugins list.

To use MySQL Shell to verify X Plugin is installed, issue:

```
$> mysqlsh -u user --sqlc -P 3306 -e "SHOW plugins"
```

To use MySQL Client to verify X Plugin is installed, issue:

```
$> mysql -u user -p -e "SHOW plugins"
```

An example result if X Plugin is installed is highlighted here:

```
+----------------------------+----------+--------------------+---------+---------+
| Name                       | Status   | Type               | Library | License |
+----------------------------+----------+--------------------+---------+---------+

...


| mysqlx                     | ACTIVE   | DAEMON             | NULL    | GPL     |

...

+----------------------------+----------+--------------------+---------+---------+
```


### 22.5.2 Disabling X Plugin

The X Plugin can be disabled at startup by either setting `mysqlx=0` in your MySQL configuration file, or by passing in either `--mysqlx=0` or `--skip-mysqlx` when starting the MySQL server.

Alternatively, use the `-DWITH_MYSQLX=OFF` CMake option to compile MySQL Server without X Plugin.


### 22.5.3 Using Encrypted Connections with X Plugin

This section explains how to configure X Plugin to use encrypted connections. For more background information, see Section 8.3, “Using Encrypted Connections”.

To enable configuring support for encrypted connections, X Plugin has `mysqlx_ssl_xxx` system variables, which can have different values from the `ssl_xxx` system variables used with MySQL Server. For example, X Plugin can have SSL key, certificate, and certificate authority files that differ from those used for MySQL Server. These variables are described at Section 22.5.6.2, “X Plugin Options and System Variables”. Similarly, X Plugin has its own `Mysqlx_ssl_xxx` status variables that correspond to the MySQL Server encrypted-connection `Ssl_xxx` status variables. See Section 22.5.6.3, “X Plugin Status Variables”.

At initialization, X Plugin determines its TLS context for encrypted connections as follows:

* If all `mysqlx_ssl_xxx` system variables have their default values, X Plugin uses the same TLS context as the MySQL Server main connection interface, which is determined by the values of the `ssl_xxx` system variables.

* If any `mysqlx_ssl_xxx` variable has a nondefault value, X Plugin uses the TLS context defined by the values of its own system variables. (This is the case if any `mysqlx_ssl_xxx` system variable is set to a value different from its default.)

This means that, on a server with X Plugin enabled, you can choose to have MySQL Protocol and X Protocol connections share the same encryption configuration by setting only the `ssl_xxx` variables, or have separate encryption configurations for MySQL Protocol and X Protocol connections by configuring the `ssl_xxx` and `mysqlx_ssl_xxx` variables separately.

To have MySQL Protocol and X Protocol connections use the same encryption configuration, set only the `ssl_xxx` system variables in `my.cnf`:

```
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

To configure encryption separately for MySQL Protocol and X Protocol connections, set both the `ssl_xxx` and `mysqlx_ssl_xxx` system variables in `my.cnf`:

```
[mysqld]
ssl_ca=ca1.pem
ssl_cert=server-cert1.pem
ssl_key=server-key1.pem

mysqlx_ssl_ca=ca2.pem
mysqlx_ssl_cert=server-cert2.pem
mysqlx_ssl_key=server-key2.pem
```

For general information about configuring connection-encryption support, see Section 8.3.1, “Configuring MySQL to Use Encrypted Connections”. That discussion is written for MySQL Server, but the parameter names are similar for X Plugin. (The X Plugin `mysqlx_ssl_xxx` system variable names correspond to the MySQL Server `ssl_xxx` system variable names.)

The `tls_version` system variable that determines the permitted TLS versions for MySQL Protocol connections also applies to X Protocol connections. The permitted TLS versions for both types of connections are therefore the same.

Encryption per connection is optional, but a specific user can be required to use encryption for X Protocol and MySQL Protocol connections by including an appropriate `REQUIRE` clause in the `CREATE USER` statement that creates the user. For details, see Section 15.7.1.3, “CREATE USER Statement”. Alternatively, to require all users to use encryption for X Protocol and MySQL Protocol connections, enable the `require_secure_transport` system variable. For additional information, see Configuring Encrypted Connections as Mandatory.


### 22.5.4 Using X Plugin with the Caching SHA-2 Authentication Plugin

X Plugin supports MySQL user accounts created with the `caching_sha2_password` authentication plugin. For more information on this plugin, see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”. You can use X Plugin to authenticate against such accounts using non-SSL connections with `SHA256_MEMORY` authentication and SSL connections with `PLAIN` authentication.

Although the `caching_sha2_password` authentication plugin holds an authentication cache, this cache is not shared with X Plugin, so X Plugin uses its own authentication cache for `SHA256_MEMORY` authentication. The X Plugin authentication cache stores hashes of user account passwords, and cannot be accessed using SQL. If a user account is modified or removed, the relevant entries are removed from the cache. The X Plugin authentication cache is maintained by the `mysqlx_cache_cleaner` plugin, which is enabled by default, and has no related system variables or status variables.

Before you can use non-SSL X Protocol connections to authenticate an account that uses the `caching_sha2_password` authentication plugin, the account must have authenticated at least once over an X Protocol connection with SSL, to supply the password to the X Plugin authentication cache. Once this initial authentication over SSL has succeeded, non-SSL X Protocol connections can be used.

It is possible to disable the `mysqlx_cache_cleaner` plugin by starting the MySQL server with the option `--mysqlx_cache_cleaner=0`. If you do this, the X Plugin authentication cache is disabled, and therefore SSL must always be used for X Protocol connections when authenticating with `SHA256_MEMORY` authentication.


### 22.5.5 Connection Compression with X Plugin

X Plugin supports compression of messages sent over X Protocol connections. Connections can be compressed if the server and the client agree on a mutually supported compression algorithm. Enabling compression reduces the number of bytes sent over the network, but adds to the server and client an additional CPU cost for compression and decompression operations. The benefits of compression therefore occur primarily when there is low network bandwidth, network transfer time dominates the cost of compression and decompression operations, and result sets are large.

Note

Different MySQL clients implement support for connection compression differently; consult your client documentation for details. For example, for classic MySQL protocol connections, see Section 6.2.8, “Connection Compression Control”.

* Configuring Connection Compression for X Plugin
* Compressed Connection Characteristics for X Plugin
* Monitoring Connection Compression for X Plugin

#### Configuring Connection Compression for X Plugin

By default, X Plugin supports the zstd, LZ4, and Deflate compression algorithms. Compression with the Deflate algorithm is carried out using the zlib software library, so the `deflate_stream` compression algorithm setting for X Protocol connections is equivalent to the `zlib` setting for classic MySQL protocol connections.

On the server side, you can disallow any of the compression algorithms by setting the `mysqlx_compression_algorithms` system variable to include only those permitted. The algorithm names `zstd_stream`, `lz4_message`, and `deflate_stream` can be specified in any combination, and the order and lettercase are not important. If the system variable value is the empty string, no compression algorithms are permitted and connections are uncompressed.

The following table compares the characteristics of the different compression algorithms and shows their assigned priorities. By default, the server chooses the highest-priority algorithm permitted in common by the server and the client; clients may change the priorities as described later. The short form alias for the algorithms can be used by clients when specifying them.

**Table 22.1 X Protocol Compression Algorithm Characteristics**

<table frame="void"><col align="center" style="width: 18%"/><col align="center" style="width: 14%"/><col align="center" style="width: 18%"/><col align="center" style="width: 17%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Algorithm</th> <th scope="col">Alias</th> <th scope="col">Compression Ratio</th> <th scope="col">Throughput</th> <th scope="col">CPU Cost</th> <th scope="col">Default Priority</th> </tr></thead><tbody><tr> <th scope="row"><code>zsth_stream</code></th> <td><code>zstd</code></td> <td>High</td> <td>High</td> <td>Medium</td> <td>First</td> </tr><tr> <th scope="row"><code>lz4_message</code></th> <td><code>lz4</code></td> <td>Low</td> <td>High</td> <td>Lowest</td> <td>Second</td> </tr><tr> <th scope="row"><code>deflate_stream</code></th> <td><code>deflate</code></td> <td>High</td> <td>Low</td> <td>Highest</td> <td>Third</td> </tr></tbody></table>

The X Protocol set of permitted compression algorithms (whether user-specified or default) is independent of the set of compression algorithms permitted by MySQL Server for classic MySQL protocol connections, which is specified by the `protocol_compression_algorithms` server system variable. If you do not specify the `mysqlx_compression_algorithms` system variable, X Plugin does not fall back to using compression settings for classic MySQL protocol connections. Instead, its default is to permit all algorithms shown in Table 22.1, “X Protocol Compression Algorithm Characteristics”. This is unlike the situation for the TLS context, where MySQL Server settings are used if the X Plugin system variables are not set, as described in Section 22.5.3, “Using Encrypted Connections with X Plugin”. For information about compression for classic MySQL protocol connections, see Section 6.2.8, “Connection Compression Control”.

On the client side, an X Protocol connection request can specify several parameters for compression control:

* The compression mode.
* The compression level.
* The list of permitted compression algorithms in priority order.

Note

Some clients or Connectors might not support a given compression-control feature. For example, specifying compression level for X Protocol connections is supported only by MySQL Shell, not by other MySQL clients or Connectors. See the documentation for specific products for details about supported features and how to use them.

The connection mode has these permitted values:

* `disabled`: The connection is uncompressed.
* `preferred`: The server and client negotiate to find a compression algorithm they both permit. If no common algorithm is available, the connection is uncompressed. This is the default mode if not specified explicitly.

* `required`: Compression algorithm negotiation occurs as for `preferred` mode, but if no common algorithm is available, the connection request terminates with an error.

In addition to agreeing on a compression algorithm for each connection, the server and client can agree on a compression level from the numeric range that applies to the agreed algorithm. As the compression level for an algorithm increases, the data compression ratio increases, which reduces the network bandwidth and transfer time needed to send the message to the client. However, the effort required for data compression also increases, taking up time and CPU and memory resources on the server. Increases in the compression effort do not have a linear relationship to increases in the compression ratio.

The client can request a specific compression level during capability negotiations with the server for an X Protocol connection.

The default compression levels used by X Plugin in MySQL 9.5 have been selected through performance testing as being a good trade-off between compression time and network transit time. These defaults are not necessarily the same as the library default for each algorithm. They apply if the client does not request a compression level for the algorithm. The default compression levels are initially set to 3 for zstd, 2 for LZ4, and 3 for Deflate. You can adjust these settings using the `mysqlx_zstd_default_compression_level`, `mysqlx_lz4_default_compression_level`, and `mysqlx_deflate_default_compression_level` system variables.

To prevent excessive resource consumption on the server, X Plugin sets a maximum compression level that the server permits for each algorithm. If a client requests a compression level that exceeds this setting, the server uses its maximum permitted compression level (compression level requests by a client are supported only by MySQL Shell). The maximum compression levels are initially set to 11 for zstd, 8 for LZ4, and 5 for Deflate. You can adjust these settings using the `mysqlx_zstd_max_client_compression_level`, `mysqlx_lz4_max_client_compression_level`, and `mysqlx_deflate_max_client_compression_level` system variables.

If the server and client permit more than one algorithm in common, the default priority order for choosing an algorithm during negotiation is shown in Table 22.1, “X Protocol Compression Algorithm Characteristics”. For clients that support specifying compression algorithms, the connection request can include a list of algorithms permitted by the client, specified using the algorithm name or its alias. The order of these algorithms in the list is taken as a priority order by the server. The algorithm used in this case is the first of those in the client list that is also permitted on the server side. However, the option for compression algorithms is subject to the compression mode:

* If the compression mode is `disabled`, the compression algorithms option is ignored.

* If the compression mode is `preferred` but no algorithm permitted on the client side is permitted on the server side, the connection is uncompressed.

* If the compression mode is `required` but no algorithm permitted on the client side is permitted on the server side, an error occurs.

To monitor the effects of message compression, use the X Plugin status variables described in Monitoring Connection Compression for X Plugin. You can use these status variables to calculate the benefit of message compression with your current settings, and use that information to tune your settings.

#### Compressed Connection Characteristics for X Plugin

X Protocol connection compression operates with the following behaviors and boundaries:

* The `_stream` and `_message` suffixes in algorithm names refer to two different operational modes: In stream mode, all X Protocol messages in a single connection are compressed into a continuous stream and must be decompressed in the same manner—following the order they were compressed and without skipping any messages. In message mode, each message is compressed individually and independently, and need not be decompressed in the order in which they were compressed. Also, message mode does not require all compressed messages to be decompressed.

* Compression is not applied to any messages that are sent before authentication succeeds.

* Compression is not applied to control flow messages such as `Mysqlx.Ok`, `Mysqlx.Error`, and `Mysqlx.Sql.StmtExecuteOk` messages.

* All other X Protocol messages can be compressed if the server and client agree on a mutually permitted compression algorithm during capability negotiation. If the client does not request compression at that stage, neither the client nor the server applies compression to messages.

* When messages sent over X Protocol connections are compressed, the limit specified by the `mysqlx_max_allowed_packet` system variable still applies. The network packet must be smaller than this limit after the message payload has been decompressed. If the limit is exceeded, X Plugin returns a decompression error and closes the connection.

* The following points pertain to compression level requests by clients, which is supported only by MySQL Shell:

  + Compression levels must be specified by the client as an integer. If any other type of value is supplied, the connection closes with an error.

  + If a client specifies an algorithm but not a compression level, the server uses its default compression level for the algorithm.

  + If a client requests an algorithm compression level that exceeds the server maximum permitted level, the server uses the maximum permitted level.

  + If a client requests an algorithm compression level that is less than the server minimum permitted level, the server uses the minimum permitted level.

#### Monitoring Connection Compression for X Plugin

You can monitor the effects of message compression using the X Plugin status variables. When message compression is in use, the session `Mysqlx_compression_algorithm` status variable shows which compression algorithm is in use for the current X Protocol connection, and `Mysqlx_compression_level` shows the compression level that was selected.

X Plugin status variables can be used to calculate the efficiency of the compression algorithms that are selected (the data compression ratio), and the overall effect of using message compression. Use the session value of the status variables in the following calculations to see what the benefit of message compression was for a specific session with a known compression algorithm. Or use the global value of the status variables to check the overall benefit of message compression for your server across all sessions using X Protocol connections, including all the compression algorithms that have been used for those sessions, and all sessions that did not use message compression. You can then tune message compression by adjusting the permitted compression algorithms, maximum compression level, and default compression level, as described in Configuring Connection Compression for X Plugin.

When message compression is in use, the `Mysqlx_bytes_sent` status variable shows the total number of bytes sent out from the server, including compressed message payloads measured after compression, any items in compressed messages that were not compressed such as X Protocol headers, and any uncompressed messages. The `Mysqlx_bytes_sent_compressed_payload` status variable shows the total number of bytes sent as compressed message payloads, measured after compression, and the `Mysqlx_bytes_sent_uncompressed_frame` status variable shows the total number of bytes for those same message payloads but measured before compression. The compression ratio, which shows the efficiency of the compression algorithm, can therefore be calculated using the following expression:

```
mysqlx_bytes_sent_uncompressed_frame / mysqlx_bytes_sent_compressed_payload
```

The effectiveness of compression for X Protocol messages sent by the server can be calculated using the following expression:

```
(mysqlx_bytes_sent - mysqlx_bytes_sent_compressed_payload + mysqlx_bytes_sent_uncompressed_frame) / mysqlx_bytes_sent
```

For messages received by the server from clients, the `Mysqlx_bytes_received_compressed_payload` status variable shows the total number of bytes received as compressed message payloads, measured before decompression, and the `Mysqlx_bytes_received_uncompressed_frame` status variable shows the total number of bytes for those same message payloads but measured after decompression. The `Mysqlx_bytes_received` status variable includes compressed message payloads measured before decompression, any uncompressed items in compressed messages, and any uncompressed messages.


### 22.5.6 X Plugin Options and Variables

This section describes the command options and system variables that configure X Plugin, as well as the status variables available for monitoring purposes. If configuration values specified at startup time are incorrect, X Plugin could fail to initialize properly and the server does not load it. In this case, the server could also produce error messages for other X Plugin settings because it cannot recognize them.


#### 22.5.6.1 X Plugin Option and Variable Reference

This table provides an overview of the command options, system variables, and status variables provided by X Plugin.

**Table 22.2 X Plugin Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for X Plugin command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">mysqlx</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">Mysqlx_aborted_clients</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_address</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_bind_address</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_received</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_received_compressed_payload</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_received_uncompressed_frame</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_sent_compressed_payload</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_sent_uncompressed_frame</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_compression_algorithm</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Session</td> <td>No</td> </tr><tr><th scope="row">mysqlx_compression_algorithms</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_compression_level</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Session</td> <td>No</td> </tr><tr><th scope="row">mysqlx_connect_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_connection_accept_errors</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connection_errors</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connections_accepted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connections_closed</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connections_rejected</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_create_view</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_delete</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_drop_view</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_find</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_insert</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_modify_view</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_update</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_deflate_default_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_deflate_max_client_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_document_id_unique_prefix</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_enable_hello_notice</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_errors_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_errors_unknown_message_type</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_expect_close</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_expect_open</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_idle_worker_thread_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_init_error</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_interactive_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_lz4_default_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_lz4_max_client_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_max_allowed_packet</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_max_connections</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_messages_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_min_worker_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_notice_global_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_notice_other_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_notice_warning_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_notified_by_group_replication</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_port</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_port</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_port_open_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_read_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_rows_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_accepted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_closed</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_fatal_error</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_killed</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_rejected</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_socket</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_socket</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_accept_renegotiates</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_accepts</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_active</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_ca</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_capath</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_cert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_cipher</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_cipher</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_cipher_list</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_crl</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_crlpath</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_ctx_verify_depth</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_ctx_verify_mode</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_finished_accepts</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_key</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_server_not_after</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_server_not_before</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_verify_depth</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_verify_mode</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_version</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_create_collection</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_create_collection_index</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_disable_notices</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_drop_collection</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_drop_collection_index</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_enable_notices</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_ensure_collection</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_execute_mysqlx</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_execute_sql</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_execute_xplugin</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_get_collection_options</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_kill_client</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_list_clients</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_list_notices</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_list_objects</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_modify_collection_options</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_ping</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_wait_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_worker_threads</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_worker_threads_active</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_write_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_zstd_default_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_zstd_max_client_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr></tbody></table>


#### 22.5.6.2 X Plugin Options and System Variables

To control activation of X Plugin, use this option:

* `--mysqlx[=value]`

  <table frame="box" rules="all" summary="Properties for mysqlx"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads X Plugin at startup. In MySQL 9.5, X Plugin is enabled by default, but this option may be used to control its activation state.

  The option value should be one of those available for plugin-loading options, as described in Section 7.6.1, “Installing and Uninstalling Plugins”.

If X Plugin is enabled, it exposes several system variables that permit control over its operation:

* `mysqlx_bind_address`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

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

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>

  The compression algorithms that are permitted for use on X Protocol connections. By default, the Deflate, LZ4, and zstd algorithms are all permitted. To disallow any of the algorithms, set `mysqlx_compression_algorithms` to include only the ones you permit. The algorithm names `deflate_stream`, `lz4_message`, and `zstd_stream` can be specified in any combination, and the order and case are not important. If you set the system variable to the empty string, no compression algorithms are permitted and only uncompressed connections are used. Use the algorithm-specific system variables to adjust the default and maximum compression level for each permitted algorithm. For more details, and information on how connection compression for X Protocol relates to the equivalent settings for MySQL Server, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_connect_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_connect_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-connect-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_connect_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>30</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1000000000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The number of seconds X Plugin waits for the first packet to be received from newly connected clients. This is the X Plugin equivalent of `connect_timeout`; see that variable description for more information.

* `mysqlx_deflate_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_deflate_default_compression_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx_deflate_default_compression_level=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_deflate_default_compression_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>9</code></td> </tr></tbody></table>

  The default compression level that the server uses for the Deflate algorithm on X Protocol connections. Specify the level as an integer from 1 (the lowest compression effort) to 9 (the highest effort). This level is used if the client does not request a compression level during capability negotiation. If you do not specify this system variable, the server uses level 3 as the default. For more information, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_deflate_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_deflate_max_client_compression_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx_deflate_max_client_compression_level=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_deflate_max_client_compression_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>9</code></td> </tr></tbody></table>

  The maximum compression level that the server permits for the Deflate algorithm on X Protocol connections. The range is the same as for the default compression level for this algorithm. If the client requests a higher compression level than this, the server uses the level you set here. If you do not specify this system variable, the server sets a maximum compression level of 5.

* `mysqlx_document_id_unique_prefix`

  <table frame="box" rules="all" summary="Properties for mysqlx_document_id_unique_prefix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-document-id-unique-prefix=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_document_id_unique_prefix</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  Sets the first 4 bytes of document IDs generated by the server when documents are added to a collection. By setting this variable to a unique value per instance, you can ensure document IDs are unique across instances. See Understanding Document IDs.

* `mysqlx_enable_hello_notice`

  <table frame="box" rules="all" summary="Properties for mysqlx_enable_hello_notice"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-enable-hello-notice[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_enable_hello_notice</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls messages sent to classic MySQL protocol clients that try to connect over X Protocol. When enabled, clients which do not support X Protocol that attempt to connect to the server X Protocol port receive an error explaining they are using the wrong protocol.

* `mysqlx_idle_worker_thread_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_idle_worker_thread_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-idle-worker-thread-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_idle_worker_thread_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>60</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The number of seconds after which idle worker threads are terminated.

* `mysqlx_interactive_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_interactive_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-interactive-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_interactive_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>28800</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  The default value of the `mysqlx_wait_timeout` session variable for interactive clients. (The number of seconds to wait for interactive clients to timeout.)

* `mysqlx_lz4_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>0

  The default compression level that the server uses for the LZ4 algorithm on X Protocol connections. Specify the level as an integer from 0 (the lowest compression effort) to 16 (the highest effort). This level is used if the client does not request a compression level during capability negotiation. If you do not specify this system variable, the server uses level 2 as the default. For more information, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_lz4_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>1

  The maximum compression level that the server permits for the LZ4 algorithm on X Protocol connections. The range is the same as for the default compression level for this algorithm. If the client requests a higher compression level than this, the server uses the level you set here. If you do not specify this system variable, the server sets a maximum compression level of 8.

* `mysqlx_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>2

  The maximum size of network packets that can be received by X Plugin. This limit also applies when compression is used for the connection, so the network packet must be smaller than this size after the message has been decompressed. This is the X Plugin equivalent of `max_allowed_packet`; see that variable description for more information.

* `mysqlx_max_connections`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>3

  The maximum number of concurrent client connections X Plugin can accept. This is the X Plugin equivalent of `max_connections`; see that variable description for more information.

  For modifications to this variable, if the new value is smaller than the current number of connections, the new limit is taken into account only for new connections.

* `mysqlx_min_worker_threads`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>4

  The minimum number of worker threads used by X Plugin for handling client requests.

* `mysqlx_port`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>5

  The network port on which X Plugin listens for TCP/IP connections. This is the X Plugin equivalent of `port`; see that variable description for more information.

* `mysqlx_port_open_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>6

  The number of seconds X Plugin waits for a TCP/IP port to become free.

* `mysqlx_read_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>7

  The number of seconds that X Plugin waits for blocking read operations to complete. After this time, if the read operation is not successful, X Plugin closes the connection and returns a warning notice with the error code ER_IO_READ_ERROR to the client application.

* `mysqlx_socket`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>8

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

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>9

  The `mysqlx_ssl_ca` system variable is like `ssl_ca`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_capath`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>0

  The `mysqlx_ssl_capath` system variable is like `ssl_capath`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_cert`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>1

  The `mysqlx_ssl_cert` system variable is like `ssl_cert`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_cipher`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>2

  The `mysqlx_ssl_cipher` system variable is like `ssl_cipher`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_crl`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>3

  The `mysqlx_ssl_crl` system variable is like `ssl_crl`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_crlpath`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>4

  The `mysqlx_ssl_crlpath` system variable is like `ssl_crlpath`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_ssl_key`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>5

  The `mysqlx_ssl_key` system variable is like `ssl_key`, except that it applies to X Plugin rather than the MySQL Server main connection interface. For information about configuring encryption support for X Plugin, see Section 22.5.3, “Using Encrypted Connections with X Plugin”.

* `mysqlx_wait_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>6

  The number of seconds that X Plugin waits for activity on a connection. After this time, if the read operation is not successful, X Plugin closes the connection. If the client is noninteractive, the initial value of the session variable is copied from the global `mysqlx_wait_timeout` variable. For interactive clients, the initial value is copied from the session `mysqlx_interactive_timeout`.

* `mysqlx_write_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>7

  The number of seconds that X Plugin waits for blocking write operations to complete. After this time, if the write operation is not successful, X Plugin closes the connection.

* `mysqlx_zstd_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>8

  The default compression level that the server uses for the zstd algorithm on X Protocol connections. For versions of the zstd library from 1.4.0, you can set positive values from 1 to 22 (the highest compression effort), or negative values which represent progressively lower effort. A value of 0 is converted to a value of 1. For earlier versions of the zstd library, you can only specify the value 3. This level is used if the client does not request a compression level during capability negotiation. If you do not specify this system variable, the server uses level 3 as the default. For more information, see Section 22.5.5, “Connection Compression with X Plugin”.

* `mysqlx_zstd_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>9

  The maximum compression level that the server permits for the zstd algorithm on X Protocol connections. The range is the same as for the default compression level for this algorithm. If the client requests a higher compression level than this, the server uses the level you set here. If you do not specify this system variable, the server sets a maximum compression level of 11.


#### 22.5.6.3 X Plugin Status Variables

The X Plugin status variables have the following meanings.

* `Mysqlx_aborted_clients`

  The number of clients that were disconnected because of an input or output error.

* `Mysqlx_address`

  The network address or addresses for which X Plugin accepts TCP/IP connections. If multiple addresses were specified using the `mysqlx_bind_address` system variable, `Mysqlx_address` displays only those addresses for which the bind succeeded. If the bind has failed for every network address specified by `mysqlx_bind_address`, or if the `skip_networking` option has been used, the value of `Mysqlx_address` is `UNDEFINED`. If X Plugin startup is not yet complete, the value of `Mysqlx_address` is empty.

* `Mysqlx_bytes_received`

  The total number of bytes received through the network. If compression is used for the connection, this figure comprises compressed message payloads measured before decompression (`Mysqlx_bytes_received_compressed_payload`), any items in compressed messages that were not compressed such as X Protocol headers, and any uncompressed messages.

* `Mysqlx_bytes_received_compressed_payload`

  The number of bytes received as compressed message payloads, measured before decompression.

* `Mysqlx_bytes_received_uncompressed_frame`

  The number of bytes received as compressed message payloads, measured after decompression.

* `Mysqlx_bytes_sent`

  The total number of bytes sent through the network. If compression is used for the connection, this figure comprises compressed message payloads measured after compression (`Mysqlx_bytes_sent_compressed_payload`), any items in compressed messages that were not compressed such as X Protocol headers, and any uncompressed messages.

* `Mysqlx_bytes_sent_compressed_payload`

  The number of bytes sent as compressed message payloads, measured after compression.

* `Mysqlx_bytes_sent_uncompressed_frame`

  The number of bytes sent as compressed message payloads, measured before compression.

* `Mysqlx_compression_algorithm`

  (Session scope) The compression algorithm in use for the X Protocol connection for this session. The permitted compression algorithms are listed by the `mysqlx_compression_algorithms` system variable.

* `Mysqlx_compression_level`

  (Session scope) The compression level in use for the X Protocol connection for this session.

* `Mysqlx_connection_accept_errors`

  The number of connections which have caused accept errors.

* `Mysqlx_connection_errors`

  The number of connections which have caused errors.

* `Mysqlx_connections_accepted`

  The number of connections which have been accepted.

* `Mysqlx_connections_closed`

  The number of connections which have been closed.

* `Mysqlx_connections_rejected`

  The number of connections which have been rejected.

* `Mysqlx_crud_create_view`

  The number of create view requests received.

* `Mysqlx_crud_delete`

  The number of delete requests received.

* `Mysqlx_crud_drop_view`

  The number of drop view requests received.

* `Mysqlx_crud_find`

  The number of find requests received.

* `Mysqlx_crud_insert`

  The number of insert requests received.

* `Mysqlx_crud_modify_view`

  The number of modify view requests received.

* `Mysqlx_crud_update`

  The number of update requests received.

* `Mysqlx_cursor_close`

  The number of cursor-close messages received

* `Mysqlx_cursor_fetch`

  The number of cursor-fetch messages received

* `Mysqlx_cursor_open`

  The number of cursor-open messages received

* `Mysqlx_errors_sent`

  The number of errors sent to clients.

* `Mysqlx_errors_unknown_message_type`

  The number of unknown message types that have been received.

* `Mysqlx_expect_close`

  The number of expectation blocks closed.

* `Mysqlx_expect_open`

  The number of expectation blocks opened.

* `Mysqlx_init_error`

  The number of errors during initialisation.

* `Mysqlx_messages_sent`

  The total number of messages of all types sent to clients.

* `Mysqlx_notice_global_sent`

  The number of global notifications sent to clients.

* `Mysqlx_notice_other_sent`

  The number of other types of notices sent back to clients.

* `Mysqlx_notice_warning_sent`

  The number of warning notices sent back to clients.

* `Mysqlx_notified_by_group_replication`

  Number of Group Replication notifications sent to clients.

* `Mysqlx_port`

  The TCP port which X Plugin is listening to. If a network bind has failed, or if the `skip_networking` system variable is enabled, the value shows `UNDEFINED`.

* `Mysqlx_prep_deallocate`

  The number of prepared-statement-deallocate messages received

* `Mysqlx_prep_execute`

  The number of prepared-statement-execute messages received

* `Mysqlx_prep_prepare`

  The number of prepared-statement messages received

* `Mysqlx_rows_sent`

  The number of rows sent back to clients.

* `Mysqlx_sessions`

  The number of sessions that have been opened.

* `Mysqlx_sessions_accepted`

  The number of session attempts which have been accepted.

* `Mysqlx_sessions_closed`

  The number of sessions that have been closed.

* `Mysqlx_sessions_fatal_error`

  The number of sessions that have closed with a fatal error.

* `Mysqlx_sessions_killed`

  The number of sessions which have been killed.

* `Mysqlx_sessions_rejected`

  The number of session attempts which have been rejected.

* `Mysqlx_socket`

  The Unix socket which X Plugin is listening to.

* `Mysqlx_ssl_accept_renegotiates`

  The number of negotiations needed to establish the connection.

* `Mysqlx_ssl_accepts`

  The number of accepted SSL connections.

* `Mysqlx_ssl_active`

  If SSL is active.

* `Mysqlx_ssl_cipher`

  The current SSL cipher (empty for non-SSL connections).

* `Mysqlx_ssl_cipher_list`

  A list of possible SSL ciphers (empty for non-SSL connections).

* `Mysqlx_ssl_ctx_verify_depth`

  The certificate verification depth limit currently set in ctx.

* `Mysqlx_ssl_ctx_verify_mode`

  The certificate verification mode currently set in ctx.

* `Mysqlx_ssl_finished_accepts`

  The number of successful SSL connections to the server.

* `Mysqlx_ssl_server_not_after`

  The last date for which the SSL certificate is valid.

* `Mysqlx_ssl_server_not_before`

  The first date for which the SSL certificate is valid.

* `Mysqlx_ssl_verify_depth`

  The certificate verification depth for SSL connections.

* `Mysqlx_ssl_verify_mode`

  The certificate verification mode for SSL connections.

* `Mysqlx_ssl_version`

  The name of the protocol used for SSL connections.

* `Mysqlx_stmt_create_collection`

  The number of create collection statements received.

* `Mysqlx_stmt_create_collection_index`

  The number of create collection index statements received.

* `Mysqlx_stmt_disable_notices`

  The number of disable notice statements received.

* `Mysqlx_stmt_drop_collection`

  The number of drop collection statements received.

* `Mysqlx_stmt_drop_collection_index`

  The number of drop collection index statements received.

* `Mysqlx_stmt_enable_notices`

  The number of enable notice statements received.

* `Mysqlx_stmt_ensure_collection`

  The number of ensure collection statements received.

* `Mysqlx_stmt_execute_mysqlx`

  The number of StmtExecute messages received with namespace set to `mysqlx`.

* `Mysqlx_stmt_execute_sql`

  The number of StmtExecute requests received for the SQL namespace.

* `Mysqlx_stmt_execute_xplugin`

  This status variable is no longer used.

* `Mysqlx_stmt_get_collection_options`

  The number of get collection object statements received.

* `Mysqlx_stmt_kill_client`

  The number of kill client statements received.

* `Mysqlx_stmt_list_clients`

  The number of list client statements received.

* `Mysqlx_stmt_list_notices`

  The number of list notice statements received.

* `Mysqlx_stmt_list_objects`

  The number of list object statements received.

* `Mysqlx_stmt_modify_collection_options`

  The number of modify collection options statements received.

* `Mysqlx_stmt_ping`

  The number of ping statements received.

* `Mysqlx_worker_threads`

  The number of worker threads available.

* `Mysqlx_worker_threads_active`

  The number of worker threads currently used.


### 22.5.7 Monitoring X Plugin

For general X Plugin monitoring, use the status variables that it exposes. See Section 22.5.6.3, “X Plugin Status Variables”. For information specifically about monitoring the effects of message compression, see Monitoring Connection Compression for X Plugin.

#### Monitoring SQL Generated by X Plugin

This section describes how to monitor the SQL statements which X Plugin generates when you run X DevAPI operations. When you execute a CRUD statement, it is translated into SQL and executed against the server. To be able to monitor the generated SQL, the Performance Schema tables must be enabled. The SQL is registered under the `performance_schema.events_statements_current`, `performance_schema.events_statements_history`, and `performance_schema.events_statements_history_long` tables. The following example uses the `world_x` schema, imported as part of the quickstart tutorials in this section. We use MySQL Shell in Python mode, and the `\sql` command which enables you to issue SQL statements without changing to SQL mode. This is important, because if you instead try to switch to SQL mode, the procedure shows the result of this operation rather than the X DevAPI operation. The `\sql` command is used in the same way if you are using MySQL Shell in JavaScript mode.

1. Check if the `events_statements_history` consumer is enabled. Issue:

   ```
   mysql-py> \sql SELECT enabled FROM performance_schema.setup_consumers WHERE NAME = 'events_statements_history'
   +---------+
   | enabled |
   +---------+
   | YES     |
   +---------+
   ```

2. Check if all instruments report data to the consumer. Issue:

   ```
   mysql-py> \sql SELECT NAME, ENABLED, TIMED FROM performance_schema.setup_instruments WHERE NAME LIKE 'statement/%' AND NOT (ENABLED and TIMED)
   ```

   If this statement reports at least one row, you need to enable the instruments. See Section 29.4, “Performance Schema Runtime Configuration”.

3. Get the thread ID of the current connection. Issue:

   ```
   mysql-py> \sql SELECT thread_id INTO @id FROM performance_schema.threads WHERE processlist_id=connection_id()
   ```

4. Execute the X DevAPI CRUD operation for which you want to see the generated SQL. For example, issue:

   ```
   mysql-py> db.CountryInfo.find("Name = :country").bind("country", "Italy")
   ```

   You must not issue any further operations for the next step to show the correct result.

5. Show the last SQL query made by this thread ID. Issue:

   ```
   mysql-py> \sql SELECT THREAD_ID, MYSQL_ERRNO,SQL_TEXT FROM performance_schema.events_statements_history WHERE THREAD_ID=@id ORDER BY TIMER_START DESC LIMIT 1;
   +-----------+-------------+--------------------------------------------------------------------------------------+
   | THREAD_ID | MYSQL_ERRNO | SQL_TEXT                                                                             |
   +-----------+-------------+--------------------------------------------------------------------------------------+
   |        29 |           0 | SELECT doc FROM `world_x`.`CountryInfo` WHERE (JSON_EXTRACT(doc,'$.Name') = 'Italy') |
   +-----------+-------------+--------------------------------------------------------------------------------------+
   ```

   The result shows the SQL generated by X Plugin based on the most recent statement, in this case the X DevAPI CRUD operation from the previous step.
