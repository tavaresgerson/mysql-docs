#### 25.12.11.1 The replication\_connection\_configuration Table

This table shows the configuration parameters used by the replica for connecting to the source. Parameters stored in the table can be changed at runtime with the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement, as indicated in the column descriptions.

Compared to the [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") table, [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") changes less frequently. It contains values that define how the replica connects to the source and that remain constant during the connection, whereas [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") contains values that change during the connection.

The [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") table has the following columns. The column descriptions indicate the corresponding `CHANGE MASTER TO` options from which the column values are taken, and the table given later in this section shows the correspondence between [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") columns and [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") columns.

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information. (`CHANGE MASTER TO` option: `FOR CHANNEL`)

* `HOST`

  The replication source server that the replica is connected to. (`CHANGE MASTER TO` option: `MASTER_HOST`)

* `PORT`

  The port used to connect to the replication source server. (`CHANGE MASTER TO` option: `MASTER_PORT`)

* `USER`

  The user name of the account used to connect to the replication source server. (`CHANGE MASTER TO` option: `MASTER_USER`)

* `NETWORK_INTERFACE`

  The network interface that the replica is bound to, if any. (`CHANGE MASTER TO` option: `MASTER_BIND`)

* `AUTO_POSITION`

  1 if autopositioning is in use; otherwise 0. (`CHANGE MASTER TO` option: `MASTER_AUTO_POSITION`)

* `SSL_ALLOWED`, `SSL_CA_FILE`, `SSL_CA_PATH`, `SSL_CERTIFICATE`, `SSL_CIPHER`, `SSL_KEY`, `SSL_VERIFY_SERVER_CERTIFICATE`, `SSL_CRL_FILE`, `SSL_CRL_PATH`

  These columns show the SSL parameters used by the replica to connect to the replication source server, if any.

  `SSL_ALLOWED` has these values:

  + `Yes` if an SSL connection to the source is permitted

  + `No` if an SSL connection to the source is not permitted

  + `Ignored` if an SSL connection is permitted but the replica does not have SSL support enabled

  `CHANGE MASTER TO` options for the other SSL columns: `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, `MASTER_SSL_VERIFY_SERVER_CERT`.

* `CONNECTION_RETRY_INTERVAL`

  The number of seconds between connect retries. (`CHANGE MASTER TO` option: `MASTER_CONNECT_RETRY`)

* `CONNECTION_RETRY_COUNT`

  The number of times the replica can attempt to reconnect to the source in the event of a lost connection. (`CHANGE MASTER TO` option: `MASTER_RETRY_COUNT`)

* `HEARTBEAT_INTERVAL`

  The replication heartbeat interval on a replica, measured in seconds. (`CHANGE MASTER TO` option: `MASTER_HEARTBEAT_PERIOD`)

* `TLS_VERSION`

  The TLS version used on the source. For TLS version information, see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers"). (`CHANGE MASTER TO` option: `MASTER_TLS_VERSION`)

  This column was added in MySQL 5.7.10.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") table.

The following table shows the correspondence between [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") columns and [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") columns.

<table summary="Correspondence between replication_connection_configuration columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code class="literal">replication_connection_configuration</code> Column</th> <th><code class="literal">SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code class="literal">CHANNEL_NAME</code></td> <td><code class="literal">Channel_name</code></td> </tr><tr> <td><code class="literal">HOST</code></td> <td><code class="literal">Master_Host</code></td> </tr><tr> <td><code class="literal">PORT</code></td> <td><code class="literal">Master_Port</code></td> </tr><tr> <td><code class="literal">USER</code></td> <td><code class="literal">Master_User</code></td> </tr><tr> <td><code class="literal">NETWORK_INTERFACE</code></td> <td><code class="literal">Master_Bind</code></td> </tr><tr> <td><code class="literal">AUTO_POSITION</code></td> <td><code class="literal">Auto_Position</code></td> </tr><tr> <td><code class="literal">SSL_ALLOWED</code></td> <td><code class="literal">Master_SSL_Allowed</code></td> </tr><tr> <td><code class="literal">SSL_CA_FILE</code></td> <td><code class="literal">Master_SSL_CA_File</code></td> </tr><tr> <td><code class="literal">SSL_CA_PATH</code></td> <td><code class="literal">Master_SSL_CA_Path</code></td> </tr><tr> <td><code class="literal">SSL_CERTIFICATE</code></td> <td><code class="literal">Master_SSL_Cert</code></td> </tr><tr> <td><code class="literal">SSL_CIPHER</code></td> <td><code class="literal">Master_SSL_Cipher</code></td> </tr><tr> <td><code class="literal">SSL_KEY</code></td> <td><code class="literal">Master_SSL_Key</code></td> </tr><tr> <td><code class="literal">SSL_VERIFY_SERVER_CERTIFICATE</code></td> <td><code class="literal">Master_SSL_Verify_Server_Cert</code></td> </tr><tr> <td><code class="literal">SSL_CRL_FILE</code></td> <td><code class="literal">Master_SSL_Crl</code></td> </tr><tr> <td><code class="literal">SSL_CRL_PATH</code></td> <td><code class="literal">Master_SSL_Crlpath</code></td> </tr><tr> <td><code class="literal">CONNECTION_RETRY_INTERVAL</code></td> <td><code class="literal">Connect_Retry</code></td> </tr><tr> <td><code class="literal">CONNECTION_RETRY_COUNT</code></td> <td><code class="literal">Master_Retry_Count</code></td> </tr><tr> <td><code class="literal">HEARTBEAT_INTERVAL</code></td> <td>None</td> </tr><tr> <td><code class="literal">TLS_VERSION</code></td> <td><code class="literal">Master_TLS_Version</code></td> </tr></tbody></table>
