### 28.3.22 The INFORMATION_SCHEMA PLUGINS Table

The `PLUGINS` table provides information about server plugins.

The `PLUGINS` table has these columns:

* `PLUGIN_NAME`

  The name used to refer to the plugin in statements such as `INSTALL PLUGIN` and `UNINSTALL PLUGIN`.

* `PLUGIN_VERSION`

  The version from the plugin's general type descriptor.

* `PLUGIN_STATUS`

  The plugin status, one of `ACTIVE`, `INACTIVE`, `DISABLED`, `DELETING`, or `DELETED`.

* `PLUGIN_TYPE`

  The type of plugin, such as `STORAGE ENGINE`, `INFORMATION_SCHEMA`, or `AUTHENTICATION`.

* `PLUGIN_TYPE_VERSION`

  The version from the plugin's type-specific descriptor.

* `PLUGIN_LIBRARY`

  The name of the plugin shared library file. This is the name used to refer to the plugin file in statements such as `INSTALL PLUGIN` and `UNINSTALL PLUGIN`. This file is located in the directory named by the `plugin_dir` system variable. If the library name is `NULL`, the plugin is compiled in and cannot be uninstalled with `UNINSTALL PLUGIN`.

* `PLUGIN_LIBRARY_VERSION`

  The plugin API interface version.

* `PLUGIN_AUTHOR`

  The plugin author.

* `PLUGIN_DESCRIPTION`

  A short description of the plugin.

* `PLUGIN_LICENSE`

  How the plugin is licensed (for example, `GPL`).

* `LOAD_OPTION`

  How the plugin was loaded. The value is `OFF`, `ON`, `FORCE`, or `FORCE_PLUS_PERMANENT`. See Section 7.6.1, “Installing and Uninstalling Plugins”.

#### Notes

* `PLUGINS` is a nonstandard `INFORMATION_SCHEMA` table.

* For plugins installed with `INSTALL PLUGIN`, the `PLUGIN_NAME` and `PLUGIN_LIBRARY` values are also registered in the `mysql.plugin` table.

* For information about plugin data structures that form the basis of the information in the `PLUGINS` table, see The MySQL Plugin API.

Plugin information is also available from the `SHOW PLUGINS` statement. See Section 15.7.7.25, “SHOW PLUGINS Statement”. These statements are equivalent:

```
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```
