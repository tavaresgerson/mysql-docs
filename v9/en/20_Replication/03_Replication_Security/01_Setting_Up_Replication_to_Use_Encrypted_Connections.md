### 19.3.1 Setting Up Replication to Use Encrypted Connections

To use an encrypted connection for the transfer of the binary log required during replication, both the source and the replica servers must support encrypted network connections. If either server does not support encrypted connections (because it has not been compiled or configured for them), replication through an encrypted connection is not possible.

Setting up encrypted connections for replication is similar to doing so for client/server connections. You must obtain (or create) a suitable security certificate that you can use on the source, and a similar certificate (from the same certificate authority) on each replica. You must also obtain suitable key files.

For more information on setting up a server and client for encrypted connections, see Section 8.3.1, “Configuring MySQL to Use Encrypted Connections”.

To enable encrypted connections on the source, you must create or obtain suitable certificate and key files, and then add the following configuration parameters to the `[mysqld]` section of the source `my.cnf` file, changing the file names as necessary:

```
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

The paths to the files may be relative or absolute; we recommend that you always use complete paths for this purpose.

The configuration parameters are as follows:

* `ssl_ca`: The path name of the Certificate Authority (CA) certificate file. (`ssl_capath` is similar but specifies the path name of a directory of CA certificate files.)

* `ssl_cert`: The path name of the server public key certificate file. This certificate can be sent to the client and authenticated against the CA certificate that it has.

* `ssl_key`: The path name of the server private key file.

To enable encrypted connections on the replica, use the `CHANGE REPLICATION SOURCE TO` statement.

* To name the replica's certificate and SSL private key files using `CHANGE REPLICATION SOURCE TO`, add the appropriate `SOURCE_SSL_xxx` options, like this:

  ```
      -> SOURCE_SSL_CA = 'ca_file_name',
      -> SOURCE_SSL_CAPATH = 'ca_directory_name',
      -> SOURCE_SSL_CERT = 'cert_file_name',
      -> SOURCE_SSL_KEY = 'key_file_name',
  ```

  These options correspond to the `--ssl-xxx` options with the same names, as described in Command Options for Encrypted Connections. For these options to take effect, `SOURCE_SSL=1` must also be set. For a replication connection, specifying a value for either of `SOURCE_SSL_CA` or `SOURCE_SSL_CAPATH` corresponds to setting `--ssl-mode=VERIFY_CA`. The connection attempt succeeds only if a valid matching Certificate Authority (CA) certificate is found using the specified information.

* To activate host name identity verification, add the `SOURCE_SSL_VERIFY_SERVER_CERT` option, like this:

  ```
      -> SOURCE_SSL_VERIFY_SERVER_CERT=1,
  ```

  For a replication connection, specifying `SOURCE_SSL_VERIFY_SERVER_CERT=1` corresponds to setting `--ssl-mode=VERIFY_IDENTITY`, as described in Command Options for Encrypted Connections. For this option to take effect, `SOURCE_SSL=1` must also be set. Host name identity verification does not work with self-signed certificates.

* To activate certificate revocation list (CRL) checks, add the `SOURCE_SSL_CRL` or `SOURCE_SSL_CRLPATH` option, as shown here:

  ```
      -> SOURCE_SSL_CRL = 'crl_file_name',
      -> SOURCE_SSL_CRLPATH = 'crl_directory_name',
  ```

  These options correspond to the `--ssl-xxx` options with the same names, as described in Command Options for Encrypted Connections. If they are not specified, no CRL checking takes place.

* To specify lists of ciphers, ciphersuites, and encryption protocols permitted by the replica for the replication connection, use the `SOURCE_SSL_CIPHER`, `SOURCE_TLS_VERSION`, and `SOURCE_TLS_CIPHERSUITES` options, like this:

  ```
      -> SOURCE_SSL_CIPHER = 'cipher_list',
      -> SOURCE_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

  + The `SOURCE_SSL_CIPHER` option specifies a colon-separated list of one or more ciphers permitted by the replica for the replication connection.

  + The `SOURCE_TLS_VERSION` option specifies a comma-separated list of the TLS encryption protocols permitted by the replica for the replication connection, in a format like that for the `tls_version` server system variable. The connection procedure negotiates the use of the highest TLS version that both the source and the replica permit. To be able to connect, the replica must have at least one TLS version in common with the source.

  + The `SOURCE_TLS_CIPHERSUITES` option specifies a colon-separated list of one or more ciphersuites that are permitted by the replica for the replication connection if TLSv1.3 is used for the connection. If this option is set to `NULL` when TLSv1.3 is used (which is the default if you do not set the option), the ciphersuites that are enabled by default are allowed. If you set the option to an empty string, no cipher suites are allowed, and TLSv1.3 is therefore not used.

  The protocols, ciphers, and ciphersuites that you can specify in these lists depend on the SSL library used to compile MySQL. For information about the formats, the permitted values, and the defaults if you do not specify the options, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  Note

  You can use the `SOURCE_TLS_CIPHERSUITES` option to specify any selection of ciphersuites, including only non-default ciphersuites if you want.

* After the source information has been updated, start the replication process on the replica, like this:

  ```
  mysql> START REPLICA;
  ```

  You can use the `SHOW REPLICA STATUS` statement to confirm that an encrypted connection was established successfully.

* Requiring encrypted connections on the replica does not ensure that the source requires encrypted connections from replicas. If you want to ensure that the source only accepts replicas that connect using encrypted connections, create a replication user account on the source using the `REQUIRE SSL` option, then grant that user the `REPLICATION SLAVE` privilege. For example:

  ```
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

  If you have an existing replication user account on the source, you can add `REQUIRE SSL` to it with this statement:

  ```
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```
