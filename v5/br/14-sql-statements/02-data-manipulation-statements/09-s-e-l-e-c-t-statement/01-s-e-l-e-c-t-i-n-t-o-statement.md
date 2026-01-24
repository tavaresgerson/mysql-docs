#### 13.2.9.1 SELECT ... INTO Statement

The [`SELECT ... INTO`](select-into.html "13.2.9.1 SELECT ... INTO Statement") form of [`SELECT`](select.html "13.2.9 SELECT Statement") enables a query result to be stored in variables or written to a file:

* `SELECT ... INTO var_list` selects column values and stores them into variables.

* `SELECT ... INTO OUTFILE` writes the selected rows to a file. Column and line terminators can be specified to produce a specific output format.

* `SELECT ... INTO DUMPFILE` writes a single row to a file without any formatting.

A given [`SELECT`](select.html "13.2.9 SELECT Statement") statement can contain at most one `INTO` clause, although as shown by the [`SELECT`](select.html "13.2.9 SELECT Statement") syntax description (see [Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement")), the `INTO` can appear in different positions:

* Before `FROM`. Example:

  ```sql
  SELECT * INTO @myvar FROM t1;
  ```

* Before a trailing locking clause. Example:

  ```sql
  SELECT * FROM t1 INTO @myvar FOR UPDATE;
  ```

An `INTO` clause should not be used in a nested [`SELECT`](select.html "13.2.9 SELECT Statement") because such a [`SELECT`](select.html "13.2.9 SELECT Statement") must return its result to the outer context. There are also constraints on the use of `INTO` within [`UNION`](union.html "13.2.9.3 UNION Clause") statements; see [Section 13.2.9.3, “UNION Clause”](union.html "13.2.9.3 UNION Clause").

For the `INTO var_list` variant:

* *`var_list`* names a list of one or more variables, each of which can be a user-defined variable, stored procedure or function parameter, or stored program local variable. (Within a prepared `SELECT ... INTO var_list` statement, only user-defined variables are permitted; see [Section 13.6.4.2, “Local Variable Scope and Resolution”](local-variable-scope.html "13.6.4.2 Local Variable Scope and Resolution").)

* The selected values are assigned to the variables. The number of variables must match the number of columns. The query should return a single row. If the query returns no rows, a warning with error code 1329 occurs (`No data`), and the variable values remain unchanged. If the query returns multiple rows, error 1172 occurs (`Result consisted of more than one row`). If it is possible that the statement may retrieve multiple rows, you can use `LIMIT 1` to limit the result set to a single row.

  ```sql
  SELECT id, data INTO @x, @y FROM test.t1 LIMIT 1;
  ```

User variable names are not case-sensitive. See [Section 9.4, “User-Defined Variables”](user-variables.html "9.4 User-Defined Variables").

The [`SELECT ... INTO OUTFILE 'file_name'`](select-into.html "13.2.9.1 SELECT ... INTO Statement") form of [`SELECT`](select.html "13.2.9 SELECT Statement") writes the selected rows to a file. The file is created on the server host, so you must have the [`FILE`](privileges-provided.html#priv_file) privilege to use this syntax. *`file_name`* cannot be an existing file, which among other things prevents files such as `/etc/passwd` and database tables from being modified. The [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem) system variable controls the interpretation of the file name.

The [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") statement is intended to enable dumping a table to a text file on the server host. To create the resulting file on some other host, [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") normally is unsuitable because there is no way to write a path to the file relative to the server host file system, unless the location of the file on the remote host can be accessed using a network-mapped path on the server host file system.

Alternatively, if the MySQL client software is installed on the remote host, you can use a client command such as `mysql -e "SELECT ..." > file_name` to generate the file on that host.

[`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") is the complement of [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"). Column values are written converted to the character set specified in the `CHARACTER SET` clause. If no such clause is present, values are dumped using the `binary` character set. In effect, there is no character set conversion. If a result set contains columns in several character sets, so does the output data file and it may not be possible to reload the file correctly.

The syntax for the *`export_options`* part of the statement consists of the same `FIELDS` and `LINES` clauses that are used with the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement. For more detailed information about the `FIELDS` and `LINES` clauses, including their default values and permissible values, see [Section 13.2.6, “LOAD DATA Statement”](load-data.html "13.2.6 LOAD DATA Statement").

`FIELDS ESCAPED BY` controls how to write special characters. If the `FIELDS ESCAPED BY` character is not empty, it is used when necessary to avoid ambiguity as a prefix that precedes following characters on output:

* The `FIELDS ESCAPED BY` character
* The `FIELDS [OPTIONALLY] ENCLOSED BY` character

* The first character of the `FIELDS TERMINATED BY` and `LINES TERMINATED BY` values

* ASCII `NUL` (the zero-valued byte; what is actually written following the escape character is ASCII `0`, not a zero-valued byte)

The `FIELDS TERMINATED BY`, `ENCLOSED BY`, `ESCAPED BY`, or `LINES TERMINATED BY` characters *must* be escaped so that you can read the file back in reliably. ASCII `NUL` is escaped to make it easier to view with some pagers.

The resulting file need not conform to SQL syntax, so nothing else need be escaped.

If the `FIELDS ESCAPED BY` character is empty, no characters are escaped and `NULL` is output as `NULL`, not `\N`. It is probably not a good idea to specify an empty escape character, particularly if field values in your data contain any of the characters in the list just given.

Here is an example that produces a file in the comma-separated values (CSV) format used by many programs:

```sql
SELECT a,b,a+b INTO OUTFILE '/tmp/result.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM test_table;
```

If you use `INTO DUMPFILE` instead of `INTO OUTFILE`, MySQL writes only one row into the file, without any column or line termination and without performing any escape processing. This is useful for selecting a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") value and storing it in a file.

Note

Any file created by `INTO OUTFILE` or `INTO DUMPFILE` is writable by all users on the server host. The reason for this is that the MySQL server cannot create a file that is owned by anyone other than the user under whose account it is running. (You should *never* run [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") as `root` for this and other reasons.) The file thus must be world-writable so that you can manipulate its contents.

If the [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) system variable is set to a nonempty directory name, the file to be written must be located in that directory.

In the context of [`SELECT ... INTO`](select-into.html "13.2.9.1 SELECT ... INTO Statement") statements that occur as part of events executed by the Event Scheduler, diagnostics messages (not only errors, but also warnings) are written to the error log, and, on Windows, to the application event log. For additional information, see [Section 23.4.5, “Event Scheduler Status”](events-status-info.html "23.4.5 Event Scheduler Status").
