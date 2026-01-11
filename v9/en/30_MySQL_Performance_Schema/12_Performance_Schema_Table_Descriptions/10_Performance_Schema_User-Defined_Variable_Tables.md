### 29.12.10 Performance Schema User-Defined Variable Tables

The Performance Schema provides a `user_variables_by_thread` table that exposes user-defined variables. These are variables defined within a specific session and include a `@` character preceding the name; see Section 11.4, “User-Defined Variables”.

The `user_variables_by_thread` table has these columns:

* `THREAD_ID`

  The thread identifier of the session in which the variable is defined.

* `VARIABLE_NAME`

  The variable name, without the leading `@` character.

* `VARIABLE_VALUE`

  The variable value.

The `user_variables_by_thread` table has these indexes:

* Primary key on (`THREAD_ID`, `VARIABLE_NAME`)

`TRUNCATE TABLE` is not permitted for the `user_variables_by_thread` table.
