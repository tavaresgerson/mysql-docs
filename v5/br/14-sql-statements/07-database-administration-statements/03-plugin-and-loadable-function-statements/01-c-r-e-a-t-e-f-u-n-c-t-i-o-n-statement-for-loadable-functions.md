#### 13.7.3.1 CREATE FUNCTION Statement for Loadable Functions

```sql
CREATE [AGGREGATE] FUNCTION function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

This statement loads the loadable function named *`function_name`*. (`CREATE FUNCTION` is also used to created stored functions; see [Section 13.1.16, “CREATE PROCEDURE and CREATE FUNCTION Statements”](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").)

A loadable function is a way to extend MySQL with a new function that works like a native (built-in) MySQL function such as [`ABS()`](mathematical-functions.html#function_abs) or [`CONCAT()`](string-functions.html#function_concat). See [Adding a Loadable Function](/doc/extending-mysql/5.7/en/adding-loadable-function.html).

*`function_name`* is the name that should be used in SQL statements to invoke the function. The `RETURNS` clause indicates the type of the function's return value. `DECIMAL` is a legal value after `RETURNS`, but currently `DECIMAL` functions return string values and should be written like `STRING` functions.

The `AGGREGATE` keyword, if given, signifies that the function is an aggregate (group) function. An aggregate function works exactly like a native MySQL aggregate function such as [`SUM()`](aggregate-functions.html#function_sum) or [`COUNT()`](aggregate-functions.html#function_count).

*`shared_library_name`* is the base name of the shared library file containing the code that implements the function. The file must be located in the plugin directory. This directory is given by the value of the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable. For more information, see [Section 5.6.1, “Installing and Uninstalling Loadable Functions”](function-loading.html "5.6.1 Installing and Uninstalling Loadable Functions").

[`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") requires the [`INSERT`](privileges-provided.html#priv_insert) privilege for the `mysql` system database because it adds a row to the `mysql.func` system table to register the function.

During the normal startup sequence, the server loads functions registered in the `mysql.func` table. If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, functions registered in the table are not loaded and are unavailable.

Note

To upgrade the shared library associated with a loadable function, issue a [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") statement, upgrade the shared library, and then issue a [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") statement. If you upgrade the shared library first and then use [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), the server may unexpectedly shut down.
