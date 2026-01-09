#### 6.4.4.2 Using the keyring_file File-Based Keyring Plugin

The `keyring_file` keyring plugin stores keyring data in a file local to the server host.

Warning

For encryption key management, the `keyring_file` plugin is not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To install `keyring_file`, use the general instructions found in [Section 6.4.4.1, “Keyring Plugin Installation”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation"), together with the configuration information specific to `keyring_file` found here.

To be usable during the server startup process, `keyring_file` must be loaded using the [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option. The [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) system variable optionally configures the location of the file used by the `keyring_file` plugin for data storage. The default value is platform specific. To configure the file location explicitly, set the variable value at startup. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file location for your platform as necessary:

```sql
[mysqld]
early-plugin-load=keyring_file.so
keyring_file_data=/usr/local/mysql/mysql-keyring/keyring
```

If [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) is set to a new location, the keyring plugin creates a new, empty file containing no keys; this means that any existing encrypted tables can no longer be accessed.

Keyring operations are transactional: The `keyring_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) system variable with a suffix of `.backup`.

For additional information about [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data), see [Section 6.4.4.12, “Keyring System Variables”](keyring-system-variables.html "6.4.4.12 Keyring System Variables").

As of MySQL 5.7.17, to ensure that keys are flushed only when the correct keyring storage file exists, `keyring_file` stores a SHA-256 checksum of the keyring in the file. Before updating the file, the plugin verifies that it contains the expected checksum.

The `keyring_file` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

* C interface: In C-language code, call the keyring service functions described in [Section 5.5.6.2, “The Keyring Service”](keyring-service.html "5.5.6.2 The Keyring Service").

Example (using the SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_file`, see [Section 6.4.4.6, “Supported Keyring Key Types and Lengths”](keyring-key-types.html "6.4.4.6 Supported Keyring Key Types and Lengths").
