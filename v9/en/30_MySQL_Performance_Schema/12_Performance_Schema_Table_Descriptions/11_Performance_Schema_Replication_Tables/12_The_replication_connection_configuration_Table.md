#### 29.12.11.12 The replication\_connection\_configuration Table

This table shows the configuration parameters used by the replica for connecting to the source. Parameters stored in the table can be changed at runtime with the `CHANGE REPLICATION SOURCE TO` statement.

Compared to the `replication_connection_status` table, `replication_connection_configuration` changes less frequently. It contains values that define how the replica connects to the source and that remain constant during the connection, whereas `replication_connection_status` contains values that change during the connection.

The `replication_connection_configuration` table has the following columns. The column descriptions indicate the corresponding `CHANGE REPLICATION SOURCE TO` options from which the column values are taken, and the table given later in this section shows the correspondence between `replication_connection_configuration` columns and `SHOW REPLICA STATUS` columns.

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information. (`CHANGE REPLICATION SOURCE TO` option: `FOR CHANNEL`)

* `HOST`

  The host name of the source that the replica is connected to. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_HOST`)

* `PORT`

  The port used to connect to the source. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_PORT`)

* `USER`

  The user name of the replication user account used to connect to the source. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_USER`)

* `NETWORK_INTERFACE`

  The network interface that the replica is bound to, if any. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_BIND`)

* `AUTO_POSITION`

  1 if GTID auto-positioning is in use; otherwise 0. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_AUTO_POSITION`)

* `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

  These columns show the SSL parameters used by the replica to connect to the source, if any.

  `SSL_ALLOWED` has these values:

  + `Yes` if an SSL connection to the source is permitted

  + `No` if an SSL connection to the source is not permitted

  + `Ignored` if an SSL connection is permitted but the replica does not have SSL support enabled

  (`CHANGE REPLICATION SOURCE TO` options for the other SSL columns: `SOURCE_SSL_CA`, `SOURCE_SSL_CAPATH`, `SOURCE_SSL_CERT`, `SOURCE_SSL_CIPHER`, `SOURCE_SSL_CRL`, `SOURCE_SSL_CRLPATH`, `SOURCE_SSL_KEY`, `SOURCE_SSL_VERIFY_SERVER_CERT`)

* `CONNECTION_RETRY_INTERVAL`

  The number of seconds between connect retries. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_CONNECT_RETRY`)

* `CONNECTION_RETRY_COUNT`

  The number of times the replica can attempt to reconnect to the source in the event of a lost connection. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_RETRY_COUNT`)

* `HEARTBEAT_INTERVAL`

  The replication heartbeat interval on a replica, measured in seconds. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_HEARTBEAT_PERIOD`)

* `TLS_VERSION`

  The list of TLS protocol versions that are permitted by the replica for the replication connection. For TLS version information, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_TLS_VERSION`)

* `TLS_CIPHERSUITES`

  The list of ciphersuites that are permitted by the replica for the replication connection. For TLS ciphersuite information, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_TLS_CIPHERSUITES`)

* `PUBLIC_KEY_PATH`

  The path name to a file containing a replica-side copy of the public key required by the source for RSA key pair-based password exchange. The file must be in PEM format. This column applies to replicas that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_PUBLIC_KEY_PATH`)

  If `PUBLIC_KEY_PATH` is given and specifies a valid public key file, it takes precedence over `GET_PUBLIC_KEY`.

* `GET_PUBLIC_KEY`

  Whether to request from the source the public key required for RSA key pair-based password exchange. This column applies to replicas that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the source does not send the public key unless requested. (`CHANGE REPLICATION SOURCE TO` option: `GET_SOURCE_PUBLIC_KEY`)

  If `PUBLIC_KEY_PATH` is given and specifies a valid public key file, it takes precedence over `GET_PUBLIC_KEY`.

* `NETWORK_NAMESPACE`

  The network namespace name; empty if the connection uses the default (global) namespace. For information about network namespaces, see Section 7.1.14, “Network Namespace Support”.

* `COMPRESSION_ALGORITHM`

  The permitted compression algorithms for connections to the source. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_COMPRESSION_ALGORITHMS`)

  For more information, see Section 6.2.8, “Connection Compression Control”.

* `ZSTD_COMPRESSION_LEVEL`

  The compression level to use for connections to the source that use the `zstd` compression algorithm. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_ZSTD_COMPRESSION_LEVEL`)

  For more information, see Section 6.2.8, “Connection Compression Control”.

* `SOURCE_CONNECTION_AUTO_FAILOVER`

  Whether the asynchronous connection failover mechanism is activated for this replication channel. (`CHANGE REPLICATION SOURCE TO` option: `SOURCE_CONNECTION_AUTO_FAILOVER`)

  For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

* `GTID_ONLY`

  Indicates if this channel only uses GTIDs for the transaction queueing and application process and for recovery, and does not persist binary log and relay log file names and file positions in the replication metadata repositories. (`CHANGE REPLICATION SOURCE TO` option: `GTID_ONLY`)

  For more information, see Section 20.4.1, “GTIDs and Group Replication”.

The `replication_connection_configuration` table has these indexes:

* Primary key on (`CHANNEL_NAME`)

`TRUNCATE TABLE` is not permitted for the `replication_connection_configuration` table.

The following table shows the correspondence between `replication_connection_configuration` columns and `SHOW REPLICA STATUS` columns.

<table summary="Correspondence between replication_connection_configuration columns and SHOW REPLICA STATUS columns"><thead><tr> <th><code>replication_connection_configuration</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>CHANNEL_NAME</code></td> <td><code>Channel_name</code></td> </tr><tr> <td><code>HOST</code></td> <td><code>Source_Host</code></td> </tr><tr> <td><code>PORT</code></td> <td><code>Source_Port</code></td> </tr><tr> <td><code>USER</code></td> <td><code>Source_User</code></td> </tr><tr> <td><code>NETWORK_INTERFACE</code></td> <td><code>Source_Bind</code></td> </tr><tr> <td><code>AUTO_POSITION</code></td> <td><code>Auto_Position</code></td> </tr><tr> <td><code>SSL_ALLOWED</code></td> <td><code>Source_SSL_Allowed</code></td> </tr><tr> <td><code>SSL_CA_FILE</code></td> <td><code>Source_SSL_CA_File</code></td> </tr><tr> <td><code>SSL_CA_PATH</code></td> <td><code>Source_SSL_CA_Path</code></td> </tr><tr> <td><code>SSL_CERTIFICATE</code></td> <td><code>Source_SSL_Cert</code></td> </tr><tr> <td><code>SSL_CIPHER</code></td> <td><code>Source_SSL_Cipher</code></td> </tr><tr> <td><code>SSL_KEY</code></td> <td><code>Source_SSL_Key</code></td> </tr><tr> <td><code>SSL_VERIFY_SERVER_CERTIFICATE</code></td> <td><code>Source_SSL_Verify_Server_Cert</code></td> </tr><tr> <td><code>SSL_CRL_FILE</code></td> <td><code>Source_SSL_Crl</code></td> </tr><tr> <td><code>SSL_CRL_PATH</code></td> <td><code>Source_SSL_Crlpath</code></td> </tr><tr> <td><code>CONNECTION_RETRY_INTERVAL</code></td> <td><code>Source_Connect_Retry</code></td> </tr><tr> <td><code>CONNECTION_RETRY_COUNT</code></td> <td><code>Source_Retry_Count</code></td> </tr><tr> <td><code>HEARTBEAT_INTERVAL</code></td> <td>None</td> </tr><tr> <td><code>TLS_VERSION</code></td> <td><code>Source_TLS_Version</code></td> </tr><tr> <td><code>PUBLIC_KEY_PATH</code></td> <td><code>Source_public_key_path</code></td> </tr><tr> <td><code>GET_PUBLIC_KEY</code></td> <td><code>Get_source_public_key</code></td> </tr><tr> <td><code>NETWORK_NAMESPACE</code></td> <td><code>Network_Namespace</code></td> </tr><tr> <td><code>COMPRESSION_ALGORITHM</code></td> <td>[None]</td> </tr><tr> <td><code>ZSTD_COMPRESSION_LEVEL</code></td> <td>[None]</td> </tr><tr> <td><code>GTID_ONLY</code></td> <td>[None]</td> </tr></tbody></table>
