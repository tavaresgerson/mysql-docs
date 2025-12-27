## B.2 Error Information Interfaces

Error messages can originate on the server side or the client side, and each error message includes an error code, SQLSTATE value, and message string, as described in [Section B.1, “Error Message Sources and Elements”](error-message-elements.html "B.1 Error Message Sources and Elements"). For lists of server-side, client-side, and global (shared between server and clients) errors, see [MySQL 5.7 Error Message Reference](/doc/mysql-errors/5.7/en/).

For error checking from within programs, use error code numbers or symbols, not error message strings. Message strings do not change often, but it is possible. Also, if the database administrator changes the language setting, that affects the language of message strings; see [Section 10.12, “Setting the Error Message Language”](error-message-language.html "10.12 Setting the Error Message Language").

Error information in MySQL is available in the server error log, at the SQL level, from within client programs, and at the command line.

* [Error Log](error-interfaces.html#error-interface-log "Error Log")
* [SQL Error Message Interface](error-interfaces.html#error-interface-sql "SQL Error Message Interface")
* [Client Error Message Interface](error-interfaces.html#error-interface-client "Client Error Message Interface")
* [Command-Line Error Message Interface](error-interfaces.html#error-interface-command "Command-Line Error Message Interface")

### Error Log

On the server side, some messages are intended for the error log. For information about configuring where and how the server writes the log, see [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

Other server error messages are intended to be sent to client programs and are available as described in [Client Error Message Interface](error-interfaces.html#error-interface-client "Client Error Message Interface").

### SQL Error Message Interface

At the SQL level, there are several sources of error information in MySQL:

* SQL statement warning and error information is available through the [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") and [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") statements. The [`warning_count`](server-system-variables.html#sysvar_warning_count) system variable indicates the number of errors, warnings, and notes (with notes excluded if the [`sql_notes`](server-system-variables.html#sysvar_sql_notes) system variable is disabled). The [`error_count`](server-system-variables.html#sysvar_error_count) system variable indicates the number of errors. Its value excludes warnings and notes.

* The [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement") statement may be used to inspect the diagnostic information in the diagnostics area. See [Section 13.6.7.3, “GET DIAGNOSTICS Statement”](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement").

* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement output includes information about replication errors occurring on replica servers.

* [`SHOW ENGINE INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") statement output includes information about the most recent foreign key error if a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement for an [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") table fails.

### Client Error Message Interface

Client programs receive errors from two sources:

* Errors that originate on the client side from within the MySQL client library.

* Errors that originate on the server side and are sent to the client by the server. These are received within the client library, which makes them available to the host client program.

Regardless of whether an error originates from within the client library or is received from the server, a MySQL client program obtains the error code, SQLSTATE value, message string, and other related information by calling C API functions in the client library:

* [`mysql_errno()`](/doc/c-api/5.7/en/mysql-errno.html) returns the MySQL error code.

* [`mysql_sqlstate()`](/doc/c-api/5.7/en/mysql-sqlstate.html) returns the SQLSTATE value.

* [`mysql_error()`](/doc/c-api/5.7/en/mysql-error.html) returns the message string.

* [`mysql_stmt_errno()`](/doc/c-api/5.7/en/mysql-stmt-errno.html), [`mysql_stmt_sqlstate()`](/doc/c-api/5.7/en/mysql-stmt-sqlstate.html), and [`mysql_stmt_error()`](/doc/c-api/5.7/en/mysql-stmt-error.html) are the corresponding error functions for prepared statements.

* [`mysql_warning_count()`](/doc/c-api/5.7/en/mysql-warning-count.html) returns the number of errors, warnings, and notes for the most recent statement.

For descriptions of the client library error functions, see [MySQL 5.7 C API Developer Guide](/doc/c-api/5.7/en/).

A MySQL client program may respond to an error in varying ways. The client may display the error message so the user can take corrective measures, internally attempt to resolve or retry a failed operation, or take other action. For example, (using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client), a failure to connect to the server might result in this message:

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

### Command-Line Error Message Interface

The [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") program provides information from the command line about error numbers. See [Section 4.8.2, “perror — Display MySQL Error Message Information”](perror.html "4.8.2 perror — Display MySQL Error Message Information").

```sql
$> perror 1231
MySQL error code 1231 (ER_WRONG_VALUE_FOR_VAR): Variable '%-.64s' can't
be set to the value of '%-.200s'
```

For MySQL NDB Cluster errors, use [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information"). See [Section 21.5.17, “ndb\_perror — Obtain NDB Error Message Information”](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information").

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing:
Permanent error: Application error
```
