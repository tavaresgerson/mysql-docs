## B.2 Error Information Interfaces

Error messages can originate on the server side or the client side, and each error message includes an error code, SQLSTATE value, and message string, as described in  Section B.1, “Error Message Sources and Elements”. For lists of server-side, client-side, and global (shared between server and clients) errors, see  MySQL 8.4 Error Message Reference.

For error checking from within programs, use error code numbers or symbols, not error message strings. Message strings do not change often, but it is possible. Also, if the database administrator changes the language setting, that affects the language of message strings; see  Section 12.12, “Setting the Error Message Language”.

Error information in MySQL is available in the server error log, at the SQL level, from within client programs, and at the command line.

*  Error Log
*  SQL Error Message Interface
*  Client Error Message Interface
*  Command-Line Error Message Interface

### Error Log

On the server side, some messages are intended for the error log. For information about configuring where and how the server writes the log, see  Section 7.4.2, “The Error Log”.

Other server error messages are intended to be sent to client programs and are available as described in  Client Error Message Interface.

The range within which a particular error code lies determines whether the server writes an error message to the error log or sends it to clients. For information about these ranges, see  Error Code Ranges.

### SQL Error Message Interface

At the SQL level, there are several sources of error information in MySQL:

* SQL statement warning and error information is available through the  `SHOW WARNINGS` and  `SHOW ERRORS` statements. The  `warning_count` system variable indicates the number of errors, warnings, and notes (with notes excluded if the  `sql_notes` system variable is disabled). The  `error_count` system variable indicates the number of errors. Its value excludes warnings and notes.
* The  `GET DIAGNOSTICS` statement may be used to inspect the diagnostic information in the diagnostics area. See  Section 15.6.7.3, “GET DIAGNOSTICS Statement”.
*  `SHOW REPLICA STATUS` statement output includes information about replication errors occurring on replica servers.
*  `SHOW ENGINE INNODB STATUS` statement output includes information about the most recent foreign key error if a  `CREATE TABLE` statement for an  `InnoDB` table fails.

### Client Error Message Interface

Client programs receive errors from two sources:

* Errors that originate on the client side from within the MySQL client library.
* Errors that originate on the server side and are sent to the client by the server. These are received within the client library, which makes them available to the host client program.

The range within which a particular error code lies determines whether it originated from within the client library or was received by the client from the server. For information about these ranges, see  Error Code Ranges.

Regardless of whether an error originates from within the client library or is received from the server, a MySQL client program obtains the error code, SQLSTATE value, message string, and other related information by calling C API functions in the client library:

*  `mysql_errno()` returns the MySQL error code.
*  `mysql_sqlstate()` returns the SQLSTATE value.
*  `mysql_error()` returns the message string.
*  `mysql_stmt_errno()`,  `mysql_stmt_sqlstate()`, and  `mysql_stmt_error()` are the corresponding error functions for prepared statements.
*  `mysql_warning_count()` returns the number of errors, warnings, and notes for the most recent statement.

For descriptions of the client library error functions, see  MySQL 8.4 C API Developer Guide.

A MySQL client program may respond to an error in varying ways. The client may display the error message so the user can take corrective measures, internally attempt to resolve or retry a failed operation, or take other action. For example, (using the  `mysql` client), a failure to connect to the server might result in this message:

```
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (-2)
```

### Command-Line Error Message Interface

The  **perror** program provides information from the command line about error numbers. See  Section 6.8.1, “perror — Display MySQL Error Message Information”.

```
$> perror 1231
MySQL error code MY-001231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s'
can't be set to the value of '%-.200s'
```

For MySQL NDB Cluster errors, use  **ndb\_perror**. See  Section 25.5.16, “ndb\_perror — Obtain NDB Error Message Information”.

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing:
Permanent error: Application error
```


