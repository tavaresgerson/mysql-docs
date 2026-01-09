#### 13.7.5.25 SHOW PLUGINS Statement

```sql
SHOW PLUGINS
```

[`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") displays information about server plugins.

Example of [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") output:

```sql
mysql> SHOW PLUGINS\G
*************************** 1. row ***************************
   Name: binlog
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 2. row ***************************
   Name: CSV
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 3. row ***************************
   Name: MEMORY
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 4. row ***************************
   Name: MyISAM
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
...
```

[`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") output has these columns:

* `Name`

  The name used to refer to the plugin in statements such as [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") and [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement").

* `Status`

  The plugin status, one of `ACTIVE`, `INACTIVE`, `DISABLED`, or `DELETED`.

* `Type`

  The type of plugin, such as `STORAGE ENGINE`, `INFORMATION_SCHEMA`, or `AUTHENTICATION`.

* `Library`

  The name of the plugin shared library file. This is the name used to refer to the plugin file in statements such as [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") and [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement"). This file is located in the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable. If the library name is `NULL`, the plugin is compiled in and cannot be uninstalled with [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement").

* `License`

  How the plugin is licensed (for example, `GPL`).

For plugins installed with [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), the `Name` and `Library` values are also registered in the `mysql.plugin` system table.

For information about plugin data structures that form the basis of the information displayed by [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement"), see [The MySQL Plugin API](/doc/extending-mysql/5.7/en/plugin-api.html).

Plugin information is also available from the `INFORMATION_SCHEMA` `.PLUGINS` table. See [Section 24.3.17, “The INFORMATION_SCHEMA PLUGINS Table”](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table").
