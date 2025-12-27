### 6.3.4 SSL Library-Dependent Capabilities

MySQL can be compiled using OpenSSL or yaSSL, both of which enable encrypted connections based on the OpenSSL API:

* MySQL Enterprise Edition binary distributions are compiled using OpenSSL. It is not possible to use yaSSL with MySQL Enterprise Edition.

* MySQL Community Edition binary distributions are compiled using yaSSL.

* MySQL Community Edition source distributions can be compiled using either OpenSSL or yaSSL (see [Section 2.8.6, “Configuring SSL Library Support”](source-ssl-library-configuration.html "2.8.6 Configuring SSL Library Support")).

Note

It is possible to compile MySQL using yaSSL as an alternative to OpenSSL only prior to MySQL 5.7.28. As of MySQL 5.7.28, support for yaSSL is removed and all MySQL builds use OpenSSL.

OpenSSL and yaSSL offer the same basic functionality, but MySQL distributions compiled using OpenSSL have additional features:

* OpenSSL supports TLSv1, TLSv1.1, and TLSv1.2 protocols. yaSSL supports only TLSv1 and TLSv1.1 protocols.

* OpenSSL supports a more flexible syntax for specifying ciphers (for the [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher) system variable and [`--ssl-cipher`](connection-options.html#option_general_ssl-cipher) client option), and supports a wider range of encryption ciphers from which to choose. See [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"), and [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

* OpenSSL supports the [`ssl_capath`](server-system-variables.html#sysvar_ssl_capath) system variable and [`--ssl-capath`](connection-options.html#option_general_ssl-capath) client option. MySQL distributions compiled using yaSSL do not because yaSSL does not look in any directory and do not follow a chained certificate tree. yaSSL requires that all components of the CA certificate tree be contained within a single CA certificate tree and that each certificate in the file has a unique SubjectName value. To work around this limitation, concatenate the individual certificate files comprising the certificate tree into a new file and specify that file as the value of the [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca) system variable and [`--ssl-ca`](connection-options.html#option_general_ssl-ca) option.

* OpenSSL supports certificate revocation-list capability (for the [`ssl_crl`](server-system-variables.html#sysvar_ssl_crl) and [`ssl_crlpath`](server-system-variables.html#sysvar_ssl_crlpath) system variables and [`--ssl-crl`](connection-options.html#option_general_ssl-crl) and [`--ssl-crlpath`](connection-options.html#option_general_ssl-crlpath) client options). Distributions compiled using yaSSL do not because revocation lists do not work with yaSSL. (yaSSL accepts these options but silently ignores them.)

* Accounts that authenticate using the `sha256_password` plugin can use RSA key files for secure password exchange over unencrypted connections. See [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

* The server can automatically generate missing SSL and RSA certificate and key files at startup. See [Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL").

* OpenSSL supports more encryption modes for the [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt) functions. See [Section 12.13, “Encryption and Compression Functions”](encryption-functions.html "12.13 Encryption and Compression Functions")

Certain OpenSSL-related system and status variables are present only if MySQL was compiled using OpenSSL:

* [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs)
* [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys)
* [`sha256_password_private_key_path`](server-system-variables.html#sysvar_sha256_password_private_key_path)
* [`sha256_password_public_key_path`](server-system-variables.html#sysvar_sha256_password_public_key_path)
* [`Rsa_public_key`](server-status-variables.html#statvar_Rsa_public_key)

To determine whether a server was compiled using OpenSSL, test the existence of any of those variables. For example, this statement returns a row if OpenSSL was used and an empty result if yaSSL was used:

```sql
SHOW STATUS LIKE 'Rsa_public_key';
```
