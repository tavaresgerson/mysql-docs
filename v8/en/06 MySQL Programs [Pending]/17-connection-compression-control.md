### 6.2.8 Connection Compression Control

Connections to the server can use compression on the traffic between client and server to reduce the number of bytes sent over the connection. By default, connections are uncompressed, but can be compressed if the server and the client agree on a mutually permitted compression algorithm.

Compressed connections originate on the client side but affect CPU load on both the client and server sides because both sides perform compression and decompression operations. Because enabling compression decreases performance, its benefits occur primarily when there is low network bandwidth, network transfer time dominates the cost of compression and decompression operations, and result sets are large.

This section describes the available compression-control configuration parameters and the information sources available for monitoring use of compression. It applies to classic MySQL protocol connections.

Compression control applies to connections to the server by client programs and by servers participating in source/replica replication or Group Replication. Compression control does not apply to connections for `FEDERATED` tables. In the following discussion, “client connection” is shorthand for a connection to the server originating from any source for which compression is supported, unless context indicates a specific connection type.

::: info Note

X Protocol connections to a MySQL Server instance support compression, but compression for X Protocol connections operates independently from the compression for classic MySQL protocol connections described here, and is controlled separately. See Section 22.5.5, “Connection Compression with X Plugin” for information on X Protocol connection compression.

:::

*  Configuring Connection Compression
*  Configuring Legacy Connection Compression
*  Monitoring Connection Compression

#### Configuring Connection Compression

These configuration parameters are available for controlling connection compression:

* The `protocol_compression_algorithms` system variable configures which compression algorithms the server permits for incoming connections.
* The  `--compression-algorithms` and  `--zstd-compression-level` command-line options configure permitted compression algorithms and `zstd` compression level for these client programs:  `mysql`, `mysqladmin`, **mysqlbinlog**, `mysqlcheck`,  `mysqldump`, **mysqlimport**, `mysqlshow`,  **mysqlslap**, and **mysqltest**. MySQL Shell also offers these command-line options.
* The `MYSQL_OPT_COMPRESSION_ALGORITHMS` and `MYSQL_OPT_ZSTD_COMPRESSION_LEVEL` options for the  `mysql_options()` function configure permitted compression algorithms and `zstd` compression level for client programs that use the MySQL C API.
* The `SOURCE_COMPRESSION_ALGORITHMS` and `SOURCE_ZSTD_COMPRESSION_LEVEL` options for the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement configure permitted compression algorithms and `zstd` compression level for replica servers participating in source/replica replication.
* The `group_replication_recovery_compression_algorithms` and `group_replication_recovery_zstd_compression_level` system variables configure permitted compression algorithms and `zstd` compression level for Group Replication recovery connections when a new member joins a group and connects to a donor.

Configuration parameters that enable specifying compression algorithms are string-valued and take a list of one or more comma-separated compression algorithm names, in any order, chosen from the following items (not case-sensitive):

* `zlib`: Permit connections that use the `zlib` compression algorithm.
* `zstd`: Permit connections that use the `zstd` compression algorithm.
* `uncompressed`: Permit uncompressed connections.

::: info Note

Because `uncompressed` is an algorithm name that may or may not be configured, it is possible to configure MySQL *not* to permit uncompressed connections.

:::

Examples:

* To configure which compression algorithms the server permits for incoming connections, set the `protocol_compression_algorithms` system variable. By default, the server permits all available algorithms. To configure that setting explicitly at startup, use these lines in the server `my.cnf` file:

  ```
  [mysqld]
  protocol_compression_algorithms=zlib,zstd,uncompressed
  ```

  To set and persist the `protocol_compression_algorithms` system variable to that value at runtime, use this statement:

  ```
  SET PERSIST protocol_compression_algorithms='zlib,zstd,uncompressed';
  ```

  [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") sets a value for the running MySQL instance. It also saves the value, causing it to carry over to subsequent server restarts. To change the value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.
* To permit only incoming connections that use `zstd` compression, configure the server at startup like this:

  ```
  [mysqld]
  protocol_compression_algorithms=zstd
  ```

  Or, to make the change at runtime:

  ```
  SET PERSIST protocol_compression_algorithms='zstd';
  ```
* To permit the  `mysql` client to initiate `zlib` or `uncompressed` connections, invoke it like this:

  ```
  mysql --compression-algorithms=zlib,uncompressed
  ```
* To configure replicas to connect to the source using `zlib` or `zstd` connections, with a compression level of 7 for `zstd` connections, use a `CHANGE REPLICATION SOURCE TO` statement:

  ```
  CHANGE REPLICATION SOURCE TO
    SOURCE_COMPRESSION_ALGORITHMS = 'zlib,zstd',
    SOURCE_ZSTD_COMPRESSION_LEVEL = 7;
  ```

  This assumes that the `replica_compressed_protocol` system variable is disabled, for reasons described in Configuring Legacy Connection Compression.

For successful connection setup, both sides of the connection must agree on a mutually permitted compression algorithm. The algorithm-negotiation process attempts to use `zlib`, then `zstd`, then `uncompressed`. If the two sides can find no common algorithm, the connection attempt fails.

Because both sides must agree on the compression algorithm, and because `uncompressed` is an algorithm value that is not necessarily permitted, fallback to an uncompressed connection does not necessarily occur. For example, if the server is configured to permit `zstd` and a client is configured to permit `zlib,uncompressed`, the client cannot connect at all. In this case, no algorithm is common to both sides, so connection attempts fail.

Configuration parameters that enable specifying the `zstd` compression level take an integer value from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

A configurable `zstd` compression level enables choosing between less network traffic and higher CPU load versus more network traffic and lower CPU load. Higher compression levels reduce network congestion but the additional CPU load may reduce server performance.

#### Configuring Legacy Connection Compression

Prior to MySQL 8.0.18, these configuration parameters are available for controlling connection compression:

* Client programs support a `--compress` command-line option to specify use of compression for the connection to the server.
* For programs that use the MySQL C API, enabling the `MYSQL_OPT_COMPRESS` option for the `mysql_options()` function specifies use of compression for the connection to the server.
* For source/replica replication, enabling the system variable `replica_compressed_protocol` specifies use of compression for replica connections to the source.

In each case, when use of compression is specified, the connection uses the `zlib` compression algorithm if both sides permit it, with fallback to an uncompressed connection otherwise.

As of MySQL 8.0.18, the compression parameters just described become legacy parameters, due to the additional compression parameters introduced for more control over connection compression that are described in Configuring Connection Compression. An exception is MySQL Shell, where the `--compress` command-line option remains current, and can be used to request compression without selecting compression algorithms. For information on MySQL Shell's connection compression control, see Using Compressed Connections.

The legacy compression parameters interact with the newer parameters and their semantics change as follows:

* The meaning of the legacy `--compress` option depends on whether `--compression-algorithms` is specified:

  + When `--compression-algorithms` is not specified, `--compress` is equivalent to specifying a client-side algorithm set of `zlib,uncompressed`.
  + When `--compression-algorithms` is specified,  `--compress` is equivalent to specifying an algorithm set of `zlib` and the full client-side algorithm set is the union of `zlib` plus the algorithms specified by `--compression-algorithms`. For example, with both `--compress` and `--compression-algorithms=zlib,zstd`, the permitted-algorithm set is `zlib` plus `zlib,zstd`; that is, `zlib,zstd`. With both `--compress` and `--compression-algorithms=zstd,uncompressed`, the permitted-algorithm set is `zlib` plus `zstd,uncompressed`; that is, `zlib,zstd,uncompressed`.
* The same type of interaction occurs between the legacy `MYSQL_OPT_COMPRESS` option and the `MYSQL_OPT_COMPRESSION_ALGORITHMS` option for the  `mysql_options()` C API function.
* If the `replica_compressed_protocol` system variable is enabled, it takes precedence over `SOURCE_COMPRESSION_ALGORITHMS` and connections to the source use `zlib` compression if both source and replica permit that algorithm. If `replica_compressed_protocol` is disabled, the value of `SOURCE_COMPRESSION_ALGORITHMS` applies.

#### Monitoring Connection Compression

The  `Compression` status variable is `ON` or `OFF` to indicate whether the current connection uses compression.

The  `mysql` client `\status` command displays a line that says `Protocol: Compressed` if compression is enabled for the current connection. If that line is not present, the connection is uncompressed.

The MySQL Shell `\status` command displays a `Compression:` line that says `Disabled` or `Enabled` to indicate whether the connection is compressed.

These additional sources of information are available for monitoring connection compression:

* To monitor compression in use for client connections, use the  `Compression_algorithm` and  `Compression_level` status variables. For the current connection, their values indicate the compression algorithm and compression level, respectively.
* To determine which compression algorithms the server is configured to permit for incoming connections, check the `protocol_compression_algorithms` system variable.
* For source/replica replication connections, the configured compression algorithms and compression level are available from multiple sources:

  + The Performance Schema `replication_connection_configuration` table has `COMPRESSION_ALGORITHMS` and `ZSTD_COMPRESSION_LEVEL` columns.
  + The `mysql.slave_master_info` system table has `Master_compression_algorithms` and `Master_zstd_compression_level` columns. If the `master.info` file exists, it contains lines for those values as well.
