### 6.4.4 The MySQL Keyring

[6.4.4.1 Keyring Plugin Installation](keyring-plugin-installation.html)

[6.4.4.2 Using the keyring\_file File-Based Keyring Plugin](keyring-file-plugin.html)

[6.4.4.3 Using the keyring\_encrypted\_file Encrypted File-Based Keyring Plugin](keyring-encrypted-file-plugin.html)

[6.4.4.4 Using the keyring\_okv KMIP Plugin](keyring-okv-plugin.html)

[6.4.4.5 Using the keyring\_aws Amazon Web Services Keyring Plugin](keyring-aws-plugin.html)

[6.4.4.6 Supported Keyring Key Types and Lengths](keyring-key-types.html)

[6.4.4.7 Migrating Keys Between Keyring Keystores](keyring-key-migration.html)

[6.4.4.8 General-Purpose Keyring Key-Management Functions](keyring-functions-general-purpose.html)

[6.4.4.9 Plugin-Specific Keyring Key-Management Functions](keyring-functions-plugin-specific.html)

[6.4.4.10 Keyring Metadata](keyring-metadata.html)

[6.4.4.11 Keyring Command Options](keyring-options.html)

[6.4.4.12 Keyring System Variables](keyring-system-variables.html)

MySQL Server supports a keyring that enables internal server components and plugins to securely store sensitive information for later retrieval. The implementation comprises these elements:

* Keyring plugins that manage a backing store or communicate with a storage back end. These keyring plugins are available:

  + `keyring_file`: Stores keyring data in a file local to the server host. Available in MySQL Community Edition and MySQL Enterprise Edition distributions as of MySQL 5.7.11. See [Section 6.4.4.2, “Using the keyring\_file File-Based Keyring Plugin”](keyring-file-plugin.html "6.4.4.2 Using the keyring_file File-Based Keyring Plugin").

  + `keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host. Available in MySQL Enterprise Edition distributions as of MySQL 5.7.21. See [Section 6.4.4.3, “Using the keyring\_encrypted\_file Encrypted File-Based Keyring Plugin”](keyring-encrypted-file-plugin.html "6.4.4.3 Using the keyring_encrypted_file Encrypted File-Based Keyring Plugin").

  + `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products such as Oracle Key Vault and Gemalto SafeNet KeySecure Appliance. Available in MySQL Enterprise Edition distributions as of MySQL 5.7.12. See [Section 6.4.4.4, “Using the keyring\_okv KMIP Plugin”](keyring-okv-plugin.html "6.4.4.4 Using the keyring_okv KMIP Plugin").

  + `keyring_aws`: Communicates with the Amazon Web Services Key Management Service for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions as of MySQL 5.7.19. See [Section 6.4.4.5, “Using the keyring\_aws Amazon Web Services Keyring Plugin”](keyring-aws-plugin.html "6.4.4.5 Using the keyring_aws Amazon Web Services Keyring Plugin").

* A keyring service interface for keyring key management (MySQL 5.7.13 and higher). This service is accessible at two levels:

  + SQL interface: In SQL statements, call the functions described in [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

  + C interface: In C-language code, call the keyring service functions described in [Section 5.5.6.2, “The Keyring Service”](keyring-service.html "5.5.6.2 The Keyring Service").

* A key migration capability. MySQL 5.7.21 and higher supports migration of keys between keystores, enabling DBAs to switch a MySQL installation from one keystore to another. See [Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrating Keys Between Keyring Keystores").

Warning

For encryption key management, the `keyring_file` and `keyring_encrypted_file` plugins are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

Within MySQL, keyring service consumers include:

* The `InnoDB` storage engine uses the keyring to store its key for tablespace encryption. See [Section 14.14, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption").

* MySQL Enterprise Audit uses the keyring to store the audit log file encryption password. See [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

For general keyring installation instructions, see [Section 6.4.4.1, “Keyring Plugin Installation”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation"). For installation and configuration information specific to a given keyring plugin, see the section describing that plugin.

For information about using the keyring functions, see [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

Keyring plugins and functions access a keyring service that provides the interface to the keyring. For information about accessing this service and writing keyring plugins, see [Section 5.5.6.2, “The Keyring Service”](keyring-service.html "5.5.6.2 The Keyring Service"), and [Writing Keyring Plugins](/doc/extending-mysql/5.7/en/writing-keyring-plugins.html).
