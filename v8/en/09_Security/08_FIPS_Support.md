## 8.8 FIPS Support

MySQL supports FIPS mode when a supported OpenSSL library and FIPS Object Module are available on the host system.

FIPS mode on the server side applies to cryptographic operations performed by the server. This includes replication (source/replica and Group Replication) and X Plugin, which run within the server. FIPS mode also applies to attempts by clients to connect to the server.

The following sections describe FIPS mode and how to take advantage of it within MySQL:

* FIPS Overview
* System Requirements for FIPS Mode in MySQL
* Enabling FIPS Mode in MySQL

### FIPS Overview

Federal Information Processing Standards 140-2 (FIPS 140-2) describes a security standard that can be required by Federal (US Government) agencies for cryptographic modules used to protect sensitive or valuable information. To be considered acceptable for such Federal use, a cryptographic module must be certified for FIPS 140-2. If a system intended to protect sensitive data lacks the proper FIPS 140-2 certificate, Federal agencies cannot purchase it.

Products such as OpenSSL can be used in FIPS mode, although the OpenSSL library itself is not validated for FIPS. Instead, the OpenSSL library is used with the OpenSSL FIPS Object Module to enable OpenSSL-based applications to operate in FIPS mode.

For general information about FIPS and its implementation in OpenSSL, these references may be helpful:

* National Institute of Standards and Technology FIPS PUB 140-2

* OpenSSL FIPS 140-2 Security Policy

* fips_module manual page

Important

FIPS mode imposes conditions on cryptographic operations such as restrictions on acceptable encryption algorithms or requirements for longer key lengths. For OpenSSL, the exact FIPS behavior depends on the OpenSSL version.

### System Requirements for FIPS Mode in MySQL

For MySQL to support FIPS mode, these system requirements must be satisfied:

1. MySQL must be compiled with an OpenSSL version that is certified for use with FIPS. OpenSSL 1.0.2 and OpenSSL 3.0 are certified, but OpenSSL 1.1.1 is not. Binary distributions for recent versions of MySQL are compiled using OpenSSL 3.0 on some platforms, which means they are not certified for FIPS. This means you have the following options, depending on system and MySQL configuration:

   * Use a system that has OpenSSL 3.0 and the required FIPS object module. In this case, you can enable FIPS mode for MySQL if you use a binary distribution compiled using OpenSSL 3.0, or compile MySQL from source using OpenSSL 3.0.

     For general information about upgrading to OpenSSL 3.0, see OpenSSL 3.0 Migration Guide.

   * Use a system that has OpenSSL 1.1.1 or higher. In this case, you can install MySQL using binary packages, and you can use the TLS v1.3 protocol and ciphersuites, in addition to other already supported TLS protocols. However, you cannot enable FIPS mode for MySQL.

   * Use a system that has OpenSSL 1.0.2 and the required FIPS Object Module. In this case, you can enable FIPS mode for MySQL if you use a binary distribution compiled using OpenSSL 1.0.2, or compile MySQL from source using OpenSSL 1.0.2. In this case, you cannot use the TLS v1.3 protocol or ciphersuites, which require OpenSSL 1.1.1 or 3.0. In addition, you should be aware that OpenSSL 1.0.2 reached end of life status in 2019, and that all operating platforms embedding OpenSSL 1.1.1 reach their end of life in 2024.

2. At runtime, the OpenSSL library and OpenSSL FIPS Object Module must be available as shared (dynamically linked) objects.

### Enabling FIPS Mode in MySQL

Note

In MySQL 8.0.34 and later, the server-side and client-side configuration described at the end of this section is no longer required.

To determine whether MySQL is running on a system with FIPS mode enabled, check the value of the `ssl_fips_mode` server system variable using an SQL statement such as `SHOW VARIABLES LIKE '%fips%'` or `SELECT @@ssl_fips_mode`. If the value of this variable is 1 (`ON`) or 2 (`STRICT`), FIPS mode is enabled for OpenSSL; if it is 0 (`OFF`), FIPS mode is not available.

Important

In general, `STRICT` imposes more restrictions than `ON`, but MySQL itself has no FIPS-specific code other than to specify the FIPS mode value to OpenSSL. The exact behavior of FIPS mode for `ON` or `STRICT` depends on the OpenSSL version. For details, refer to the `fips_module` manpage (see FIPS Overview).

FIPS mode on the server side applies to cryptographic operations performed by the server, including those performed by MySQL Replication (including Group Replication) and X Plugin, which run within the server.

FIPS mode also applies to attempts by clients to connect to the server. When enabled, on either the client or server side, it restricts which of the supported encryption ciphers can be chosen. However, enabling FIPS mode does not require that an encrypted connection must be used, or that user credentials must be encrypted. For example, if FIPS mode is enabled, stronger cryptographic algorithms are required. In particular, MD5 is restricted, so trying to establish an encrypted connection using an encryption cipher such as `RC4-MD5` does not work. But there is nothing about FIPS mode that prevents establishing an unencrypted connection. (To do that, you can use the `REQUIRE` clause for `CREATE USER` or `ALTER USER` for specific user accounts, or set the `require_secure_transport` system variable to affect all accounts.)

If FIPS mode is required, it is recommended to use an operating platform that includes it; if it does, you can (and should) use it. If your platform does not include FIPS, you have two options:

* Migrate to a platform which has FIPS OpenSSL support.
* Build the OpenSSL library and FIPS object module from source, using the instructions from the `fips_module` manpage (see FIPS Overview).

**MySQL 8.0.34 and earlier**: Control of FIPS mode on the server side and the client side was accomplished using the system variables listed here:

* The `ssl_fips_mode` system variable controls whether the server operates in FIPS mode.

* The `--ssl-fips-mode` client option controls whether a given MySQL client operates in FIPS mode.

The `ssl_fips_mode` system variable and `--ssl-fips-mode` client option permit these values:

* `OFF`: Disable FIPS mode.
* `ON`: Enable FIPS mode.
* `STRICT`: Enable “strict” FIPS mode.

Note

If the OpenSSL FIPS Object Module is not available, the only permitted value for `ssl_fips_mode` and `--ssl-fips-mode` is `OFF`. An error occurs for attempts to set the FIPS mode to a different value.
