### 8.3.2 Encrypted Connection TLS Protocols and Ciphers

MySQL supports multiple TLS protocols and ciphers, and enables configuring which protocols and ciphers to permit for encrypted connections. It is also possible to determine which protocol and cipher the current session uses.

* Supported TLS Protocols
* Connection TLS Protocol Configuration
* Connection Cipher Configuration
* Connection TLS Protocol Negotiation
* Monitoring Current Client Session TLS Protocol and Cipher

#### Supported TLS Protocols

MySQL 9.5 supports the TLSv1.2 and TLSv1.3 protocols for connections. To use TLSv1.3, both the MySQL server and the client application must be compiled using OpenSSL 1.1.1 or higher. The Group Replication component supports TLSv1.3 from MySQL 8.0.18 (for details, see Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”")).

MySQL 9.5 does not support the old TLSv1 and TLSv1.1 protocols.

Permitted TLS protocols can be configured on both the server side and client side to include only a subset of the supported TLS protocols. The configuration on both sides must include at least one protocol in common or connection attempts cannot negotiate a protocol to use. For details, see Connection TLS Protocol Negotiation.

The host system may permit only certain TLS protocols, which means that MySQL connections cannot use protocols not allowed by the host even if MySQL itself permits them. Possible workarounds for this issue include the following:

* Change the system-wide host configuration to permit additional TLS protocols. Consult your operating system documentation for instructions. For example, your system may have an `/etc/ssl/openssl.cnf` file that contains these lines to restrict TLS protocols to TLSv1.3 or higher:

  ```
  [system_default_sect]
  MinProtocol = TLSv1.3
  ```

  Changing the value to a lower protocol version or `None` makes the system more permissive. This workaround has the disadvantage that permitting lower (less secure) protocols may have adverse security consequences.

* If you cannot or prefer not to change the host system TLS configuration, change MySQL applications to use higher (more secure) TLS protocols that are permitted by the host system. This may not be possible for older versions of MySQL that support only lower protocol versions. For example, TLSv1 is the only supported protocol prior to MySQL 5.6.46, so attempts to connect to a pre-5.6.46 server fail even if the client is from a newer MySQL version that supports higher protocol versions. In such cases, an upgrade to a version of MySQL that supports additional TLS versions may be required.

System-wide host configuration :   * If the MySQL configuration permits TLSv1.2, and your host system configuration permits only connections that use TLSv1.2 or higher, you can establish MySQL connections using TLSv1.2 only.

    * Suppose the MySQL configuration permits TLSv1.2, but your host system configuration permits only connections that use TLSv1.3 or higher. If this is the case, you cannot establish MySQL connections at all, because no protocol permitted by MySQL is permitted by the host system.

#### Connection TLS Protocol Configuration

On the server side, the value of the `tls_version` system variable determines which TLS protocols a MySQL server permits for encrypted connections. The `tls_version` value applies to connections from clients, regular source/replica replication connections where this server instance is the source, Group Replication group communication connections, and Group Replication distributed recovery connections where this server instance is the donor. The administrative connection interface is configured similarly, but uses the `admin_tls_version` system variable (see Section 7.1.12.2, “Administrative Connection Management”). This discussion applies to `admin_tls_version` as well.

The `tls_version` value is a list of one or more comma-separated TLS protocol versions, which is not case-sensitive. By default, this variable lists all protocols that are supported by the SSL library used to compile MySQL and by the MySQL Server release. The default settings are therefore as shown in MySQL Server TLS Protocol Default Settings.

To determine the value of `tls_version` at runtime, use this statement:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1.2,TLSv1.3       |
+---------------+-----------------------+
```

To change the value of `tls_version`, set it at server startup. For example, to permit connections that use the TLSv1.2 or TLSv1.3 protocol, but prohibit connections that use any other protocol, use these lines in the server `my.cnf` file:

```
[mysqld]
tls_version=TLSv1.2,TLSv1.3
```

To be even more restrictive and permit only TLSv1.3 connections, set `tls_version` like this:

```
[mysqld]
tls_version=TLSv1.3
```

`tls_version` can be changed at runtime. See Server-Side Runtime Configuration and Monitoring for Encrypted Connections.

On the client side, the `--tls-version` option specifies which TLS protocols a client program permits for connections to the server. The format of the option value is the same as for the `tls_version` system variable described previously (a list of one or more comma-separated protocol versions).

For source/replica replication connections where this server instance is the replica, the `SOURCE_TLS_VERSION` option for the `CHANGE REPLICATION SOURCE TO` statement specifies which TLS protocols the replica permits for connections to the source. The format of the option value is the same as for the `tls_version` system variable described previously. See Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”.

The protocols that can be specified for `SOURCE_TLS_VERSION` depend on the SSL library. This option is independent of and not affected by the server `tls_version` value. For example, a server that acts as a replica can be configured with `tls_version` set to TLSv1.3 to permit only incoming connections that use TLSv1.3, but also configured with `SOURCE_TLS_VERSION` set to TLSv1.2 to permit only TLSv1.2 for outgoing replica connections to the source.

For Group Replication distributed recovery connections where this server instance is the joining member that initiates distributed recovery (that is, the client), the `group_replication_recovery_tls_version` system variable specifies which protocols are permitted by the client. Again, this option is independent of and not affected by the server `tls_version` value, which applies when this server instance is the donor. A Group Replication server generally participates in distributed recovery both as a donor and as a joining member over the course of its group membership, so both these system variables should be set. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”").

TLS protocol configuration affects which protocol a given connection uses, as described in Connection TLS Protocol Negotiation.

Permitted protocols should be chosen such as not to leave “holes” in the list. For example, these server configuration values do not have holes:

```
tls_version=TLSv1.2,TLSv1.3
tls_version=TLSv1.3
```

The prohibition on holes also applies in other configuration contexts, such as for clients or replicas.

Unless you intend to disable encrypted connections, the list of permitted protocols should not be empty. If you set a TLS version parameter to the empty string, encrypted connections cannot be established:

* `tls_version`: The server does not permit encrypted incoming connections.

* `--tls-version`: The client does not permit encrypted outgoing connections to the server.

* `SOURCE_TLS_VERSION`: The replica does not permit encrypted outgoing connections to the source.

* `group_replication_recovery_tls_version`: The joining member does not permit encrypted connections to the distributed recovery connection.

#### Connection Cipher Configuration

A default set of ciphers applies to encrypted connections, which can be overridden by explicitly configuring the permitted ciphers. During connection establishment, both sides of a connection must permit some cipher in common or the connection fails. Of the permitted ciphers common to both sides, the SSL library chooses the one supported by the provided certificate that has the highest priority.

To specify a cipher or ciphers applicable for encrypted connections that use TLSv1.2:

* Set the `ssl_cipher` system variable on the server side, and use the `--ssl-cipher` option for client programs.

* For regular source/replica replication connections, where this server instance is the source, set the `ssl_cipher` system variable. Where this server instance is the replica, use the `SOURCE_SSL_CIPHER` option for the `CHANGE REPLICATION SOURCE TO` statement. See Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”.

* For a Group Replication group member, for Group Replication group communication connections and also for Group Replication distributed recovery connections where this server instance is the donor, set the `ssl_cipher` system variable. For Group Replication distributed recovery connections where this server instance is the joining member, use the `group_replication_recovery_ssl_cipher` system variable. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”").

For encrypted connections that use TLSv1.3, OpenSSL 1.1.1 and higher supports the following ciphersuites, all of which are enabled by default for use with server system variables `--tls-ciphersuites` or `--admin-tls-ciphersuites`:

```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_CCM_SHA256
```

Note

In MySQL 9.5, use of `TLS_AES_128_CCM_8_SHA256` with server system variables `--tls-ciphersuites` or `--admin-tls-ciphersuites` generates a deprecation warning.

To configure the permitted TLSv1.3 ciphersuites explicitly, set the following parameters. In each case, the configuration value is a list of zero or more colon-separated ciphersuite names.

* On the server side, use the `tls_ciphersuites` system variable. If this variable is not set, its default value is `NULL`, which means that the server permits the default set of ciphersuites. If the variable is set to the empty string, no ciphersuites are enabled and encrypted connections cannot be established.

* On the client side, use the `--tls-ciphersuites` option. If this option is not set, the client permits the default set of ciphersuites. If the option is set to the empty string, no ciphersuites are enabled and encrypted connections cannot be established.

* For regular source/replica replication connections, where this server instance is the source, use the `tls_ciphersuites` system variable. Where this server instance is the replica, use the `SOURCE_TLS_CIPHERSUITES` option for the `CHANGE REPLICATION SOURCE TO` statement. See Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”.

* For a Group Replication group member, for Group Replication group communication connections and also for Group Replication distributed recovery connections where this server instance is the donor, use the `tls_ciphersuites` system variable. For Group Replication distributed recovery connections where this server instance is the joining member, use the `group_replication_recovery_tls_ciphersuites` system variable. See Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”").

Ciphersuite support requires that both the MySQL server and the client application be compiled using OpenSSL 1.1.1 or higher.

A given cipher may work only with particular TLS protocols, which affects the TLS protocol negotiation process. See Connection TLS Protocol Negotiation.

To determine which ciphers a given server supports, check the session value of the `Ssl_cipher_list` status variable:

```
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

The `Ssl_cipher_list` status variable lists the possible SSL ciphers (empty for non-SSL connections). If MySQL supports TLSv1.3, the value includes the possible TLSv1.3 ciphersuites.

Note

ECDSA ciphers only work in combination with an SSL certificate that uses ECDSA for the digital signature, and they do not work with certificates that use RSA. MySQL Server’s automatic generation process for SSL certificates does not generate ECDSA signed certificates, it generates only RSA signed certificates. Do not select ECDSA ciphers unless you have an ECDSA certificate available to you.

For encrypted connections that use TLS.v1.3, MySQL uses the SSL library default ciphersuite list.

For encrypted connections that use TLSv1.2, MySQL passes the following default cipher list to the SSL library when used with the server system variables `--ssl-cipher` and `--admin-ssl-cipher`.

```
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-CHACHA20-POLY1305
ECDHE-RSA-CHACHA20-POLY1305
ECDHE-ECDSA-AES256-CCM
ECDHE-ECDSA-AES128-CCM
DHE-RSA-AES128-GCM-SHA256
DHE-RSA-AES256-GCM-SHA384
DHE-RSA-AES256-CCM
DHE-RSA-AES128-CCM
DHE-RSA-CHACHA20-POLY1305
```

These cipher restrictions are in place:

* The following ciphers are deprecated and produce a warning when used with the server system variables `--ssl-cipher` and `--admin-ssl-cipher`:

  ```
  ECDHE-ECDSA-AES128-SHA256
  ECDHE-RSA-AES128-SHA256
  ECDHE-ECDSA-AES256-SHA384
  ECDHE-RSA-AES256-SHA384
  DHE-DSS-AES128-GCM-SHA256
  DHE-RSA-AES128-SHA256
  DHE-DSS-AES128-SHA256
  DHE-DSS-AES256-GCM-SHA384
  DHE-RSA-AES256-SHA256
  DHE-DSS-AES256-SHA256
  ECDHE-RSA-AES128-SHA
  ECDHE-ECDSA-AES128-SHA
  ECDHE-RSA-AES256-SHA
  ECDHE-ECDSA-AES256-SHA
  DHE-DSS-AES128-SHA
  DHE-RSA-AES128-SHA
  TLS_DHE_DSS_WITH_AES_256_CBC_SHA
  DHE-RSA-AES256-SHA
  AES128-GCM-SHA256
  DH-DSS-AES128-GCM-SHA256
  ECDH-ECDSA-AES128-GCM-SHA256
  AES256-GCM-SHA384
  DH-DSS-AES256-GCM-SHA384
  ECDH-ECDSA-AES256-GCM-SHA384
  AES128-SHA256
  DH-DSS-AES128-SHA256
  ECDH-ECDSA-AES128-SHA256
  AES256-SHA256
  DH-DSS-AES256-SHA256
  ECDH-ECDSA-AES256-SHA384
  AES128-SHA
  DH-DSS-AES128-SHA
  ECDH-ECDSA-AES128-SHA
  AES256-SHA
  DH-DSS-AES256-SHA
  ECDH-ECDSA-AES256-SHA
  DH-RSA-AES128-GCM-SHA256
  ECDH-RSA-AES128-GCM-SHA256
  DH-RSA-AES256-GCM-SHA384
  ECDH-RSA-AES256-GCM-SHA384
  DH-RSA-AES128-SHA256
  ECDH-RSA-AES128-SHA256
  DH-RSA-AES256-SHA256
  ECDH-RSA-AES256-SHA384
  ECDHE-RSA-AES128-SHA
  ECDHE-ECDSA-AES128-SHA
  ECDHE-RSA-AES256-SHA
  ECDHE-ECDSA-AES256-SHA
  DHE-DSS-AES128-SHA
  DHE-RSA-AES128-SHA
  TLS_DHE_DSS_WITH_AES_256_CBC_SHA
  DHE-RSA-AES256-SHA
  AES128-SHA
  DH-DSS-AES128-SHA
  ECDH-ECDSA-AES128-SHA
  AES256-SHA
  DH-DSS-AES256-SHA
  ECDH-ECDSA-AES256-SHA
  DH-RSA-AES128-SHA
  ECDH-RSA-AES128-SHA
  DH-RSA-AES256-SHA
  ECDH-RSA-AES256-SHA
  DES-CBC3-SHA
  ```

* The following ciphers are permanently restricted:

  ```
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```

* The following categories of ciphers are permanently restricted:

  ```
  !aNULL
  !eNULL
  !EXPORT
  !LOW
  !MD5
  !DES
  !RC2
  !RC4
  !PSK
  !SSLv3
  ```

If the server is started with the `ssl_cert` system variable set to a certificate that uses any of the preceding restricted ciphers or cipher categories, the server starts with support for encrypted connections disabled.

#### Connection TLS Protocol Negotiation

Connection attempts in MySQL negotiate use of the highest TLS protocol version available on both sides for which a protocol-compatible encryption cipher is available on both sides. The negotiation process depends on factors such as the SSL library used to compile the server and client, the TLS protocol and encryption cipher configuration, and which key size is used:

* For a connection attempt to succeed, the server and client TLS protocol configuration must permit some protocol in common.

* Similarly, the server and client encryption cipher configuration must permit some cipher in common. A given cipher may work only with particular TLS protocols, so a protocol available to the negotiation process is not chosen unless there is also a compatible cipher.

* If TLSv1.3 is available, it is used if possible. (This means that server and client configuration both must permit TLSv1.3, and both must also permit some TLSv1.3-compatible encryption cipher.) Otherwise, MySQL continues through the list of available protocols, using TLSv1.2 if possible, and so forth. Negotiation proceeds from more secure protocols to less secure. Negotiation order is independent of the order in which protocols are configured. For example, negotiation order is the same regardless of whether `tls_version` has a value of `TLSv1.2,TLSv1.3` or `TLSv1.3,TLSv1.2`.

* For better security, use a certificate with an RSA key size of at least 2048 bits.

If the server and client do not have a permitted protocol in common, and a protocol-compatible cipher in common, the server terminates the connection request.

MySQL permits specifying a list of protocols to support. This list is passed directly down to the underlying SSL library and is ultimately up to that library what protocols it actually enables from the supplied list. Please refer to the MySQL source code and the OpenSSL [`SSL_CTX_new()`](https://www.openssl.org/docs/man1.1.0/ssl/SSL_CTX_new.html) documentation for information about how the SSL library handles this.

#### Monitoring Current Client Session TLS Protocol and Cipher

To determine which encryption TLS protocol and cipher the current client session uses, check the session values of the `Ssl_version` and `Ssl_cipher` status variables:

```
mysql> SELECT * FROM performance_schema.session_status
       WHERE VARIABLE_NAME IN ('Ssl_version','Ssl_cipher');
+---------------+---------------------------+
| VARIABLE_NAME | VARIABLE_VALUE            |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
| Ssl_version   | TLSv1.2                   |
+---------------+---------------------------+
```

If the connection is not encrypted, both variables have an empty value.
