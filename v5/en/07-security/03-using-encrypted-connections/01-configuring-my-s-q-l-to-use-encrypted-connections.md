### 6.3.1 Configuring MySQL to Use Encrypted Connections

Several configuration parameters are available to indicate whether to use encrypted connections, and to specify the appropriate certificate and key files. This section provides general guidance about configuring the server and clients for encrypted connections:

* [Server-Side Startup Configuration for Encrypted Connections](using-encrypted-connections.html#using-encrypted-connections-server-side-startup-configuration "Server-Side Startup Configuration for Encrypted Connections")
* [Client-Side Configuration for Encrypted Connections](using-encrypted-connections.html#using-encrypted-connections-client-side-configuration "Client-Side Configuration for Encrypted Connections")
* [Configuring Encrypted Connections as Mandatory](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory")

Encrypted connections also can be used in other contexts, as discussed in these additional sections:

* Between source and replica servers. See [Section 16.3.8, “Setting Up Replication to Use Encrypted Connections”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

* Among Group Replication servers. See [Section 17.6.2, “Group Replication Secure Socket Layer (SSL) Support”](group-replication-secure-socket-layer-support-ssl.html "17.6.2 Group Replication Secure Socket Layer (SSL) Support").

* By client programs that are based on the MySQL C API. See [Support for Encrypted Connections](/doc/c-api/5.7/en/c-api-encrypted-connections.html).

Instructions for creating any required certificate and key files are available in [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

#### Server-Side Startup Configuration for Encrypted Connections

On the server side, the [`--ssl`](server-options.html#option_mysqld_ssl) option specifies that the server permits but does not require encrypted connections. This option is enabled by default, so it need not be specified explicitly.

To require that clients connect using encrypted connections, enable the [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) system variable. See [Configuring Encrypted Connections as Mandatory](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory").

These system variables on the server side specify the certificate and key files the server uses when permitting clients to establish encrypted connections:

* [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca): The path name of the Certificate Authority (CA) certificate file. ([`ssl_capath`](server-system-variables.html#sysvar_ssl_capath) is similar but specifies the path name of a directory of CA certificate files.)

* [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert): The path name of the server public key certificate file. This certificate can be sent to the client and authenticated against the CA certificate that it has.

* [`ssl_key`](server-system-variables.html#sysvar_ssl_key): The path name of the server private key file.

For example, to enable the server for encrypted connections, start it with these lines in the `my.cnf` file, changing the file names as necessary:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

To specify in addition that clients are required to use encrypted connections, enable the [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) system variable:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
require_secure_transport=ON
```

Each certificate and key system variable names a file in PEM format. Should you need to create the required certificate and key files, see [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys"). MySQL servers compiled using OpenSSL can generate missing certificate and key files automatically at startup. See [Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL"). Alternatively, if you have a MySQL source distribution, you can test your setup using the demonstration certificate and key files in its `mysql-test/std_data` directory.

The server performs certificate and key file autodiscovery. If no explicit encrypted-connection options are given other than [`--ssl`](server-options.html#option_mysqld_ssl) (possibly along with [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher)) to configure encrypted connections, the server attempts to enable encrypted-connection support automatically at startup:

* If the server discovers valid certificate and key files named `ca.pem`, `server-cert.pem`, and `server-key.pem` in the data directory, it enables support for encrypted connections by clients. (The files need not have been generated automatically; what matters is that they have those names and are valid.)

* If the server does not find valid certificate and key files in the data directory, it continues executing but without support for encrypted connections.

If the server automatically enables encrypted connection support, it writes a note to the error log. If the server discovers that the CA certificate is self-signed, it writes a warning to the error log. (The certificate is self-signed if created automatically by the server or manually using [**mysql\_ssl\_rsa\_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files").)

MySQL also provides these system variables for server-side encrypted-connection control:

* [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher): The list of permissible ciphers for connection encryption.

* [`ssl_crl`](server-system-variables.html#sysvar_ssl_crl): The path name of the file containing certificate revocation lists. ([`ssl_crlpath`](server-system-variables.html#sysvar_ssl_crlpath) is similar but specifies the path name of a directory of certificate revocation-list files.)

* [`tls_version`](server-system-variables.html#sysvar_tls_version): Which encryption protocols the server permits for encrypted connections; see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers"). For example, you can configure [`tls_version`](server-system-variables.html#sysvar_tls_version) to prevent clients from using less-secure protocols.

#### Client-Side Configuration for Encrypted Connections

For a complete list of client options related to establishment of encrypted connections, see [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

By default, MySQL client programs attempt to establish an encrypted connection if the server supports encrypted connections, with further control available through the [`--ssl-mode`](connection-options.html#option_general_ssl-mode) option:

* In the absence of an [`--ssl-mode`](connection-options.html#option_general_ssl-mode) option, clients attempt to connect using encryption, falling back to an unencrypted connection if an encrypted connection cannot be established. This is also the behavior with an explicit [`--ssl-mode=PREFERRED`](connection-options.html#option_general_ssl-mode) option.

* With [`--ssl-mode=REQUIRED`](connection-options.html#option_general_ssl-mode), clients require an encrypted connection and fail if one cannot be established.

* With [`--ssl-mode=DISABLED`](connection-options.html#option_general_ssl-mode), clients use an unencrypted connection.

* With [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode) or [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode), clients require an encrypted connection, and also perform verification against the server CA certificate and (with `VERIFY_IDENTITY`) against the server host name in its certificate.

Important

The default setting, [`--ssl-mode=PREFERRED`](connection-options.html#option_general_ssl-mode), produces an encrypted connection if the other default settings are unchanged. However, to help prevent sophisticated man-in-the-middle attacks, it is important for the client to verify the server’s identity. The settings [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode) and [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode) are a better choice than the default setting to help prevent this type of attack. `VERIFY_CA` makes the client check that the server’s certificate is valid. `VERIFY_IDENTITY` makes the client check that the server’s certificate is valid, and also makes the client check that the host name the client is using matches the identity in the server’s certificate. To implement one of these settings, you must first ensure that the CA certificate for the server is reliably available to all the clients that use it in your environment, otherwise availability issues will result. For this reason, they are not the default setting.

Attempts to establish an unencrypted connection fail if the [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) system variable is enabled on the server side to cause the server to require encrypted connections. See [Configuring Encrypted Connections as Mandatory](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory").

The following options on the client side identify the certificate and key files clients use when establishing encrypted connections to the server. They are similar to the [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca), [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert), and [`ssl_key`](server-system-variables.html#sysvar_ssl_key) system variables used on the server side, but [`--ssl-cert`](connection-options.html#option_general_ssl-cert) and [`--ssl-key`](connection-options.html#option_general_ssl-key) identify the client public and private key:

* [`--ssl-ca`](connection-options.html#option_general_ssl-ca): The path name of the Certificate Authority (CA) certificate file. This option, if used, must specify the same certificate used by the server. (`--ssl-capath` is similar but specifies the path name of a directory of CA certificate files.)

* [`--ssl-cert`](connection-options.html#option_general_ssl-cert): The path name of the client public key certificate file.

* [`--ssl-key`](connection-options.html#option_general_ssl-key): The path name of the client private key file.

For additional security relative to that provided by the default encryption, clients can supply a CA certificate matching the one used by the server and enable host name identity verification. In this way, the server and client place their trust in the same CA certificate and the client verifies that the host to which it connected is the one intended:

* To specify the CA certificate, use [`--ssl-ca`](connection-options.html#option_general_ssl-ca) (or [`--ssl-capath`](connection-options.html#option_general_ssl-capath)), and specify [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode).

* To enable host name identity verification as well, use [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode) rather than [`--ssl-mode=VERIFY_CA`](connection-options.html#option_general_ssl-mode).

Note

Host name identity verification with `VERIFY_IDENTITY` does not work with self-signed certificates that are created automatically by the server or manually using [**mysql\_ssl\_rsa\_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") (see [Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL")). Such self-signed certificates do not contain the server name as the Common Name value.

Prior to MySQL 5.7.23, host name identity verification also does not work with certificates that specify the Common Name using wildcards because that name is compared verbatim to the server name.

MySQL also provides these options for client-side encrypted-connection control:

* [`--ssl-cipher`](connection-options.html#option_general_ssl-cipher): The list of permissible ciphers for connection encryption.

* [`--ssl-crl`](connection-options.html#option_general_ssl-crl): The path name of the file containing certificate revocation lists. (`--ssl-crlpath` is similar but specifies the path name of a directory of certificate revocation-list files.)

* [`--tls-version`](connection-options.html#option_general_tls-version): The permitted encryption protocols; see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

Depending on the encryption requirements of the MySQL account used by a client, the client may be required to specify certain options to connect using encryption to the MySQL server.

Suppose that you want to connect using an account that has no special encryption requirements or that was created using a [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement that included the `REQUIRE SSL` clause. Assuming that the server supports encrypted connections, a client can connect using encryption with no [`--ssl-mode`](connection-options.html#option_general_ssl-mode) option or with an explicit [`--ssl-mode=PREFERRED`](connection-options.html#option_general_ssl-mode) option:

```sql
mysql
```

Or:

```sql
mysql --ssl-mode=PREFERRED
```

For an account created with a `REQUIRE SSL` clause, the connection attempt fails if an encrypted connection cannot be established. For an account with no special encryption requirements, the attempt falls back to an unencrypted connection if an encrypted connection cannot be established. To prevent fallback and fail if an encrypted connection cannot be obtained, connect like this:

```sql
mysql --ssl-mode=REQUIRED
```

If the account has more stringent security requirements, other options must be specified to establish an encrypted connection:

* For accounts created with a `REQUIRE X509` clause, clients must specify at least [`--ssl-cert`](connection-options.html#option_general_ssl-cert) and [`--ssl-key`](connection-options.html#option_general_ssl-key). In addition, [`--ssl-ca`](connection-options.html#option_general_ssl-ca) (or [`--ssl-capath`](connection-options.html#option_general_ssl-capath)) is recommended so that the public certificate provided by the server can be verified. For example (enter the command on a single line):

  ```sql
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

* For accounts created with a `REQUIRE ISSUER` or `REQUIRE SUBJECT` clause, the encryption requirements are the same as for `REQUIRE X509`, but the certificate must match the issue or subject, respectively, specified in the account definition.

For additional information about the `REQUIRE` clause, see [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

MySQL servers can generate client certificate and key files that clients can use to connect to MySQL server instances. See [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

Important

If a client connecting to a MySQL server instance uses an SSL certificate with the `extendedKeyUsage` extension (an X.509 v3 extension), the extended key usage must include client authentication (`clientAuth`). If the SSL certificate is only specified for server authentication (`serverAuth`) and other non-client certificate purposes, certificate verification fails and the client connection to the MySQL server instance fails. There is no `extendedKeyUsage` extension in SSL certificates generated by MySQL Server (as described in [Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL")), and SSL certificates created using the **openssl** command following the instructions in [Section 6.3.3.2, “Creating SSL Certificates and Keys Using openssl”](creating-ssl-files-using-openssl.html "6.3.3.2 Creating SSL Certificates and Keys Using openssl"). If you use your own client certificate created in another way, ensure any `extendedKeyUsage` extension includes client authentication.

To prevent use of encryption and override other `--ssl-xxx` options, invoke the client program with [`--ssl-mode=DISABLED`](connection-options.html#option_general_ssl-mode):

```sql
mysql --ssl-mode=DISABLED
```

To determine whether the current connection with the server uses encryption, check the session value of the [`Ssl_cipher`](server-status-variables.html#statvar_Ssl_cipher) status variable. If the value is empty, the connection is not encrypted. Otherwise, the connection is encrypted and the value indicates the encryption cipher. For example:

```sql
mysql> SHOW SESSION STATUS LIKE 'Ssl_cipher';
+---------------+---------------------------+
| Variable_name | Value                     |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
+---------------+---------------------------+
```

For the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, an alternative is to use the `STATUS` or `\s` command and check the `SSL` line:

```sql
mysql> \s
...
SSL: Not in use
...
```

Or:

```sql
mysql> \s
...
SSL: Cipher in use is DHE-RSA-AES128-GCM-SHA256
...
```

#### Configuring Encrypted Connections as Mandatory

For some MySQL deployments it may be not only desirable but mandatory to use encrypted connections (for example, to satisfy regulatory requirements). This section discusses configuration settings that enable you to do this. These levels of control are available:

* You can configure the server to require that clients connect using encrypted connections.

* You can invoke individual client programs to require an encrypted connection, even if the server permits but does not require encryption.

* You can configure individual MySQL accounts to be usable only over encrypted connections.

To require that clients connect using encrypted connections, enable the [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) system variable. For example, put these lines in the server `my.cnf` file:

```sql
[mysqld]
require_secure_transport=ON
```

With [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) enabled, client connections to the server are required to use some form of secure transport, and the server permits only TCP/IP connections that use SSL, or connections that use a socket file (on Unix) or shared memory (on Windows). The server rejects nonsecure connection attempts, which fail with an [`ER_SECURE_TRANSPORT_REQUIRED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_secure_transport_required) error.

To invoke a client program such that it requires an encrypted connection whether or not the server requires encryption, use an [`--ssl-mode`](connection-options.html#option_general_ssl-mode) option value of `REQUIRED`, `VERIFY_CA`, or `VERIFY_IDENTITY`. For example:

```sql
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```

To configure a MySQL account to be usable only over encrypted connections, include a `REQUIRE` clause in the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement that creates the account, specifying in that clause the encryption characteristics you require. For example, to require an encrypted connection and the use of a valid X.509 certificate, use `REQUIRE X509`:

```sql
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```

For additional information about the `REQUIRE` clause, see [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

To modify existing accounts that have no encryption requirements, use the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement.
