### 29.12.14 Performance Schema System Variable Tables

[29.12.14.1 Performance Schema global\_variable\_attributes Table](performance-schema-global-variable-attributes-table.html)

[29.12.14.2 Performance Schema persisted\_variables Table](performance-schema-persisted-variables-table.html)

[29.12.14.3 Performance Schema variables\_info Table](performance-schema-variables-info-table.html)

[29.12.14.4 Performance Schema variables\_metadata Table](performance-schema-variables-metadata-table.html)

The MySQL server maintains many system variables that indicate
how it is configured (see
[Section 7.1.8, “Server System Variables”](server-system-variables.html "7.1.8 Server System Variables")). System variable
information is available in these Performance Schema tables:

* [`global_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"): Global system
  variables. An application that wants only global values
  should use this table.

* [`session_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"): System
  variables for the current session. An application that wants
  all system variable values for its own session should use
  this table. It includes the session variables for its
  session, as well as the values of global variables that have
  no session counterpart.

* [`variables_by_thread`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"): Session
  system variables for each active session. An application
  that wants to know the session variable values for specific
  sessions should use this table. It includes session
  variables only, identified by thread ID.

* [`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table"): Provides a
  SQL interface to the `mysqld-auto.cnf`
  file that stores persisted global system variable settings.
  See
  [Section 29.12.14.2, “Performance Schema persisted\_variables Table”](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table").

* [`variables_info`](performance-schema-variables-info-table.html "29.12.14.3 Performance Schema variables_info Table"): Shows, for each
  system variable, the source from which it was most recently
  set, and its range of values. See
  [Section 29.12.14.3, “Performance Schema variables\_info Table”](performance-schema-variables-info-table.html "29.12.14.3 Performance Schema variables_info Table").

The [`SENSITIVE_VARIABLES_OBSERVER`](privileges-provided.html#priv_sensitive-variables-observer)
privilege is required to view the values of sensitive system
variables in these tables.

The session variable tables
([`session_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"),
[`variables_by_thread`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables")) contain
information only for active sessions, not terminated sessions.

The [`global_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") and
[`session_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") tables have these
columns:

* `VARIABLE_NAME`

  The system variable name.

* `VARIABLE_VALUE`

  The system variable value. For
  [`global_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"), this column
  contains the global value. For
  [`session_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"), this column
  contains the variable value in effect for the current
  session.

The [`global_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") and
[`session_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") tables have these
indexes:

* Primary key on (`VARIABLE_NAME`)

The [`variables_by_thread`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") table has
these columns:

* `THREAD_ID`

  The thread identifier of the session in which the system
  variable is defined.

* `VARIABLE_NAME`

  The system variable name.

* `VARIABLE_VALUE`

  The session variable value for the session named by the
  `THREAD_ID` column.

The [`variables_by_thread`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") table has
these indexes:

* Primary key on (`THREAD_ID`,
  `VARIABLE_NAME`)

The [`variables_by_thread`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables") table
contains system variable information only about foreground
threads. If not all threads are instrumented by the Performance
Schema, this table misses some rows. In this case, the
[`Performance_schema_thread_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_thread_instances_lost)
status variable is greater than zero.

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is not supported
for Performance Schema system variable tables.