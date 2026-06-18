#### 15.7.4.2 DROP FUNCTION Statement for Loadable Functions

```
DROP FUNCTION [IF EXISTS] function_name
```

This statement drops the loadable function named
*`function_name`*. (`DROP
FUNCTION` is also used to drop stored functions; see
[Section 15.1.29, “DROP PROCEDURE and DROP FUNCTION Statements”](drop-procedure.html "15.1.29 DROP PROCEDURE and DROP FUNCTION Statements").)

[`DROP
FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") is the complement of
[`CREATE
FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). It requires the
[`DELETE`](privileges-provided.html#priv_delete) privilege for the
`mysql` system schema because it removes the
row from the `mysql.func` system table that
registers the function.

[`DROP
FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") also removes the function from the
Performance Schema
[`user_defined_functions`](performance-schema-user-defined-functions-table.html "29.12.21.10 The user_defined_functions Table") table that
provides runtime information about installed loadable functions.
See
[Section 29.12.21.10, “The user\_defined\_functions Table”](performance-schema-user-defined-functions-table.html "29.12.21.10 The user_defined_functions Table").

During the normal startup sequence, the server loads functions
registered in the `mysql.func` table. Because
[`DROP
FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") removes the `mysql.func` row
for the dropped function, the server does not load the function
during subsequent restarts.

[`DROP
FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") cannot be used to drop a loadable function
that is installed automatically by components or plugins rather
than by using
[`CREATE
FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Such a function is also dropped
automatically, when the component or plugin that installed it is
uninstalled.

Note

To upgrade the shared library associated with a loadable
function, issue a
[`DROP
FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") statement, upgrade the shared library, and
then issue a
[`CREATE
FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") statement. If you upgrade the shared
library first and then use
[`DROP
FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"), the server may unexpectedly shut down.