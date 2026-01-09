### 8.4.4 The MySQL Keyring


MySQL Server supports a keyring that enables internal server components and plugins to securely store sensitive information for later retrieval. The implementation comprises these elements:

* Keyring components and plugins that manage a backing store or communicate with a storage back end. Keyring use involves installing one from among the available components and plugins. Keyring components and plugins both manage keyring data but are configured differently and may have operational differences (see Section 8.4.4.1, “Keyring Components Versus Keyring Plugins”).

  These keyring components are available:

  + `component_keyring_file`: Stores keyring data in a file local to the server host. Available in MySQL Community Edition and MySQL Enterprise Edition distributions. See Section 8.4.4.4, “Using the component_keyring_file File-Based Keyring Component”.
  + `component_keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host. Available in MySQL Enterprise Edition distributions. See Section 8.4.4.5, “Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component”.
  + `component_keyring_oci`: Stores keyring data in the Oracle Cloud Infrastructure Vault. Available in MySQL Enterprise Edition distributions. See  Section 8.4.4.9, “Using the Oracle Cloud Infrastructure Vault Keyring Component”.

  These keyring plugins are available:

  + `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products such as Oracle Key Vault and Gemalto SafeNet KeySecure Appliance. Available in MySQL Enterprise Edition distributions. See Section 8.4.4.6, “Using the keyring_okv KMIP Plugin”.
  + `keyring_aws`: Communicates with the Amazon Web Services Key Management Service for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions. See Section 8.4.4.7, “Using the keyring_aws Amazon Web Services Keyring Plugin”.
  + `keyring_hashicorp`: Communicates with HashiCorp Vault for back end storage. Available in MySQL Enterprise Edition distributions. See Section 8.4.4.8, “Using the HashiCorp Vault Keyring Plugin”.
* A keyring service interface for keyring key management. This service is accessible at two levels:

  + SQL interface: In SQL statements, call the functions described in Section 8.4.4.12, “General-Purpose Keyring Key-Management Functions”.
  + C interface: In C-language code, call the keyring service functions described in  Section 7.6.9.2, “The Keyring Service”.
* Key metadata access:

  + The Performance Schema `keyring_keys` table exposes metadata for keys in the keyring. Key metadata includes key IDs, key owners, and backend key IDs. The `keyring_keys` table does not expose any sensitive keyring data such as key contents. See Section 29.12.18.2, “The keyring_keys table”.
  + The Performance Schema `keyring_component_status` table provides status information about the keyring component in use, if one is installed. See Section 29.12.18.1, “The keyring_component_status Table”.
* A key migration capability. MySQL supports migration of keys between keystores, enabling DBAs to switch a MySQL installation from one keystore to another. See Section 8.4.4.11, “Migrating Keys Between Keyring Keystores”.
* The implementation of keyring plugins is revised to use the component infrastructure. This is facilitated using the built-in plugin named `daemon_keyring_proxy_plugin` that acts as a bridge between the plugin and component service APIs. See Section 7.6.8, “The Keyring Proxy Bridge Plugin”. Warning

For encryption key management, the `component_keyring_file` and `component_keyring_encrypted_file` components are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

Within MySQL, keyring service consumers include:

* The `InnoDB` storage engine uses the keyring to store its key for tablespace encryption. See Section 17.13, “InnoDB Data-at-Rest Encryption”.
* MySQL Enterprise Audit uses the keyring to store the audit log file encryption password. See Encrypting Audit Log Files.
* Binary log and relay log management supports keyring-based encryption of log files. With log file encryption activated, the keyring stores the keys used to encrypt passwords for the binary log files and relay log files. See Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.
* The master key to decrypt the file key that decrypts the persisted values of sensitive system variables is stored in the keyring. A keyring component must be enabled on the MySQL Server instance to support secure storage for persisted system variable values, rather than a keyring plugin, which do not support the function. See Persisting Sensitive System Variables.

For general keyring installation instructions, see Section 8.4.4.2, “Keyring Component Installation”, and Section 8.4.4.3, “Keyring Plugin Installation”. For installation and configuration information specific to a given keyring component or plugin, see the section describing it.

For information about using the keyring functions, see Section 8.4.4.12, “General-Purpose Keyring Key-Management Functions”.

Keyring components, plugins, and functions access a keyring service that provides the interface to the keyring. For information about accessing this service and writing keyring plugins, see  Section 7.6.9.2, “The Keyring Service”, and Writing Keyring Plugins.
