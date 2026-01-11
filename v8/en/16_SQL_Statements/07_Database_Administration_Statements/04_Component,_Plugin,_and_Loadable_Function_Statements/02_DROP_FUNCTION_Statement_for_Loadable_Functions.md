#### 15.7.4.2 DROP FUNCTION Statement for Loadable Functions

```
DROP FUNCTION [IF EXISTS] function_name
```

This statement drops the loadable function named *`function_name`*. (`DROP FUNCTION` is also used to drop stored functions; see Section 15.1.29, “DROP PROCEDURE and DROP FUNCTION Statements”.)

`DROP FUNCTION` is the complement of `CREATE FUNCTION`. It requires the `DELETE` privilege for the `mysql` system schema because it removes the row from the `mysql.func` system table that registers the function.

`DROP FUNCTION` also removes the function from the Performance Schema `user_defined_functions` table that provides runtime information about installed loadable functions. See Section 29.12.21.10, “The user_defined_functions Table”.

During the normal startup sequence, the server loads functions registered in the `mysql.func` table. Because `DROP FUNCTION` removes the `mysql.func` row for the dropped function, the server does not load the function during subsequent restarts.

`DROP FUNCTION` cannot be used to drop a loadable function that is installed automatically by components or plugins rather than by using `CREATE FUNCTION`. Such a function is also dropped automatically, when the component or plugin that installed it is uninstalled.

Note

To upgrade the shared library associated with a loadable function, issue a `DROP FUNCTION` statement, upgrade the shared library, and then issue a `CREATE FUNCTION` statement. If you upgrade the shared library first and then use `DROP FUNCTION`, the server may unexpectedly shut down.
