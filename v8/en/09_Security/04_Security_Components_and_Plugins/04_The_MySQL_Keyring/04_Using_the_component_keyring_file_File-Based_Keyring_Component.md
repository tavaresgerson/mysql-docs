#### 8.4.4.4 Using the component_keyring_file File-Based Keyring Component

The `component_keyring_file` keyring component stores keyring data in a file local to the server host.

Warning

For encryption key management, the `component_keyring_file` and `component_keyring_encrypted_file` components are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To use `component_keyring_file` for keystore management in the most common scenario, create two files: a manifest file that tells the server to load `component_keyring_file`, and a configuration file that specifies where to store the keys. Both files should be readable only by the appropriate user that runs the server, typically `mysql`.

The manifest file must be named `mysqld.my` and added to the same directory where **mysqld** is installed. The file looks like this:

```
{
  "components": "file://component_keyring_file"
}
```

The configuration file must be named `component_keyring_file.cnf` and added to the plugin directory. It contains the path to the file where the server stores keys:

```
{
  "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
  "read_only": false
}
```

After adding the two files, restart **mysqld**. Verify component installation by examining the Performance Schema `keyring_component_status` table:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
```

A `Component_status` value of `Active` indicates that the component initialized successfully.

If the server startup fails or the `Component_status` value is `Disabled`, check the server error log.

For more details and to review other scenarios, see Section 8.4.4.2, “Keyring Component Installation” and Configuration Notes.

* Configuration Notes
* Keyring Component Usage

##### Configuration Notes

When it initializes, `component_keyring_file` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).

* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.

* Although global and local configuration files are located in different directories, the file name is `component_keyring_file.cnf` in both locations.

* It is an error for no configuration file to exist. `component_keyring_file` cannot initialize without a valid configuration.

Local configuration files permit setting up multiple server instances to use `component_keyring_file`, such that component configuration for each server instance is specific to a given data directory instance. This enables the same keyring component to be used with a distinct data file for each instance.

`component_keyring_file` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"read_local_config"`: This item is permitted only in the global configuration file. If the item is not present, the component uses only the global configuration file. If the item is present, its value is `true` or `false`, indicating whether the component should read configuration information from the local configuration file.

    If the `"read_local_config"` item is present in the global configuration file along with other items, the component checks the `"read_local_config"` item value first:

    - If the value is `false`, the component processes the other items in the global configuration file and ignores the local configuration file.

    - If the value is `true`, the component ignores the other items in the global configuration file and attempts to read the local configuration file.

  + `"path"`: The item value is a string that names the file to use for storing keyring data. The file should be named using an absolute path, not a relative path. This item is mandatory in the configuration. If not specified, `component_keyring_file` initialization fails.

  + `"read_only"`: The item value indicates whether the keyring data file is read only. The item value is `true` (read only) or `false` (read/write). This item is mandatory in the configuration. If not specified, `component_keyring_file` initialization fails.

* The database administrator has the responsibility for creating any configuration files to be used, and for ensuring that their contents are correct. If an error occurs, server startup fails and the administrator must correct any issues indicated by diagnostics in the server error log.

Given the preceding configuration file properties, to configure `component_keyring_file`, create a global configuration file named `component_keyring_file.cnf` in the directory where the `component_keyring_file` library file is installed, and optionally create a local configuration file, also named `component_keyring_file.cnf`, in the data directory. The following instructions assume that a keyring data file named `/usr/local/mysql/keyring/component_keyring_file.keys` is to be used in read/write fashion.

Note

For Windows systems, the path to the `/usr/local/mysql/keyring/component_keyring_file.keys` file can be in `C:\ProgramData`. It should not be in `C:\Program Files`.

* To use a global configuration file only, the file contents look like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
    "read_only": false
  }
  ```

  Create this file in the directory where the `component_keyring_file` library file is installed.

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.

* Alternatively, to use a global and local configuration file pair, the global file looks like this:

  ```
  {
    "read_local_config": true
  }
  ```

  Create this file in the directory where the `component_keyring_file` library file is installed.

  The local file looks like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
    "read_only": false
  }
  ```

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.

##### Keyring Component Usage

Keyring operations are transactional: `component_keyring_file` uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the data file with a suffix of `.backup`.

`component_keyring_file` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.4.15, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_file`, see Section 8.4.4.13, “Supported Keyring Key Types and Lengths”.
