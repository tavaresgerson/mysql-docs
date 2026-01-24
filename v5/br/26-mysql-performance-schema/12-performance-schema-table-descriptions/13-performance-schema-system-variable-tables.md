### 25.12.13 Performance Schema System Variable Tables

Note

The value of the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable affects the information available from the tables described here. For details, see the description of that variable in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

The MySQL server maintains many system variables that indicate how it is configured (see [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables")). System variable information is available in these Performance Schema tables:

* [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): Global system variables. An application that wants only global values should use this table.

* [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): System variables for the current session. An application that wants all system variable values for its own session should use this table. It includes the session variables for its session, as well as the values of global variables that have no session counterpart.

* [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): Session system variables for each active session. An application that wants to know the session variable values for specific sessions should use this table. It includes session variables only, identified by thread ID.

The session variable tables ([`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables")) contain information only for active sessions, not terminated sessions.

The [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") and [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") tables have these columns:

* `VARIABLE_NAME`

  The system variable name.

* `VARIABLE_VALUE`

  The system variable value. For [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), this column contains the global value. For [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), this column contains the variable value in effect for the current session.

The [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") table has these columns:

* `THREAD_ID`

  The thread identifier of the session in which the system variable is defined.

* `VARIABLE_NAME`

  The system variable name.

* `VARIABLE_VALUE`

  The session variable value for the session named by the `THREAD_ID` column.

The [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") table contains system variable information only about foreground threads. If not all threads are instrumented by the Performance Schema, this table may miss some rows. In this case, the [`Performance_schema_thread_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_thread_instances_lost) status variable is greater than zero.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not supported for Performance Schema system variable tables.
