### 25.12.10 Performance Schema User-Defined Variable Tables

The Performance Schema provides a [`user_variables_by_thread`](performance-schema-user-variable-tables.html "25.12.10 Performance Schema User-Defined Variable Tables") table that exposes user-defined variables. These are variables defined within a specific session and include a `@` character preceding the name; see [Section 9.4, “User-Defined Variables”](user-variables.html "9.4 User-Defined Variables").

The [`user_variables_by_thread`](performance-schema-user-variable-tables.html "25.12.10 Performance Schema User-Defined Variable Tables") table has these columns:

* `THREAD_ID`

  The thread identifier of the session in which the variable is defined.

* `VARIABLE_NAME`

  The variable name, without the leading `@` character.

* `VARIABLE_VALUE`

  The variable value.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`user_variables_by_thread`](performance-schema-user-variable-tables.html "25.12.10 Performance Schema User-Defined Variable Tables") table.
