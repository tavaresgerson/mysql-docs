#### 6.4.4.3 Using the keyring\_encrypted\_file Encrypted File-Based Keyring Plugin

Note

The `keyring_encrypted_file` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `keyring_encrypted_file` keyring plugin stores keyring data in an encrypted, password-protected file local to the server host. A password must be specified for the file. This plugin is available as of MySQL 5.7.21.

Warning

For encryption key management, the `keyring_encrypted_file` plugin is not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To install `keyring_encrypted_file`, use the general instructions found in [Section 6.4.4.1, “Keyring Plugin Installation”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation"), together with the configuration information specific to `keyring_encrypted_file` found here.

To be usable during the server startup process, `keyring_encrypted_file` must be loaded using the [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option. To specify the password for encrypting the keyring data file, set the [`keyring_encrypted_file_password`](keyring-system-variables.html#sysvar_keyring_encrypted_file_password) system variable. (The password is mandatory; if not specified at server startup, `keyring_encrypted_file` initialization fails.) The [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) system variable optionally configures the location of the file used by the `keyring_encrypted_file` plugin for data storage. The default value is platform specific. To configure the file location explicitly, set the variable value at startup. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file location for your platform as necessary and substituting your chosen password:

```sql
[mysqld]
early-plugin-load=keyring_encrypted_file.so
keyring_encrypted_file_data=/usr/local/mysql/mysql-keyring/keyring-encrypted
keyring_encrypted_file_password=password
```

Because the `my.cnf` file stores a password when written as shown, it should have a restrictive mode and be accessible only to the account used to run the MySQL server.

Keyring operations are transactional: The `keyring_encrypted_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) system variable with a suffix of `.backup`.

For additional information about the system variables used to configure the `keyring_encrypted_file` plugin, see [Section 6.4.4.12, “Keyring System Variables”](keyring-system-variables.html "6.4.4.12 Keyring System Variables").

To ensure that keys are flushed only when the correct keyring storage file exists, `keyring_encrypted_file` stores a SHA-256 checksum of the keyring in the file. Before updating the file, the plugin verifies that it contains the expected checksum. In addition, `keyring_encrypted_file` encrypts file contents using AES before writing the file, and decrypts file contents after reading the file.

The `keyring_encrypted_file` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

* C interface: In C-language code, call the keyring service functions described in [Section 5.5.6.2, “The Keyring Service”](keyring-service.html "5.5.6.2 The Keyring Service").

Example (using the SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_encrypted_file`, see [Section 6.4.4.6, “Supported Keyring Key Types and Lengths”](keyring-key-types.html "6.4.4.6 Supported Keyring Key Types and Lengths").
