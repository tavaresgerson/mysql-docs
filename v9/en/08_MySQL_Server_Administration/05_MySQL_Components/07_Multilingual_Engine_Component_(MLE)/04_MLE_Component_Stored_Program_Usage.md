#### 7.5.7.4 MLE Component Stored Program Usage

Several system status variables provide information about usage
of MLE stored programs. The
[`mle_stored_procedures`](mle-component-options-variables.html#statvar_mle_stored_procedures),
[`mle_stored_functions`](mle-component-options-variables.html#statvar_mle_stored_functions), and
[`mle_stored_programs`](mle-component-options-variables.html#statvar_mle_stored_programs) status
variables show, respectively, the numbers of MLE stored
procedures, MLE stored functions, and MLE stored programs which
are presently cached, across all user sessions.

Additional MLE stored program metrics can be obtained from two
status variables
[`mle_stored_program_bytes_max`](mle-component-options-variables.html#statvar_mle_stored_program_bytes_max),
which provides the size, in bytes, of the largest current MLE
stored program, and
[`mle_stored_program_sql_max`](mle-component-options-variables.html#statvar_mle_stored_program_sql_max)
shows the maximum number of SQL statements executed by any MLE
stored program.

Other information about MLE stored programs can be found in the
Information Schema [`ROUTINES`](information-schema-routines-table.html "28.3.36 The INFORMATION_SCHEMA ROUTINES Table") table.

MLE stored programs in MySQL Enterprise Edition 9.5 support imported
JavaScript libraries. Information about MLE JavaScript libraries
is available in the two Information Schema tables
[`LIBRARIES`](information-schema-libraries-table.html "28.3.22 The INFORMATION_SCHEMA LIBRARIES Table") and
[`ROUTINE_LIBRARIES`](information-schema-routine-libraries-table.html "28.3.35 The INFORMATION_SCHEMA ROUTINE_LIBRARIES Table"). For more
information and examples of their use, see the descriptions of
these tables, as well as [Section 27.3.8, “Using JavaScript Libraries”](srjs-libraries.html "27.3.8 Using JavaScript Libraries").

[`SHOW LIBRARY STATUS`](show-library-status.html "15.7.7.25 SHOW LIBRARY STATUS Statement") can also
provide useful information about one or more JavaScript
libraries; see [Section 27.3.8, “Using JavaScript Libraries”](srjs-libraries.html "27.3.8 Using JavaScript Libraries").