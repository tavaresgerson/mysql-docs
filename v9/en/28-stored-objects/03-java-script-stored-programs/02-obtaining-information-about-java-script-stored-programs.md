### 27.3.2 Obtaining Information About JavaScript Stored Programs

You can obtain metadata about JavaScript stored programs in the same ways in which you can do so for SQL stored programs; see Section 27.2.3, “Stored Routine Metadata”.

Additional information relating to the MLE component which provides JavaScript stored program functionality can be obtained by checking the values of server system and status variables which this component makes available. See Section 7.5.7.2, “MLE Component Status and Session Information”, for information about these.

For information about memory usage by JavaScript stored programs, see Section 7.5.7.3, “MLE Component Memory and Thread Usage”

You can retrieve the statement that was used to create an MLE stored routine using `SHOW CREATE FUNCTION` or `SHOW CREATE PROCEDURE`, as with any other MySQL stored routine. Stored routine metadata can be retrieved by querying the Information Schema `ROUTINES` table, or by issuing `SHOW FUNCTION STATUS` or `SHOW PROCEDURE STATUS` as appropriate. This metadata is stored in the MySQL data dictionary, and is persistent.

You can retrieve the statement that was used to create an MLE JavaScript library using `SHOW CREATE LIBRARY`. Information about libraries used by routines can be found in the Information Schema `ROUTINE_LIBRARIES` table, as well as the `mysql_option.option_usage` table (see Section 7.5.8.1, “Option Tracker Tables”). This metadata is also stored in the MySQL data dictionary.

Information about the component's state in the current user session can be acquired using the loadable function `mle_session_state()`, which is described elsewhere in this section.
