### 27.3.7 Using the JavaScript SQL API

27.3.7.1 Simple Statements

27.3.7.2 Prepared Statements

27.3.7.3 Working with Data and Metadata

This section discusses the use of the API in executing and in obtaining and processing results from both simple SQL statements and prepared statements. SQL execution in JavaScript is available in stored procedures only, and not in stored functions.

The SQL API supports two types of statements: simple SQL statements (see Section 27.3.7.1, “Simple Statements”) and prepared statements (Section 27.3.7.2, “Prepared Statements”). Prepared statements support bound parameters; simple statements do not.

The maximum number of simple statements which can be open concurrently for execution of stored procedures in a given session is 1024. This number is fixed, and non-configurable by the user. Trying to execute more simple statements than this number at the same time gives rise to an error. Prepared statements executed in JavaScript count towards the global limit determined by `max_prepared_stmt_count`; see the description of this variable for more information.

The result set returned by an SQL statement is buffered in memory. For a simple statement, the size of the (entire) result set is limited to 1 MB; for a prepared statement, any single row may use up to 1 MB. In either case, exceeding the limit raises an error.

Regardless of the type of statement, two mechanisms are available for consuming results. The result set can be processed inside JavaScript or it can be passed directly to the client. See Result Sets, for more information.

You can also can access session data such as temporary tables, session variables, and transaction state. Session variables declared outside stored procedures can be accessed inside stored procedures; the same is true with respect to temporary tables. In addition, a transaction started outside a stored procedure can be committed inside it.

A statement producing a result set containing unsupported data types results in an unsupported type error. For example, statements involving `DESCRIBE`, `EXPLAIN`, or `ANALYZE TABLE` are affected by this limitation, as shown here:

```
mysql> CALL jssp_simple("DESCRIBE t1");
ERROR 6113 (HY000): JavaScript> Unsupported type BLOB/TEXT for 'Type'
mysql> SHOW WARNINGS;
+-------+------+---------------------------------------------------+
| Level | Code | Message                                           |
+-------+------+---------------------------------------------------+
| Error | 6113 | JavaScript> Unsupported type BLOB/TEXT for 'Type' |
+-------+------+---------------------------------------------------+
1 row in set (0.00 sec)
```

Setting a JavaScript local variable from an SQL statement inside a stored procedure is not supported.

The API also supports multiple result sets, such as produced when one stored procedure calls another. Multi-statement queries are not supported, and produce a syntax error.

Some of the examples in this section are based on the `world` example database available from the MySQL web site. For help installing the database from the download file, see Section 6.5.1.5, “Executing SQL Statements from a Text File”.
