## B.1 Error Message Sources and Elements

This section discusses how error messages originate within MySQL and the elements they contain.

* Error Message Sources
* Error Message Elements
* Error Code Ranges

### Error Message Sources

Error messages can originate on the server side or the client side:

* On the server side, error messages may occur during the startup and shutdown processes, as a result of issues that occur during SQL statement execution, and so forth.

  + The MySQL server writes some error messages to its error log. These indicate issues of interest to database administrators or that require DBA action.

  + The server sends other error messages to client programs. These indicate issues pertaining only to a particular client. The MySQL client library takes errors received from the server and makes them available to the host client program.

* Client-side error messages are generated from within the MySQL client library, usually involving problems communicating with the server.

Example server-side error messages written to the error log:

* This message produced during the startup process provides a status or progress indicator:

  ```
  2018-10-28T13:01:32.735983Z 0 [Note] [MY-010303] [Server] Skipping
  generation of SSL certificates as options related to SSL are specified.
  ```

* This message indicates an issue that requires DBA action:

  ```
  2018-10-02T03:20:39.410387Z 768 [ERROR] [MY-010045] [Server] Event Scheduler:
  [evtuser@localhost][myschema.e_daily] Unknown database 'mydb'
  ```

Example server-side error message sent to client programs, as displayed by the **mysql** client:

```
mysql> SELECT * FROM no_such_table;
ERROR 1146 (42S02): Table 'test.no_such_table' doesn't exist
```

Example client-side error message originating from within the client library, as displayed by the **mysql** client:

```
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (-2)
```

Whether an error originates from within the client library or is received from the server, a MySQL client program may respond in varying ways. As just illustrated, the client may display the error message so the user can take corrective measures. The client may instead internally attempt to resolve or retry a failed operation, or take other action.

### Error Message Elements

When an error occurs, error information includes several elements: an error code, SQLSTATE value, and message string. These elements have the following characteristics:

* Error code: This value is numeric. It is MySQL-specific and is not portable to other database systems.

  Each error number has a corresponding symbolic value. Examples:

  + The symbol for server error number `1146` is `ER_NO_SUCH_TABLE`.

  + The symbol for client error number `2005` is `CR_UNKNOWN_HOST`.

  The set of error codes used in error messages is partitioned into distinct ranges; see Error Code Ranges.

  Error codes are stable across General Availability (GA) releases of a given MySQL series. Before a series reaches GA status, new codes may still be under development and are subject to change.

* SQLSTATE value: This value is a five-character string (for example, `'42S02'`). SQLSTATE values are taken from ANSI SQL and ODBC and are more standardized than the numeric error codes. The first two characters of an SQLSTATE value indicate the error class:

  + Class = `'00'` indicates success.
  + Class = `'01'` indicates a warning.
  + Class = `'02'` indicates “not found.” This is relevant within the context of cursors and is used to control what happens when a cursor reaches the end of a data set. This condition also occurs for `SELECT ... INTO var_list` statements that retrieve no rows.

  + Class > `'02'` indicates an exception.

  For server-side errors, not all MySQL error numbers have corresponding SQLSTATE values. In these cases, `'HY000'` (general error) is used.

  For client-side errors, the SQLSTATE value is always `'HY000'` (general error), so it is not meaningful for distinguishing one client error from another.

* Message string: This string provides a textual description of the error.

### Error Code Ranges

The set of error codes used in error messages is partitioned into distinct ranges, each with its own purpose:

* 1 to 999: Global error codes. This error code range is called “global” because it is a shared range that is used by the server as well as by clients.

  When an error in this range originates on the server side, the server writes it to the error log, padding the error code with leading zeros to six digits and adding a prefix of `MY-`.

  When an error in this range originates on the client side, the client library makes it available to the client program with no zero-padding or prefix.

* 1,000 to 1,999: Server error codes reserved for messages sent to clients.

* 2,000 to 2,999: Client error codes reserved for use by the client library.

* 3,000 to 4,999: Server error codes reserved for messages sent to clients.

* 5,000 to 5,999: Error codes reserved for use by X Plugin for messages sent to clients.

* 10,000 to 49,999: Server error codes reserved for messages to be written to the error log (not sent to clients).

  When an error in this range occurs, the server writes it to the error log, padding the error code with leading zeros to six digits and adding a prefix of `MY-`.

* 50,000 to 51,999: Error codes reserved for use by third parties.

The server handles error messages written to the error log differently from error messages sent to clients:

* When the server writes a message to the error log, it pads the error code with leading zeros to six digits and adds a prefix of `MY-` (examples: `MY-000022`, `MY-010048`).

* When the server sends a message to a client program, it adds no zero-padding or prefix to the error code (examples: `1036`, `3013`).
