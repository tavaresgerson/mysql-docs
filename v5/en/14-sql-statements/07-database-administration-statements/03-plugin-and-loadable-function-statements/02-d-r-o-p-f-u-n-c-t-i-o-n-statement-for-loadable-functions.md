#### 13.7.3.2 DROP FUNCTION Statement for Loadable Functions

```sql
DROP FUNCTION [IF EXISTS] function_name
```

This statement drops the loadable function named *`function_name`*. (`DROP FUNCTION` is also used to drop stored functions; see [Section 13.1.27, “DROP PROCEDURE and DROP FUNCTION Statements”](drop-procedure.html "13.1.27 DROP PROCEDURE and DROP FUNCTION Statements").)

[`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") is the complement of [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). It requires the [`DELETE`](privileges-provided.html#priv_delete) privilege for the `mysql` system database because it removes the row from the `mysql.func` system table that registers the function.

During the normal startup sequence, the server loads functions registered in the `mysql.func` table. Because [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") removes the `mysql.func` row for the dropped function, the server does not load the function during subsequent restarts.

Note

To upgrade the shared library associated with a loadable function, issue a [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") statement, upgrade the shared library, and then issue a [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") statement. If you upgrade the shared library first and then use [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), the server may unexpectedly shut down.
