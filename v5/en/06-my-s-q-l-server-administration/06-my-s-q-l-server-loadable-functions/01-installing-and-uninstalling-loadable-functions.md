### 5.6.1 Installing and Uninstalling Loadable Functions

Loadable functions, as the name implies, must be loaded into the server before they can be used. MySQL supports automatic function loading during server startup and manual loading thereafter.

While a loadable function is loaded, information about it is available as described in [Section 5.6.2, “Obtaining Information About Loadable Functions”](obtaining-loadable-function-information.html "5.6.2 Obtaining Information About Loadable Functions").

* [Installing Loadable Functions](function-loading.html#loadable-function-installing "Installing Loadable Functions")
* [Uninstalling Loadable Functions](function-loading.html#loadable-function-uninstalling "Uninstalling Loadable Functions")
* [Reinstalling or Upgrading Loadable Functions](function-loading.html#loadable-function-upgrading "Reinstalling or Upgrading Loadable Functions")

#### Installing Loadable Functions

To load a loadable function manually, use the [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") statement. For example:

```sql
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

The file base name depends on your platform. Common suffixes are `.so` for Unix and Unix-like systems, `.dll` for Windows.

[`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") has these effects:

* It loads the function into the server to make it available immediately.

* It registers the function in the `mysql.func` system table to make it persistent across server restarts. For this reason, [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") requires the [`INSERT`](privileges-provided.html#priv_insert) privilege for the `mysql` system database.

Automatic loading of loadable functions occurs during the normal server startup sequence. The server loads functions registered in the `mysql.func` table. If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, functions registered in the table are not loaded and are unavailable.

#### Uninstalling Loadable Functions

To remove a loadable function, use the [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") statement. For example:

```sql
DROP FUNCTION metaphon;
```

[`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") has these effects:

* It unloads the function to make it unavailable.
* It removes the function from the `mysql.func` system table. For this reason, [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") requires the [`DELETE`](privileges-provided.html#priv_delete) privilege for the `mysql` system database. With the function no longer registered in the `mysql.func` table, the server does not load the function during subsequent restarts.

While a loadable function is loaded, information about it is available from the `mysql.func` system table. See [Section 5.6.2, “Obtaining Information About Loadable Functions”](obtaining-loadable-function-information.html "5.6.2 Obtaining Information About Loadable Functions"). [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") adds the function to the table and [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") removes it.

#### Reinstalling or Upgrading Loadable Functions

To reinstall or upgrade the shared library associated with a loadable function, issue a [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") statement, upgrade the shared library, and then issue a [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") statement. If you upgrade the shared library first and then use [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), the server may unexpectedly shut down.
