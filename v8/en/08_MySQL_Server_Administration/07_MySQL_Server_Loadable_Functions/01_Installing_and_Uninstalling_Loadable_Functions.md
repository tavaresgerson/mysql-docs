### 7.7.1 Installing and Uninstalling Loadable Functions

Loadable functions, as the name implies, must be loaded into the server before they can be used. MySQL supports automatic function loading during server startup and manual loading thereafter.

While a loadable function is loaded, information about it is available as described in Section 7.7.2, “Obtaining Information About Loadable Functions”.

* Installing Loadable Functions
* Uninstalling Loadable Functions
* Reinstalling or Upgrading Loadable Functions

#### Installing Loadable Functions

To load a loadable function manually, use the `CREATE FUNCTION` statement. For example:

```
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

The file base name depends on your platform. Common suffixes are `.so` for Unix and Unix-like systems, `.dll` for Windows.

`CREATE FUNCTION` has these effects:

* It loads the function into the server to make it available immediately.

* It registers the function in the `mysql.func` system table to make it persistent across server restarts. For this reason, `CREATE FUNCTION` requires the `INSERT` privilege for the `mysql` system database.

* It adds the function to the Performance Schema `user_defined_functions` table that provides runtime information about installed loadable functions. See Section 7.7.2, “Obtaining Information About Loadable Functions”.

Automatic loading of loadable functions occurs during the normal server startup sequence:

* Functions registered in the `mysql.func` table are installed.

* Components or plugins that are installed at startup may automatically install related functions.

* Automatic function installation adds the functions to the Performance Schema `user_defined_functions` table that provides runtime information about installed functions.

If the server is started with the `--skip-grant-tables` option, functions registered in the `mysql.func` table are not loaded and are unavailable. This does not apply to functions installed automatically by a component or plugin.

#### Uninstalling Loadable Functions

To remove a loadable function, use the `DROP FUNCTION` statement. For example:

```
DROP FUNCTION metaphon;
```

`DROP FUNCTION` has these effects:

* It unloads the function to make it unavailable.
* It removes the function from the `mysql.func` system table. For this reason, `DROP FUNCTION` requires the `DELETE` privilege for the `mysql` system database. With the function no longer registered in the `mysql.func` table, the server does not load the function during subsequent restarts.

* It removes the function from the Performance Schema `user_defined_functions` table that provides runtime information about installed loadable functions.

`DROP FUNCTION` cannot be used to drop a loadable function that is installed automatically by components or plugins rather than by using `CREATE FUNCTION`. Such a function is also dropped automatically, when the component or plugin that installed it is uninstalled.

#### Reinstalling or Upgrading Loadable Functions

To reinstall or upgrade the shared library associated with a loadable function, issue a `DROP FUNCTION` statement, upgrade the shared library, and then issue a `CREATE FUNCTION` statement. If you upgrade the shared library first and then use `DROP FUNCTION`, the server may unexpectedly shut down.
