#### 8.4.4.5 Using the component\_keyring\_encrypted\_file Encrypted File-Based Keyring Component

::: info Note

`component_keyring_encrypted_file` is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

:::

The `component_keyring_encrypted_file` keyring component stores keyring data in an encrypted, password-protected file local to the server host.

Warning

For encryption key management, the `component_keyring_file` and `component_keyring_encrypted_file` components are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To use `component_keyring_encrypted_file` for keystore management, you must:

1. Write a manifest that tells the server to load `component_keyring_encrypted_file`, as described in Section 8.4.4.2, “Keyring Component Installation”.
2. Write a configuration file for `component_keyring_encrypted_file`, as described here.

When it initializes, `component_keyring_encrypted_file` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).
* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.
* Although global and local configuration files are located in different directories, the file name is `component_keyring_encrypted_file.cnf` in both locations.
* If `component_keyring_encrypted_file` cannot find the configuration file, an error results, and the component cannot initialize.

Local configuration files permit setting up multiple server instances to use `component_keyring_encrypted_file`, such that component configuration for each server instance is specific to a given data directory instance. This enables the same keyring component to be used with a distinct data file for each instance.

`component_keyring_encrypted_file` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"read_local_config"`: This item is permitted only in the global configuration file. If the item is not present, the component uses only the global configuration file. If the item is present, its value is `true` or `false`, indicating whether the component should read configuration information from the local configuration file.

    If the `"read_local_config"` item is present in the global configuration file along with other items, the component checks the `"read_local_config"` item value first:

    - If the value is `false`, the component processes the other items in the global configuration file and ignores the local configuration file.
    - If the value is `true`, the component ignores the other items in the global configuration file and attempts to read the local configuration file.
  + `"path"`: The item value is a string that names the file to use for storing keyring data. The file should be named using an absolute path, not a relative path. This item is mandatory in the configuration. If not specified, `component_keyring_encrypted_file` initialization fails.
  + `"password"`: The item value is a string that specifies the password for accessing the data file. This item is mandatory in the configuration. If not specified, `component_keyring_encrypted_file` initialization fails.
  + `"read_only"`: The item value indicates whether the keyring data file is read only. The item value is `true` (read only) or `false` (read/write). This item is mandatory in the configuration. If not specified, `component_keyring_encrypted_file` initialization fails.
* The database administrator has the responsibility for creating any configuration files to be used, and for ensuring that their contents are correct. If an error occurs, server startup fails and the administrator must correct any issues indicated by diagnostics in the server error log.
* Any configuration file that stores a password should have a restrictive mode and be accessible only to the account used to run the MySQL server.

Given the preceding configuration file properties, to configure `component_keyring_encrypted_file`, create a global configuration file named `component_keyring_encrypted_file.cnf` in the directory where the `component_keyring_encrypted_file` library file is installed, and optionally create a local configuration file, also named `component_keyring_encrypted_file.cnf`, in the data directory. The following instructions assume that a keyring data file named `/usr/local/mysql/keyring/component_keyring_encrypted_file` is to be used in read/write fashion. You must also choose a password.

* To use a global configuration file only, the file contents look like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file",
    "password": "password",
    "read_only": false
  }
  ```

  Create this file in the directory where the `component_keyring_encrypted_file` library file is installed.

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.
* Alternatively, to use a global and local configuration file pair, the global file looks like this:

  ```
  {
    "read_local_config": true
  }
  ```

  Create this file in the directory where the `component_keyring_encrypted_file` library file is installed.

  The local file looks like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file",
    "password": "password",
    "read_only": false
  }
  ```

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.

Keyring operations are transactional: `component_keyring_encrypted_file` uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the data file with a suffix of `.backup`.

`component_keyring_encrypted_file` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.4.12, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_encrypted_file`, see Section 8.4.4.10, “Supported Keyring Key Types and Lengths”.
