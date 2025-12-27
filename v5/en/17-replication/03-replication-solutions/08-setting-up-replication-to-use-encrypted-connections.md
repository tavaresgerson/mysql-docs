### 16.3.8 Setting Up Replication to Use Encrypted Connections

To use an encrypted connection for the transfer of the binary log required during replication, both the source and the replica servers must support encrypted network connections. If either server does not support encrypted connections (because it has not been compiled or configured for them), replication through an encrypted connection is not possible.

Setting up encrypted connections for replication is similar to doing so for client/server connections. You must obtain (or create) a suitable security certificate that you can use on the source, and a similar certificate (from the same certificate authority) on each replica. You must also obtain suitable key files.

For more information on setting up a server and client for encrypted connections, see [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

To enable encrypted connections on the source, you must create or obtain suitable certificate and key files, and then add the following configuration parameters to the source's configuration within the `[mysqld]` section of the source's `my.cnf` file, changing the file names as necessary:

```sql
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

The paths to the files may be relative or absolute; we recommend that you always use complete paths for this purpose.

The configuration parameters are as follows:

* [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca): The path name of the Certificate Authority (CA) certificate file. (`--ssl-capath` is similar but specifies the path name of a directory of CA certificate files.)

* [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert): The path name of the server public key certificate file. This certificate can be sent to the client and authenticated against the CA certificate that it has.

* [`ssl_key`](server-system-variables.html#sysvar_ssl_key): The path name of the server private key file.

To enable encrypted connections on the replica, use the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement.

* To name the replica's certificate and SSL private key files using [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), add the appropriate `MASTER_SSL_xxx` options, like this:

  ```sql
      -> MASTER_SSL_CA = 'ca_file_name',
      -> MASTER_SSL_CAPATH = 'ca_directory_name',
      -> MASTER_SSL_CERT = 'cert_file_name',
      -> MASTER_SSL_KEY = 'key_file_name',
  ```

  These options correspond to the `--ssl-xxx` options with the same names, as described in [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). For these options to take effect, `MASTER_SSL=1` must also be set. For a replication connection, specifying a value for either of `MASTER_SSL_CA` or `MASTER_SSL_CAPATH` corresponds to setting `--ssl-mode=VERIFY_CA`. The connection attempt succeeds only if a valid matching Certificate Authority (CA) certificate is found using the specified information.

* To activate host name identity verification, add the `MASTER_SSL_VERIFY_SERVER_CERT` option:

  ```sql
      -> MASTER_SSL_VERIFY_SERVER_CERT=1,
  ```

  This option corresponds to the `--ssl-verify-server-cert` option, which is deprecated as of MySQL 5.7.11 and removed in MySQL 8.0. For a replication connection, specifying `MASTER_SSL_VERIFY_SERVER_CERT=1` corresponds to setting `--ssl-mode=VERIFY_IDENTITY`, as described in [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). For this option to take effect, `MASTER_SSL=1` must also be set. Host name identity verification does not work with self-signed certificates.

* To activate certificate revocation list (CRL) checks, add the `MASTER_SSL_CRL` or `MASTER_SSL_CRLPATH` option, as shown here:

  ```sql
      -> MASTER_SSL_CRL = 'crl_file_name',
      -> MASTER_SSL_CRLPATH = 'crl_directory_name',
  ```

  These options correspond to the `--ssl-xxx` options with the same names, as described in [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). If they are not specified, no CRL checking takes place.

* To specify lists of ciphers and encryption protocols permitted by the replica for the replication connection, add the `MASTER_SSL_CIPHER` and `MASTER_TLS_VERSION` options, like this:

  ```sql
      -> MASTER_SSL_CIPHER = 'cipher_list',
      -> MASTER_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

  The `MASTER_SSL_CIPHER` option specifies the list of ciphers permitted by the replica for the replication connection, with one or more cipher names separated by colons. The `MASTER_TLS_VERSION` option specifies the encryption protocols permitted by the replica for the replication connection. The format is like that for the [`tls_version`](server-system-variables.html#sysvar_tls_version) system variable, with one or more comma-separated protocol versions. The protocols and ciphers that you can use in these lists depend on the SSL library used to compile MySQL. For information about the formats and permitted values, see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

* After the source information has been updated, start the replication process on the replica, like this:

  ```sql
  mysql> START SLAVE;
  ```

  You can use the [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement to confirm that an encrypted connection was established successfully.

* Requiring encrypted connections on the replica does not ensure that the source requires encrypted connections from replicas. If you want to ensure that the source only accepts replicas that connect using encrypted connections, create a replication user account on the source using the `REQUIRE SSL` option, then grant that user the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege. For example:

  ```sql
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

  If you have an existing replication user account on the source, you can add `REQUIRE SSL` to it with this statement:

  ```sql
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```
