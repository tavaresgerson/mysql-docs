#### 7.5.7.4 MLE Component Stored Program Usage

Several system status variables provide information about usage of MLE stored programs. The `mle_stored_procedures`, `mle_stored_functions`, and `mle_stored_programs` status variables show, respectively, the numbers of MLE stored procedures, MLE stored functions, and MLE stored programs which are presently cached, across all user sessions.

Additional MLE stored program metrics can be obtained from two status variables `mle_stored_program_bytes_max`, which provides the size, in bytes, of the largest current MLE stored program, and `mle_stored_program_sql_max` shows the maximum number of SQL statements executed by any MLE stored program.

Other information about MLE stored programs can be found in the Information Schema `ROUTINES` table.

MLE stored programs in MySQL Enterprise Edition 9.5 support imported JavaScript libraries. Information about MLE JavaScript libraries is available in the two Information Schema tables `LIBRARIES` and `ROUTINE_LIBRARIES`. For more information and examples of their use, see the descriptions of these tables, as well as Section 27.3.8, “Using JavaScript Libraries”.

`SHOW LIBRARY STATUS` can also provide useful information about one or more JavaScript libraries; see Section 27.3.8, “Using JavaScript Libraries”.
