#### 13.7.4.1 SET Syntax for Variable Assignment

```sql
SET variable = expr [, variable = expr] ...

variable: {
    user_var_name
  | param_name
  | local_var_name
  | {GLOBAL | @@GLOBAL.} system_var_name
  | [SESSION | @@SESSION. | @@] system_var_name
}
```

[`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") syntax for variable assignment enables you to assign values to different types of variables that affect the operation of the server or clients:

* User-defined variables. See [Section 9.4, “User-Defined Variables”](user-variables.html "9.4 User-Defined Variables").

* Stored procedure and function parameters, and stored program local variables. See [Section 13.6.4, “Variables in Stored Programs”](stored-program-variables.html "13.6.4 Variables in Stored Programs").

* System variables. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). System variables also can be set at server startup, as described in [Section 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables").

A [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement that assigns variable values is not written to the binary log, so in replication scenarios it affects only the host on which you execute it. To affect all replication hosts, execute the statement on each host.

The following sections describe [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") syntax for setting variables. They use the [`=`](assignment-operators.html#operator_assign-equal) assignment operator, but the [`:=`](assignment-operators.html#operator_assign-value) assignment operator is also permitted for this purpose.

* [User-Defined Variable Assignment](set-variable.html#set-variable-user-variables "User-Defined Variable Assignment")
* [Parameter and Local Variable Assignment](set-variable.html#set-variable-parameters-local-variables "Parameter and Local Variable Assignment")
* [System Variable Assignment](set-variable.html#set-variable-system-variables "System Variable Assignment")
* [SET Error Handling](set-variable.html#set-variable-error-handling "SET Error Handling")
* [Multiple Variable Assignment](set-variable.html#set-variable-multiple-assignments "Multiple Variable Assignment")
* [System Variable References in Expressions](set-variable.html#variable-references-in-expressions "System Variable References in Expressions")

##### User-Defined Variable Assignment

User-defined variables are created locally within a session and exist only within the context of that session; see [Section 9.4, “User-Defined Variables”](user-variables.html "9.4 User-Defined Variables").

A user-defined variable is written as `@var_name` and is assigned an expression value as follows:

```sql
SET @var_name = expr;
```

Examples:

```sql
SET @name = 43;
SET @total_tax = (SELECT SUM(tax) FROM taxable_transactions);
```

As demonstrated by those statements, *`expr`* can range from simple (a literal value) to more complex (the value returned by a scalar subquery).

The Performance Schema [`user_variables_by_thread`](performance-schema-user-variable-tables.html "25.12.10 Performance Schema User-Defined Variable Tables") table contains information about user-defined variables. See [Section 25.12.10, “Performance Schema User-Defined Variable Tables”](performance-schema-user-variable-tables.html "25.12.10 Performance Schema User-Defined Variable Tables").

##### Parameter and Local Variable Assignment

[`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") applies to parameters and local variables in the context of the stored object within which they are defined. The following procedure uses the `increment` procedure parameter and `counter` local variable:

```sql
CREATE PROCEDURE p(increment INT)
BEGIN
  DECLARE counter INT DEFAULT 0;
  WHILE counter < 10 DO
    -- ... do work ...
    SET counter = counter + increment;
  END WHILE;
END;
```

##### System Variable Assignment

The MySQL server maintains system variables that configure its operation. A system variable can have a global value that affects server operation as a whole, a session value that affects the current session, or both. Many system variables are dynamic and can be changed at runtime using the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement to affect operation of the current server instance. (To make a global system variable setting permanent so that it applies across server restarts, you should also set it in an option file.)

If you change a session system variable, the value remains in effect within your session until you change the variable to a different value or the session ends. The change has no effect on other sessions.

If you change a global system variable, the value is remembered and used to initialize the session value for new sessions until you change the variable to a different value or the server exits. The change is visible to any client that accesses the global value. However, the change affects the corresponding session value only for clients that connect after the change. The global variable change does not affect the session value for any current client sessions (not even the session within which the global value change occurs).

Note

Setting a global system variable value always requires special privileges. Setting a session system variable value normally requires no special privileges and can be done by any user, although there are exceptions. For more information, see [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

The following discussion describes the syntax options for setting system variables:

* To assign a value to a global system variable, precede the variable name by the `GLOBAL` keyword or the `@@GLOBAL.` qualifier:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* To assign a value to a session system variable, precede the variable name by the `SESSION` or `LOCAL` keyword, by the `@@SESSION.`, `@@LOCAL.`, or `@@` qualifier, or by no keyword or no modifier at all:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET LOCAL sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@LOCAL.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  SET sql_mode = 'TRADITIONAL';
  ```

  A client can change its own session variables, but not those of any other client.

To set a global system variable value to the compiled-in MySQL default value or a session system variable to the current corresponding global value, set the variable to the value `DEFAULT`. For example, the following two statements are identical in setting the session value of [`max_join_size`](server-system-variables.html#sysvar_max_join_size) to the current global value:

```sql
SET @@SESSION.max_join_size = DEFAULT;
SET @@SESSION.max_join_size = @@GLOBAL.max_join_size;
```

To display system variable names and values:

* Use the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement; see [Section 13.7.5.39, “SHOW VARIABLES Statement”](show-variables.html "13.7.5.39 SHOW VARIABLES Statement").

* Several Performance Schema tables provide system variable information. See [Section 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables").

##### SET Error Handling

If any variable assignment in a [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement fails, the entire statement fails and no variables are changed.

[`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") produces an error under the circumstances described here. Most of the examples show [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statements that use keyword syntax (for example, `GLOBAL` or `SESSION`), but the principles are also true for statements that use the corresponding modifiers (for example, `@@GLOBAL.` or `@@SESSION.`).

* Use of [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") (any variant) to set a read-only variable:

  ```sql
  mysql> SET GLOBAL version = 'abc';
  ERROR 1238 (HY000): Variable 'version' is a read only variable
  ```

* Use of `GLOBAL` to set a variable that has only a session value:

  ```sql
  mysql> SET GLOBAL sql_log_bin = ON;
  ERROR 1231 (42000): Variable 'sql_log_bin' can't be
  set to the value of 'ON'
  ```

* Use of `SESSION` to set a variable that has only a global value:

  ```sql
  mysql> SET SESSION max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Omission of `GLOBAL` to set a variable that has only a global value:

  ```sql
  mysql> SET max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* The `@@GLOBAL.`, `@@SESSION.`, and `@@` modifiers apply only to system variables. An error occurs for attempts to apply them to user-defined variables, stored procedure or function parameters, or stored program local variables.

* Not all system variables can be set to `DEFAULT`. In such cases, assigning `DEFAULT` results in an error.

* An error occurs for attempts to assign `DEFAULT` to user-defined variables, stored procedure or function parameters, or stored program local variables.

##### Multiple Variable Assignment

A [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement can contain multiple variable assignments, separated by commas. This statement assigns a value to a user-defined variable and a system variable:

```sql
SET @x = 1, SESSION sql_mode = '';
```

If you set multiple system variables in a single statement, the most recent `GLOBAL` or `SESSION` keyword in the statement is used for following assignments that have no keyword specified.

Examples of multiple-variable assignment:

```sql
SET GLOBAL sort_buffer_size = 1000000, SESSION sort_buffer_size = 1000000;
SET @@GLOBAL.sort_buffer_size = 1000000, @@LOCAL.sort_buffer_size = 1000000;
SET GLOBAL max_connections = 1000, sort_buffer_size = 1000000;
```

The `@@GLOBAL.`, `@@SESSION.`, and `@@` modifiers apply only to the immediately following system variable, not any remaining system variables. This statement sets the [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) global value to 50000 and the session value to 1000000:

```sql
SET @@GLOBAL.sort_buffer_size = 50000, sort_buffer_size = 1000000;
```

##### System Variable References in Expressions

To refer to the value of a system variable in expressions, use one of the `@@`-modifiers. For example, you can retrieve system variable values in a [`SELECT`](select.html "13.2.9 SELECT Statement") statement like this:

```sql
SELECT @@GLOBAL.sql_mode, @@SESSION.sql_mode, @@sql_mode;
```

Note

A reference to a system variable in an expression as `@@var_name` (with `@@` rather than `@@GLOBAL.` or `@@SESSION.`) returns the session value if it exists and the global value otherwise. This differs from `SET @@var_name = expr`, which always refers to the session value.
