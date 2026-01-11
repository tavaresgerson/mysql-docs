### 15.6.4 Variables in Stored Programs

15.6.4.1 Local Variable DECLARE Statement

15.6.4.2 Local Variable Scope and Resolution

System variables and user-defined variables can be used in stored programs, just as they can be used outside stored-program context. In addition, stored programs can use `DECLARE` to define local variables, and stored routines (procedures and functions) can be declared to take parameters that communicate values between the routine and its caller.

* To declare local variables, use the `DECLARE` statement, as described in Section 15.6.4.1, “Local Variable DECLARE Statement”.

* Variables can be set directly with the `SET` statement. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

* Results from queries can be retrieved into local variables using `SELECT ... INTO var_list` or by opening a cursor and using `FETCH ... INTO var_list`. See Section 15.2.13.1, “SELECT ... INTO Statement”, and Section 15.6.6, “Cursors”.

For information about the scope of local variables and how MySQL resolves ambiguous names, see Section 15.6.4.2, “Local Variable Scope and Resolution”.

It is not permitted to assign the value `DEFAULT` to stored procedure or function parameters or stored program local variables (for example with a `SET var_name = DEFAULT` statement). In MySQL 8.0, this results in a syntax error.
