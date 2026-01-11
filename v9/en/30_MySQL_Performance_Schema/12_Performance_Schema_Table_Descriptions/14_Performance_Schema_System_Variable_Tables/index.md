### 29.12.14 Performance Schema System Variable Tables

29.12.14.1 Performance Schema global\_variable\_attributes Table

29.12.14.2 Performance Schema persisted\_variables Table

29.12.14.3 Performance Schema variables\_info Table

29.12.14.4 Performance Schema variables\_metadata Table

The MySQL server maintains many system variables that indicate how it is configured (see Section 7.1.8, “Server System Variables”). System variable information is available in these Performance Schema tables:

* `global_variables`: Global system variables. An application that wants only global values should use this table.

* `session_variables`: System variables for the current session. An application that wants all system variable values for its own session should use this table. It includes the session variables for its session, as well as the values of global variables that have no session counterpart.

* `variables_by_thread`: Session system variables for each active session. An application that wants to know the session variable values for specific sessions should use this table. It includes session variables only, identified by thread ID.

* `persisted_variables`: Provides a SQL interface to the `mysqld-auto.cnf` file that stores persisted global system variable settings. See Section 29.12.14.2, “Performance Schema persisted\_variables Table”.

* `variables_info`: Shows, for each system variable, the source from which it was most recently set, and its range of values. See Section 29.12.14.3, “Performance Schema variables\_info Table”.

The `SENSITIVE_VARIABLES_OBSERVER` privilege is required to view the values of sensitive system variables in these tables.

The session variable tables (`session_variables`, `variables_by_thread`) contain information only for active sessions, not terminated sessions.

The `global_variables` and `session_variables` tables have these columns:

* `VARIABLE_NAME`

  The system variable name.

* `VARIABLE_VALUE`

  The system variable value. For `global_variables`, this column contains the global value. For `session_variables`, this column contains the variable value in effect for the current session.

The `global_variables` and `session_variables` tables have these indexes:

* Primary key on (`VARIABLE_NAME`)

The `variables_by_thread` table has these columns:

* `THREAD_ID`

  The thread identifier of the session in which the system variable is defined.

* `VARIABLE_NAME`

  The system variable name.

* `VARIABLE_VALUE`

  The session variable value for the session named by the `THREAD_ID` column.

The `variables_by_thread` table has these indexes:

* Primary key on (`THREAD_ID`, `VARIABLE_NAME`)

The `variables_by_thread` table contains system variable information only about foreground threads. If not all threads are instrumented by the Performance Schema, this table misses some rows. In this case, the `Performance_schema_thread_instances_lost` status variable is greater than zero.

`TRUNCATE TABLE` is not supported for Performance Schema system variable tables.
