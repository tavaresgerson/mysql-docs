#### 6.4.3.1 Password Validation Plugin Installation

This section describes how to install the `validate_password` password-validation plugin. For general information about installing plugins, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Note

If you installed MySQL 5.7 using the [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/), [MySQL SLES Repository](https://dev.mysql.com/downloads/repo/suse/), or [RPM packages provided by Oracle](linux-installation-rpm.html "2.5.5 Installing MySQL on Linux Using RPM Packages from Oracle"), `validate_password` is enabled by default after you start your MySQL Server for the first time.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable). If necessary, configure the plugin directory location by setting the value of [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) at server startup.

The plugin library file base name is `validate_password`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin at server startup, use the [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=validate_password.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN validate_password SONAME 'validate_password.so';
```

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") loads the plugin, and also registers it in the `mysql.plugins` system table to cause the plugin to be loaded for each subsequent normal server startup without the need for [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add).

To verify plugin installation, examine the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table or use the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement (see [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'validate%';
+-------------------+---------------+
| PLUGIN_NAME       | PLUGIN_STATUS |
+-------------------+---------------+
| validate_password | ACTIVE        |
+-------------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

If the plugin has been previously registered with [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") or is loaded with [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add), you can use the `--validate-password` option at server startup to control plugin activation. For example, to load the plugin at startup and prevent it from being removed at runtime, use these options:

```sql
[mysqld]
plugin-load-add=validate_password.so
validate-password=FORCE_PLUS_PERMANENT
```

If it is desired to prevent the server from running without the password-validation plugin, use [`--validate-password`](validate-password-options-variables.html#option_mysqld_validate-password) with a value of `FORCE` or `FORCE_PLUS_PERMANENT` to force server startup to fail if the plugin does not initialize successfully.
