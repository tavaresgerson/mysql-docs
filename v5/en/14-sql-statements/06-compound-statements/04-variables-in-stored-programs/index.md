### 13.6.4 Variables in Stored Programs

[13.6.4.1 Local Variable DECLARE Statement](declare-local-variable.html)

[13.6.4.2 Local Variable Scope and Resolution](local-variable-scope.html)

System variables and user-defined variables can be used in stored programs, just as they can be used outside stored-program context. In addition, stored programs can use `DECLARE` to define local variables, and stored routines (procedures and functions) can be declared to take parameters that communicate values between the routine and its caller.

* To declare local variables, use the [`DECLARE`](declare-local-variable.html "13.6.4.1 Local Variable DECLARE Statement") statement, as described in [Section 13.6.4.1, “Local Variable DECLARE Statement”](declare-local-variable.html "13.6.4.1 Local Variable DECLARE Statement").

* Variables can be set directly with the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement. See [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

* Results from queries can be retrieved into local variables using [`SELECT ... INTO var_list`](select-into.html "13.2.9.1 SELECT ... INTO Statement") or by opening a cursor and using [`FETCH ... INTO var_list`](fetch.html "13.6.6.3 Cursor FETCH Statement"). See [Section 13.2.9.1, “SELECT ... INTO Statement”](select-into.html "13.2.9.1 SELECT ... INTO Statement"), and [Section 13.6.6, “Cursors”](cursors.html "13.6.6 Cursors").

For information about the scope of local variables and how MySQL resolves ambiguous names, see [Section 13.6.4.2, “Local Variable Scope and Resolution”](local-variable-scope.html "13.6.4.2 Local Variable Scope and Resolution").

It is not permitted to assign the value `DEFAULT` to stored procedure or function parameters or stored program local variables (for example with a `SET var_name = DEFAULT` statement). In MySQL 5.7, this results in a syntax error.
