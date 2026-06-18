### 27.3.2 Obtaining Information About JavaScript Stored Programs

You can obtain metadata about JavaScript stored programs in the
same ways in which you can do so for SQL stored programs; see
[Section 27.2.3, “Stored Routine Metadata”](stored-routines-metadata.html "27.2.3 Stored Routine Metadata").

Additional information relating to the MLE component which
provides JavaScript stored program functionality can be obtained
by checking the values of server system and status variables which
this component makes available. See
[Section 7.5.7.2, “MLE Component Status and Session Information”](mle-component-status.html "7.5.7.2 MLE Component Status and Session Information"), for information about
these.

For information about memory usage by JavaScript stored programs,
see [Section 7.5.7.3, “MLE Component Memory and Thread Usage”](mle-component-memory.html "7.5.7.3 MLE Component Memory and Thread Usage")

You can retrieve the statement that was used to create an MLE
stored routine using [`SHOW CREATE
FUNCTION`](show-create-function.html "15.7.7.9 SHOW CREATE FUNCTION Statement") or [`SHOW CREATE
PROCEDURE`](show-create-procedure.html "15.7.7.11 SHOW CREATE PROCEDURE Statement"), as with any other MySQL stored routine.
Stored routine metadata can be retrieved by querying the
Information Schema [`ROUTINES`](information-schema-routines-table.html "28.3.36 The INFORMATION_SCHEMA ROUTINES Table") table, or
by issuing [`SHOW FUNCTION STATUS`](show-function-status.html "15.7.7.22 SHOW FUNCTION STATUS Statement") or
[`SHOW PROCEDURE STATUS`](show-procedure-status.html "15.7.7.31 SHOW PROCEDURE STATUS Statement") as
appropriate. This metadata is stored in the MySQL data dictionary,
and is persistent.

You can retrieve the statement that was used to create an MLE
JavaScript library using [`SHOW CREATE
LIBRARY`](show-create-library.html "15.7.7.10 SHOW CREATE LIBRARY Statement"). Information about libraries used by routines
can be found in the Information Schema
[`ROUTINE_LIBRARIES`](information-schema-routine-libraries-table.html "28.3.35 The INFORMATION_SCHEMA ROUTINE_LIBRARIES Table") table, as well as
the `mysql_option.option_usage` table (see
[Section 7.5.8.1, “Option Tracker Tables”](option-tracker-component-tables.html "7.5.8.1 Option Tracker Tables")). This metadata
is also stored in the MySQL data dictionary.

Information about the component's state in the current user
session can be acquired using the loadable function
[`mle_session_state()`](srjs-session-info.html#function_mle-session-state), which is
described elsewhere in this section.