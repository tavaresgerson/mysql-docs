### 6.3.2 Encrypted Connection TLS Protocols and Ciphers

MySQL supports multiple TLS protocols and ciphers, and enables configuring which protocols and ciphers to permit for encrypted connections. It is also possible to determine which protocol and cipher the current session uses.

* [Supported Connection TLS Protocols](encrypted-connection-protocols-ciphers.html#encrypted-connection-supported-protocols "Supported Connection TLS Protocols")
* [Connection TLS Protocol Configuration](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-configuration "Connection TLS Protocol Configuration")
* [Deprecated TLS Protocols](encrypted-connection-protocols-ciphers.html#encrypted-connection-deprecated-protocols "Deprecated TLS Protocols")
* [Connection Cipher Configuration](encrypted-connection-protocols-ciphers.html#encrypted-connection-cipher-configuration "Connection Cipher Configuration")
* [Connection TLS Protocol Negotiation](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation")
* [Monitoring Current Client Session TLS Protocol and Cipher](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-monitoring "Monitoring Current Client Session TLS Protocol and Cipher")

#### Supported Connection TLS Protocols

MySQL supports encrypted connections using the TLSv1, TLSv1.1, and TLSv1.2 protocols, listed in order from less secure to more secure. The set of protocols actually permitted for connections is subject to multiple factors:

* MySQL configuration. Permitted TLS protocols can be configured on both the server side and client side to include only a subset of the supported TLS protocols. The configuration on both sides must include at least one protocol in common or connection attempts cannot negotiate a protocol to use. For details, see [Connection TLS Protocol Negotiation](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation").

* System-wide host configuration. The host system may permit only certain TLS protocols, which means that MySQL connections cannot use nonpermitted protocols even if MySQL itself permits them:

  + Suppose that MySQL configuration permits TLSv1, TLSv1.1, and TLSv1.2, but your host system configuration permits only connections that use TLSv1.2 or higher. In this case, you cannot establish MySQL connections that use TLSv1 or TLSv1.1, even though MySQL is configured to permit them, because the host system does not permit them.

  + If MySQL configuration permits TLSv1, TLSv1.1, and TLSv1.2, but your host system configuration permits only connections that use TLSv1.3 or higher, you cannot establish MySQL connections at all, because no protocol permitted by MySQL is permitted by the host system.

  Workarounds for this issue include:

  + Change the system-wide host configuration to permit additional TLS protocols. Consult your operating system documentation for instructions. For example, your system may have an `/etc/ssl/openssl.cnf` file that contains these lines to restrict TLS protocols to TLSv1.2 or higher:

    ```sql
    [system_default_sect]
    MinProtocol = TLSv1.2
    ```

    Changing the value to a lower protocol version or `None` makes the system more permissive. This workaround has the disadvantage that permitting lower (less secure) protocols may have adverse security consequences.

  + If you cannot or prefer not to change the host system TLS configuration, change MySQL applications to use higher (more secure) TLS protocols that are permitted by the host system. This may not be possible for older versions of MySQL that support only lower protocol versions. For example, TLSv1 is the only supported protocol prior to MySQL 5.6.46, so attempts to connect to a pre-5.6.46 server fail even if the client is from a newer MySQL version that supports higher protocol versions. In such cases, an upgrade to a version of MySQL that supports additional TLS versions may be required.

* The SSL library. If the SSL library does not support a particular protocol, neither does MySQL, and any parts of the following discussion that specify that protocol do not apply.

  + When compiled using OpenSSL 1.0.1 or higher, MySQL supports the TLSv1, TLSv1.1, and TLSv1.2 protocols.

  + When compiled using yaSSL, MySQL supports the TLSv1 and TLSv1.1 protocols.

  Note

  It is possible to compile MySQL using yaSSL as an alternative to OpenSSL only prior to MySQL 5.7.28. As of MySQL 5.7.28, support for yaSSL is removed and all MySQL builds use OpenSSL.

#### Connection TLS Protocol Configuration

On the server side, the value of the [`tls_version`](server-system-variables.html#sysvar_tls_version) system variable determines which TLS protocols a MySQL server permits for encrypted connections. The [`tls_version`](server-system-variables.html#sysvar_tls_version) value applies to connections from clients and from replica servers using regular source/replica replication. The variable value is a list of one or more comma-separated protocol versions from this list (not case-sensitive): TLSv1, TLSv1.1, TLSv1.2. By default, this variable lists all protocols supported by the SSL library used to compile MySQL (`TLSv1,TLSv1.1,TLSv1.2` for OpenSSL, `TLSv1,TLSv1.1` for yaSSL). To determine the value of [`tls_version`](server-system-variables.html#sysvar_tls_version) at runtime, use this statement:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1,TLSv1.1,TLSv1.2 |
+---------------+-----------------------+
```

To change the value of [`tls_version`](server-system-variables.html#sysvar_tls_version), set it at server startup. For example, to permit connections that use the TLSv1.1 or TLSv1.2 protocol, but prohibit connections that use the less-secure TLSv1 protocol, use these lines in the server `my.cnf` file:

```sql
[mysqld]
tls_version=TLSv1.1,TLSv1.2
```

To be even more restrictive and permit only TLSv1.2 connections, set [`tls_version`](server-system-variables.html#sysvar_tls_version) like this (assuming that your server is compiled using OpenSSL because yaSSL does not support TLSv1.2):

```sql
[mysqld]
tls_version=TLSv1.2
```

Note

As of MySQL 5.7.35, the TLSv1 and TLSv1.1 connection protocols are deprecated and support for them is subject to removal in a future version of MySQL. See [Deprecated TLS Protocols](encrypted-connection-protocols-ciphers.html#encrypted-connection-deprecated-protocols "Deprecated TLS Protocols").

On the client side, the [`--tls-version`](connection-options.html#option_general_tls-version) option specifies which TLS protocols a client program permits for connections to the server. The format of the option value is the same as for the [`tls_version`](server-system-variables.html#sysvar_tls_version) system variable described previously (a list of one or more comma-separated protocol versions).

For source/replica replication, the `MASTER_TLS_VERSION` option for the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement specifies which TLS protocols a replica server permits for connections to the source. The format of the option value is the same as for the [`tls_version`](server-system-variables.html#sysvar_tls_version) system variable described previously. See [Section 16.3.8, “Setting Up Replication to Use Encrypted Connections”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

The protocols that can be specified for `MASTER_TLS_VERSION` depend on the SSL library. This option is independent of and not affected by the server [`tls_version`](server-system-variables.html#sysvar_tls_version) value. For example, a server that acts as a replica can be configured with [`tls_version`](server-system-variables.html#sysvar_tls_version) set to TLSv1.2 to permit only incoming connections that use TLSv1.2, but also configured with `MASTER_TLS_VERSION` set to TLSv1.1 to permit only TLSv1.1 for outgoing replica connections to the source.

TLS protocol configuration affects which protocol a given connection uses, as described in [Connection TLS Protocol Negotiation](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation").

Permitted protocols should be chosen such as not to leave “holes” in the list. For example, these server configuration values do not have holes:

```sql
tls_version=TLSv1,TLSv1.1,TLSv1.2
tls_version=TLSv1.1,TLSv1.2
tls_version=TLSv1.2
```

This value does have a hole and should not be used:

```sql
tls_version=TLSv1,TLSv1.2       (TLSv1.1 is missing)
```

The prohibition on holes also applies in other configuration contexts, such as for clients or replicas.

Unless you intend to disable encrypted connections, the list of permitted protocols should not be empty. If you set a TLS version parameter to the empty string, encrypted connections cannot be established:

* [`tls_version`](server-system-variables.html#sysvar_tls_version): The server does not permit encrypted incoming connections.

* [`--tls-version`](connection-options.html#option_general_tls-version): The client does not permit encrypted outgoing connections to the server.

* `MASTER_TLS_VERSION`: The replica does not permit encrypted outgoing connections to the source.

#### Deprecated TLS Protocols

As of MySQL 5.7.35, the TLSv1 and TLSv1.1 connection protocols are deprecated and support for them is subject to removal in a future MySQL version. (For background, refer to the IETF memo [Deprecating TLSv1.0 and TLSv1.1](https://tools.ietf.org/id/draft-ietf-tls-oldversions-deprecate-02.html).) It is recommended that connections be made using the more-secure TLSv1.2 and TLSv1.3 protocols. TLSv1.3 requires that both the MySQL server and the client application be compiled with OpenSSL 1.1.1 or higher.

On the server side, this deprecation has the following effects:

* If the [`tls_version`](server-system-variables.html#sysvar_tls_version) system variable is assigned a value containing a deprecated TLS protocol during server startup, the server writes a warning for each deprecated protocol to the error log.

* If a client successfully connects using a deprecated TLS protocol, the server writes a warning to the error log.

On the client side, the deprecation has no visible effect. Clients do not issue a warning if configured to permit a deprecated TLS protocol. This includes:

* Client programs that support a [`--tls-version`](connection-options.html#option_general_tls-version) option for specifying TLS protocols for connections to the MySQL server.

* Statements that enable replicas to specify TLS protocols for connections to the source server. ([`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") has a `MASTER_TLS_VERSION` option.)

#### Connection Cipher Configuration

A default set of ciphers applies to encrypted connections, which can be overridden by explicitly configuring the permitted ciphers. During connection establishment, both sides of a connection must permit some cipher in common or the connection fails. Of the permitted ciphers common to both sides, the SSL library chooses the one supported by the provided certificate that has the highest priority.

To specify a cipher or ciphers for encrypted connections, set the [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher) system variable on the server side, and use the [`--ssl-cipher`](connection-options.html#option_general_ssl-cipher) option for client programs.

For source/replica replication connections, where this server instance is the source, set the [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher) system variable. Where this server instance is the replica, use the `MASTER_SSL_CIPHER` option for the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement. See [Section 16.3.8, “Setting Up Replication to Use Encrypted Connections”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

A given cipher may work only with particular TLS protocols, which affects the TLS protocol negotiation process. See [Connection TLS Protocol Negotiation](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation").

To determine which ciphers a given server supports, check the session value of the [`Ssl_cipher_list`](server-status-variables.html#statvar_Ssl_cipher_list) status variable:

```sql
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

The [`Ssl_cipher_list`](server-status-variables.html#statvar_Ssl_cipher_list) status variable lists the possible SSL ciphers (empty for non-SSL connections). The set of available ciphers depends on your MySQL version and whether MySQL was compiled using OpenSSL or yaSSL, and (for OpenSSL) the library version used to compile MySQL.

Note

ECDSA ciphers only work in combination with an SSL certificate that uses ECDSA for the digital signature, and they do not work with certificates that use RSA. MySQL Server’s automatic generation process for SSL certificates does not generate ECDSA signed certificates, it generates only RSA signed certificates. Do not select ECDSA ciphers unless you have an ECDSA certificate available to you.

MySQL passes a default cipher list to the SSL library.

MySQL passes this default cipher list to OpenSSL:

```sql
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES128-SHA256
ECDHE-RSA-AES128-SHA256
ECDHE-ECDSA-AES256-SHA384
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES128-GCM-SHA256
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
DHE-RSA-AES256-GCM-SHA384
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

MySQL passes this default cipher list to yaSSL:

```sql
DHE-RSA-AES256-SHA
DHE-RSA-AES128-SHA
AES128-RMD
DES-CBC3-RMD
DHE-RSA-AES256-RMD
DHE-RSA-AES128-RMD
DHE-RSA-DES-CBC3-RMD
AES256-SHA
RC4-SHA
RC4-MD5
DES-CBC3-SHA
DES-CBC-SHA
EDH-RSA-DES-CBC3-SHA
EDH-RSA-DES-CBC-SHA
AES128-SHA:AES256-RMD
```

As of MySQL 5.7.10, these cipher restrictions are in place:

* The following ciphers are permanently restricted:

  ```sql
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```

* The following categories of ciphers are permanently restricted:

  ```sql
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

If the server is started with the [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert) system variable set to a certificate that uses any of the preceding restricted ciphers or cipher categories, the server starts with support for encrypted connections disabled.

#### Connection TLS Protocol Negotiation

Connection attempts in MySQL negotiate use of the highest TLS protocol version available on both sides for which a protocol-compatible encryption cipher is available on both sides. The negotiation process depends on factors such as the SSL library used to compile the server and client, the TLS protocol and encryption cipher configuration, and which key size is used:

* For a connection attempt to succeed, the server and client TLS protocol configuration must permit some protocol in common.

* Similarly, the server and client encryption cipher configuration must permit some cipher in common. A given cipher may work only with particular TLS protocols, so a protocol available to the negotiation process is not chosen unless there is also a compatible cipher.

* If the server and client are compiled using OpenSSL, TLSv1.2 is used if possible. If either or both the server and client are compiled using yaSSL, TLSv1.1 is used if possible. (“Possible” means that server and client configuration both must permit the indicated protocol, and both must also permit some protocol-compatible encryption cipher.) Otherwise, MySQL continues through the list of available protocols, proceeding from more secure protocols to less secure. Negotiation order is independent of the order in which protocols are configured. For example, negotiation order is the same regardless of whether [`tls_version`](server-system-variables.html#sysvar_tls_version) has a value of `TLSv1,TLSv1.1,TLSv1.2` or `TLSv1.2,TLSv1.1,TLSv1`.

  Note

  Prior to MySQL 5.7.10, MySQL supports only TLSv1, for both OpenSSL and yaSSL, and no system variable or client option exist for specifying which TLS protocols to permit.

* TLSv1.2 does not work with all ciphers that have a key size of 512 bits or less. To use this protocol with such a key, set the [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher) system variable on the server side or use the [`--ssl-cipher`](connection-options.html#option_general_ssl-cipher) client option to specify the cipher name explicitly:

  ```sql
  AES128-SHA
  AES128-SHA256
  AES256-SHA
  AES256-SHA256
  CAMELLIA128-SHA
  CAMELLIA256-SHA
  DES-CBC3-SHA
  DHE-RSA-AES256-SHA
  RC4-MD5
  RC4-SHA
  SEED-SHA
  ```

* For better security, use a certificate with an RSA key size of at least 2048 bits.

If the server and client do not have a permitted protocol in common, and a protocol-compatible cipher in common, the server terminates the connection request. Examples:

* If the server is configured with [`tls_version=TLSv1.1,TLSv1.2`](server-system-variables.html#sysvar_tls_version):

  + Connection attempts fail for clients invoked with [`--tls-version=TLSv1`](connection-options.html#option_general_tls-version), and for older clients that support only TLSv1.

  + Similarly, connection attempts fail for replicas configured with `MASTER_TLS_VERSION = 'TLSv1'`, and for older replicas that support only TLSv1.

* If the server is configured with [`tls_version=TLSv1`](server-system-variables.html#sysvar_tls_version) or is an older server that supports only TLSv1:

  + Connection attempts fail for clients invoked with [`--tls-version=TLSv1.1,TLSv1.2`](connection-options.html#option_general_tls-version).

  + Similarly, connection attempts fail for replicas configured with `MASTER_TLS_VERSION = 'TLSv1.1,TLSv1.2'`.

MySQL permits specifying a list of protocols to support. This list is passed directly down to the underlying SSL library and is ultimately up to that library what protocols it actually enables from the supplied list. Please refer to the MySQL source code and the OpenSSL [`SSL_CTX_new()`](https://www.openssl.org/docs/man1.1.0/ssl/SSL_CTX_new.html) documentation for information about how the SSL library handles this.

#### Monitoring Current Client Session TLS Protocol and Cipher

To determine which encryption TLS protocol and cipher the current client session uses, check the session values of the [`Ssl_version`](server-status-variables.html#statvar_Ssl_version) and [`Ssl_cipher`](server-status-variables.html#statvar_Ssl_cipher) status variables:

```sql
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
