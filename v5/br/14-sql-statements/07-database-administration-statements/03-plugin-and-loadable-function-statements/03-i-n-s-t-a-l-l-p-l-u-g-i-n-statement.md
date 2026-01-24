#### 13.7.3.3 INSTALL PLUGIN Statement

```sql
INSTALL PLUGIN plugin_name SONAME 'shared_library_name'
```

This statement installs a server plugin. It requires the [`INSERT`](privileges-provided.html#priv_insert) privilege for the `mysql.plugin` system table because it adds a row to that table to register the plugin.

*`plugin_name`* is the name of the plugin as defined in the plugin descriptor structure contained in the library file (see [Plugin Data Structures](/doc/extending-mysql/5.7/en/plugin-data-structures.html)). Plugin names are not case-sensitive. For maximal compatibility, plugin names should be limited to ASCII letters, digits, and underscore because they are used in C source files, shell command lines, M4 and Bourne shell scripts, and SQL environments.

*`shared_library_name`* is the name of the shared library that contains the plugin code. The name includes the file name extension (for example, `libmyplugin.so`, `libmyplugin.dll`, or `libmyplugin.dylib`).

The shared library must be located in the plugin directory (the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable). The library must be in the plugin directory itself, not in a subdirectory. By default, [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) is the `plugin` directory under the directory named by the `pkglibdir` configuration variable, but it can be changed by setting the value of [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) at server startup. For example, set its value in a `my.cnf` file:

```sql
[mysqld]
plugin_dir=/path/to/plugin/directory
```

If the value of [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) is a relative path name, it is taken to be relative to the MySQL base directory (the value of the [`basedir`](server-system-variables.html#sysvar_basedir) system variable).

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") loads and initializes the plugin code to make the plugin available for use. A plugin is initialized by executing its initialization function, which handles any setup that the plugin must perform before it can be used. When the server shuts down, it executes the deinitialization function for each plugin that is loaded so that the plugin has a chance to perform any final cleanup.

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") also registers the plugin by adding a line that indicates the plugin name and library file name to the `mysql.plugin` system table. During the normal startup sequence, the server loads and initializes plugins registered in `mysql.plugin`. This means that a plugin is installed with [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") only once, not every time the server starts. If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, plugins registered in the `mysql.plugin` table are not loaded and are unavailable.

A plugin library can contain multiple plugins. For each of them to be installed, use a separate [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statement. Each statement names a different plugin, but all of them specify the same library name.

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") causes the server to read option (`my.cnf`) files just as during server startup. This enables the plugin to pick up any relevant options from those files. It is possible to add plugin options to an option file even before loading a plugin (if the `loose` prefix is used). It is also possible to uninstall a plugin, edit `my.cnf`, and install the plugin again. Restarting the plugin this way enables it to the new option values without a server restart.

For options that control individual plugin loading at server startup, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins"). If you need to load plugins for a single server startup when the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option is given (which tells the server not to read system tables), use the [`--plugin-load`](server-options.html#option_mysqld_plugin-load) option. See [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options").

To remove a plugin, use the [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") statement.

For additional information about plugin loading, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

To see what plugins are installed, use the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement or query the `INFORMATION_SCHEMA` the [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table.

If you recompile a plugin library and need to reinstall it, you can use either of the following methods:

* Use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") to uninstall all plugins in the library, install the new plugin library file in the plugin directory, and then use [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") to install all plugins in the library. This procedure has the advantage that it can be used without stopping the server. However, if the plugin library contains many plugins, you must issue many [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") and [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") statements.

* Stop the server, install the new plugin library file in the plugin directory, and restart the server.
