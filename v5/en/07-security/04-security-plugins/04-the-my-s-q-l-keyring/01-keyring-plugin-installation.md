#### 6.4.4.1 Keyring Plugin Installation

Keyring service consumers require that a keyring plugin be installed. This section describes how to install the keyring plugin of your choosing. Also, for general information about installing plugins, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

If you intend to use keyring functions in conjunction with the chosen keyring plugin, install the functions after installing that plugin, using the instructions in [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

Note

Only one keyring plugin should be enabled at a time. Enabling multiple keyring plugins is unsupported and results may not be as anticipated.

MySQL provides these keyring plugin choices:

* `keyring_file`: Stores keyring data in a file local to the server host. Available in MySQL Community Edition and MySQL Enterprise Edition distributions.

* `keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host. Available in MySQL Enterprise Edition distributions.

* `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products such as Oracle Key Vault and Gemalto SafeNet KeySecure Appliance. Available in MySQL Enterprise Edition distributions.

* `keyring_aws`: Communicates with the Amazon Web Services Key Management Service as a back end for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable). If necessary, configure the plugin directory location by setting the value of [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) at server startup.

The keyring plugin must be loaded early during the server startup sequence so that components can access it as necessary during their own initialization. For example, the `InnoDB` storage engine uses the keyring for tablespace encryption, so the keyring plugin must be loaded and available prior to `InnoDB` initialization.

Installation for each keyring plugin is similar. The following instructions describe how to install `keyring_file`. To use a different keyring plugin, substitute its name for `keyring_file`.

The `keyring_file` plugin library file base name is `keyring_file`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin, use the [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option to name the plugin library file that contains it. For example, on platforms where the plugin library file suffix is `.so`, use these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
early-plugin-load=keyring_file.so
```

Important

In MySQL 5.7.11, the default [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) value is the name of the `keyring_file` plugin library file, causing that plugin to be loaded by default. In MySQL 5.7.12 and higher, the default [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) value is empty; to load the `keyring_file` plugin, you must explicitly specify the option with a value naming the `keyring_file` plugin library file.

`InnoDB` tablespace encryption requires that the keyring plugin to be used be loaded prior to `InnoDB` initialization, so this change of default [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) value introduces an incompatibility for upgrades from 5.7.11 to 5.7.12 or higher. Administrators who have encrypted `InnoDB` tablespaces must take explicit action to ensure continued loading of the keyring plugin: Start the server with an [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option that names the plugin library file.

Before starting the server, check the notes for your chosen keyring plugin for configuration instructions specific to that plugin:

* `keyring_file`: [Section 6.4.4.2, “Using the keyring_file File-Based Keyring Plugin”](keyring-file-plugin.html "6.4.4.2 Using the keyring_file File-Based Keyring Plugin").

* `keyring_encrypted_file`: [Section 6.4.4.3, “Using the keyring_encrypted_file Encrypted File-Based Keyring Plugin”](keyring-encrypted-file-plugin.html "6.4.4.3 Using the keyring_encrypted_file Encrypted File-Based Keyring Plugin").

* `keyring_okv`: [Section 6.4.4.4, “Using the keyring_okv KMIP Plugin”](keyring-okv-plugin.html "6.4.4.4 Using the keyring_okv KMIP Plugin").

* `keyring_aws`: [Section 6.4.4.5, “Using the keyring_aws Amazon Web Services Keyring Plugin”](keyring-aws-plugin.html "6.4.4.5 Using the keyring_aws Amazon Web Services Keyring Plugin")

After performing any plugin-specific configuration, start the server. Verify plugin installation by examining the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table or use the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement (see [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

Plugins can be loaded by methods other than [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load), such as the [`--plugin-load`](server-options.html#option_mysqld_plugin-load) or [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) option or the [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statement. However, keyring plugins loaded using those methods may be available too late in the server startup sequence for certain components that use the keyring, such as `InnoDB`:

* Plugin loading using [`--plugin-load`](server-options.html#option_mysqld_plugin-load) or [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) occurs after `InnoDB` initialization.

* Plugins installed using [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") are registered in the `mysql.plugin` system table and loaded automatically for subsequent server restarts. However, because `mysql.plugin` is an `InnoDB` table, any plugins named in it can be loaded during startup only after `InnoDB` initialization.

If no keyring plugin is available when a component tries to access the keyring service, the service cannot be used by that component. As a result, the component may fail to initialize or may initialize with limited functionality. For example, if `InnoDB` finds that there are encrypted tablespaces when it initializes, it attempts to access the keyring. If the keyring is unavailable, `InnoDB` can access only unencrypted tablespaces. To ensure that `InnoDB` can access encrypted tablespaces as well, use [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) to load the keyring plugin.
