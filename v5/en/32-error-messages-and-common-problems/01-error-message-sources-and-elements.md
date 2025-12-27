## B.1 Error Message Sources and Elements

This section discusses how error messages originate within MySQL and the elements they contain.

* [Error Message Sources](error-message-elements.html#error-sources "Error Message Sources")
* [Error Message Elements](error-message-elements.html#error-elements "Error Message Elements")

### Error Message Sources

Error messages can originate on the server side or the client side:

* On the server side, error messages may occur during the startup and shutdown processes, as a result of issues that occur during SQL statement execution, and so forth.

  + The MySQL server writes some error messages to its error log. These indicate issues of interest to database administrators or that require DBA action.

  + The server sends other error messages to client programs. These indicate issues pertaining only to a particular client. The MySQL client library takes errors received from the server and makes them available to the host client program.

* Client-side error messages are generated from within the MySQL client library, usually involving problems communicating with the server.

Example server-side error messages written to the error log:

* This message produced during the startup process provides a status or progress indicator:

  ```sql
  2018-09-26T14:46:06.326016Z 0 [Note] Skipping generation of SSL
  certificates as options related to SSL are specified.
  ```

* This message indicates an issue that requires DBA action:

  ```sql
  2018-10-02T03:20:39.410387Z 0 [ERROR] Plugin 'InnoDB'
  registration as a STORAGE ENGINE failed.
  ```

Example server-side error message sent to client programs, as displayed by the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client:

```sql
mysql> SELECT * FROM no_such_table;
ERROR 1146 (42S02): Table 'test.no_such_table' doesn't exist
```

Example client-side error message originating from within the client library, as displayed by the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client:

```sql
$> mysql -h no-such-host
ERROR 2005 (HY000): Unknown MySQL server host 'no-such-host' (0)
```

Whether an error originates from within the client library or is received from the server, a MySQL client program may respond in varying ways. As just illustrated, the client may display the error message so the user can take corrective measures. The client may instead internally attempt to resolve or retry a failed operation, or take other action.

### Error Message Elements

When an error occurs, error information includes several elements: an error code, SQLSTATE value, and message string. These elements have the following characteristics:

* Error code: This value is numeric. It is MySQL-specific and is not portable to other database systems.

  Each error number has a corresponding symbolic value. Examples:

  + The symbol for server error number `1146` is [`ER_NO_SUCH_TABLE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_such_table).

  + The symbol for client error number `2005` is [`CR_UNKNOWN_HOST`](/doc/mysql-errors/5.7/en/client-error-reference.html#error_cr_unknown_host).

  Error codes are stable across General Availability (GA) releases of a given MySQL series. Before a series reaches GA status, new codes may still be under development and are subject to change.

* SQLSTATE value: This value is a five-character string (for example, `'42S02'`). SQLSTATE values are taken from ANSI SQL and ODBC and are more standardized than the numeric error codes. The first two characters of an SQLSTATE value indicate the error class:

  + Class = `'00'` indicates success.
  + Class = `'01'` indicates a warning.
  + Class = `'02'` indicates “not found.” This is relevant within the context of cursors and is used to control what happens when a cursor reaches the end of a data set. This condition also occurs for `SELECT ... INTO var_list` statements that retrieve no rows.

  + Class > `'02'` indicates an exception.

  For server-side errors, not all MySQL error numbers have corresponding SQLSTATE values. In these cases, `'HY000'` (general error) is used.

  For client-side errors, the SQLSTATE value is always `'HY000'` (general error), so it is not meaningful for distinguishing one client error from another.

* Message string: This string provides a textual description of the error.
