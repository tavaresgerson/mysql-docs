## 6.3 Using Encrypted Connections

[6.3.1 Configuring MySQL to Use Encrypted Connections](using-encrypted-connections.html)

[6.3.2 Encrypted Connection TLS Protocols and Ciphers](encrypted-connection-protocols-ciphers.html)

[6.3.3 Creating SSL and RSA Certificates and Keys](creating-ssl-rsa-files.html)

[6.3.4 SSL Library-Dependent Capabilities](ssl-libraries.html)

[6.3.5 Connecting to MySQL Remotely from Windows with SSH](windows-and-ssh.html)

With an unencrypted connection between the MySQL client and the server, someone with access to the network could watch all your traffic and inspect the data being sent or received between client and server.

When you must move information over a network in a secure fashion, an unencrypted connection is unacceptable. To make any kind of data unreadable, use encryption. Encryption algorithms must include security elements to resist many kinds of known attacks such as changing the order of encrypted messages or replaying data twice.

MySQL supports encrypted connections between clients and the server using the TLS (Transport Layer Security) protocol. TLS is sometimes referred to as SSL (Secure Sockets Layer) but MySQL does not actually use the SSL protocol for encrypted connections because its encryption is weak (see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers")).

TLS uses encryption algorithms to ensure that data received over a public network can be trusted. It has mechanisms to detect data change, loss, or replay. TLS also incorporates algorithms that provide identity verification using the X.509 standard.

X.509 makes it possible to identify someone on the Internet. In basic terms, there should be some entity called a “Certificate Authority” (or CA) that assigns electronic certificates to anyone who needs them. Certificates rely on asymmetric encryption algorithms that have two encryption keys (a public key and a secret key). A certificate owner can present the certificate to another party as proof of identity. A certificate consists of its owner's public key. Any data encrypted using this public key can be decrypted only using the corresponding secret key, which is held by the owner of the certificate.

MySQL can be compiled for encrypted-connection support using OpenSSL or yaSSL. For a comparison of the two packages, see [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities") For information about the encryption protocols and ciphers each package supports, see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

Note

It is possible to compile MySQL using yaSSL as an alternative to OpenSSL only prior to MySQL 5.7.28. As of MySQL 5.7.28, support for yaSSL is removed and all MySQL builds use OpenSSL.

By default, MySQL programs attempt to connect using encryption if the server supports encrypted connections, falling back to an unencrypted connection if an encrypted connection cannot be established. For information about options that affect use of encrypted connections, see [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections") and [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

MySQL performs encryption on a per-connection basis, and use of encryption for a given user can be optional or mandatory. This enables you to choose an encrypted or unencrypted connection according to the requirements of individual applications. For information on how to require users to use encrypted connections, see the discussion of the `REQUIRE` clause of the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement in [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"). See also the description of the [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) system variable at [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables")

Encrypted connections can be used between source and replica servers. See [Section 16.3.8, “Setting Up Replication to Use Encrypted Connections”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

For information about using encrypted connections from the MySQL C API, see [Support for Encrypted Connections](/doc/c-api/5.7/en/c-api-encrypted-connections.html).

It is also possible to connect using encryption from within an SSH connection to the MySQL server host. For an example, see [Section 6.3.5, “Connecting to MySQL Remotely from Windows with SSH”](windows-and-ssh.html "6.3.5 Connecting to MySQL Remotely from Windows with SSH").

Several improvements were made to encrypted-connection support in MySQL 5.7. The following timeline summarizes the changes:

* 5.7.3: On the client side, an explicit [`--ssl`](connection-options.html#option_general_ssl) option is no longer advisory but prescriptive. Given a server enabled to support encrypted connections, a client program can require an encrypted connection by specifying only the [`--ssl`](connection-options.html#option_general_ssl) option. (Previously, it was necessary for the client to specify either the [`--ssl-ca`](connection-options.html#option_general_ssl-ca) option, or all three of the [`--ssl-ca`](connection-options.html#option_general_ssl-ca), [`--ssl-key`](connection-options.html#option_general_ssl-key), and [`--ssl-cert`](connection-options.html#option_general_ssl-cert) options.) The connection attempt fails if an encrypted connection cannot be established. Other `--ssl-xxx` options on the client side are advisory in the absence of [`--ssl`](connection-options.html#option_general_ssl): The client attempts to connect using encryption but falls back to an unencrypted connection if an encrypted connection cannot be established.

* 5.7.5: The server-side [`--ssl`](server-options.html#option_mysqld_ssl) option value is enabled by default.

  For servers compiled using OpenSSL, the [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) and [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) system variables are available to enable autogeneration and autodiscovery of SSL/RSA certificate and key files at startup. For certificate and key autodiscovery, if [`--ssl`](server-options.html#option_mysqld_ssl) is enabled and other `--ssl-xxx` options are *not* given to configure encrypted connections explicitly, the server attempts to enable support for encrypted connections automatically at startup if it discovers the requisite certificate and key files in the data directory.

* 5.7.6: The [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") utility is available to make it easier to manually generate SSL/RSA certificate and key files. Autodiscovery of SSL/RSA files at startup is expanded to apply to all servers, whether compiled using OpenSSL or yaSSL. (This means that [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) need not be enabled for autodiscovery to occur.)

  If the server discovers at startup that the CA certificate is self-signed, it writes a warning to the error log. (The certificate is self-signed if created automatically by the server, or manually using [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files").)

* 5.7.7: The C client library attempts to establish an encrypted connection by default if the server supports encrypted connections. This affects client programs as follows:

  + In the absence of an [`--ssl`](connection-options.html#option_general_ssl) option, clients attempt to connect using encryption, falling back to an unencrypted connection if an encrypted connection cannot be established.

  + The presence of an explicit [`--ssl`](connection-options.html#option_general_ssl) option or a synonym ([`--ssl=1`](connection-options.html#option_general_ssl), [`--enable-ssl`](connection-options.html#option_general_ssl)) is prescriptive: Clients require an encrypted connection and fail if one cannot be established.

  + With an [`--ssl=0`](connection-options.html#option_general_ssl) option or a synonym ([`--skip-ssl`](connection-options.html#option_general_ssl), [`--disable-ssl`](connection-options.html#option_general_ssl)), clients use an unencrypted connection.

  This change also affects subsequent releases of MySQL Connectors that are based on the C client library: Connector/C++ and Connector/ODBC.

* 5.7.8: The [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) system variable is available to control whether client connections to the server must use some form of secure transport.

* 5.7.10: TLS protocol support is extended from TLSv1 to also include TLSv1.1 and TLSv1.2. The [`tls_version`](server-system-variables.html#sysvar_tls_version) system variable on the server side and [`--tls-version`](connection-options.html#option_general_tls-version) option on the client side enable the level of support to be selected. See [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

* 5.7.11: MySQL client programs support an [`--ssl-mode`](connection-options.html#option_general_ssl-mode) option that enables you to specify the security state of the connection to the server. The [`--ssl-mode`](connection-options.html#option_general_ssl-mode) option comprises the capabilities of the client-side [`--ssl`](connection-options.html#option_general_ssl) and [`--ssl-verify-server-cert`](connection-options.html#option_general_ssl-verify-server-cert) options. Consequently, [`--ssl`](connection-options.html#option_general_ssl) and [`--ssl-verify-server-cert`](connection-options.html#option_general_ssl-verify-server-cert) are deprecated, and are removed in MySQL 8.0.

* 5.7.28: Support for yaSSL is removed. All MySQL builds use OpenSSL.

* 5.7.35: The TLSv1 and TLSv1.1 protocols are deprecated.
