### 13.2.1 CALL Statement

```sql
CALL sp_name([parameter[,...)
CALL sp_name[()]
```

The [`CALL`](call.html "13.2.1 CALL Statement") statement invokes a stored procedure that was defined previously with [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").

Stored procedures that take no arguments can be invoked without parentheses. That is, `CALL p()` and `CALL p` are equivalent.

[`CALL`](call.html "13.2.1 CALL Statement") can pass back values to its caller using parameters that are declared as `OUT` or `INOUT` parameters. When the procedure returns, a client program can also obtain the number of rows affected for the final statement executed within the routine: At the SQL level, call the [`ROW_COUNT()`](information-functions.html#function_row-count) function; from the C API, call the [`mysql_affected_rows()`](/doc/c-api/5.7/en/mysql-affected-rows.html) function.

For information about the effect of unhandled conditions on procedure parameters, see [Section 13.6.7.8, “Condition Handling and OUT or INOUT Parameters”](conditions-and-parameters.html "13.6.7.8 Condition Handling and OUT or INOUT Parameters").

To get back a value from a procedure using an `OUT` or `INOUT` parameter, pass the parameter by means of a user variable, and then check the value of the variable after the procedure returns. (If you are calling the procedure from within another stored procedure or function, you can also pass a routine parameter or local routine variable as an `IN` or `INOUT` parameter.) For an `INOUT` parameter, initialize its value before passing it to the procedure. The following procedure has an `OUT` parameter that the procedure sets to the current server version, and an `INOUT` value that the procedure increments by one from its current value:

```sql
DELIMITER //

CREATE PROCEDURE p (OUT ver_param VARCHAR(25), INOUT incr_param INT)
BEGIN
  # Set value of OUT parameter
  SELECT VERSION() INTO ver_param;
  # Increment value of INOUT parameter
  SET incr_param = incr_param + 1;
END //

DELIMITER ;
```

Before calling the procedure, initialize the variable to be passed as the `INOUT` parameter. After calling the procedure, the values of the two variables have been set or modified:

```sql
mysql> SET @increment = 10;
mysql> CALL p(@version, @increment);
mysql> SELECT @version, @increment;
+----------+------------+
| @version | @increment |
+----------+------------+
| 5.7.44   |         11 |
+----------+------------+
```

In prepared [`CALL`](call.html "13.2.1 CALL Statement") statements used with [`PREPARE`](prepare.html "13.5.1 PREPARE Statement") and [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement"), placeholders can be used for `IN` parameters, `OUT`, and `INOUT` parameters. These types of parameters can be used as follows:

```sql
mysql> SET @increment = 10;
mysql> PREPARE s FROM 'CALL p(?, ?)';
mysql> EXECUTE s USING @version, @increment;
mysql> SELECT @version, @increment;
+----------+------------+
| @version | @increment |
+----------+------------+
| 5.7.44   |         11 |
+----------+------------+
```

To write C programs that use the [`CALL`](call.html "13.2.1 CALL Statement") SQL statement to execute stored procedures that produce result sets, the `CLIENT_MULTI_RESULTS` flag must be enabled. This is because each [`CALL`](call.html "13.2.1 CALL Statement") returns a result to indicate the call status, in addition to any result sets that might be returned by statements executed within the procedure. `CLIENT_MULTI_RESULTS` must also be enabled if [`CALL`](call.html "13.2.1 CALL Statement") is used to execute any stored procedure that contains prepared statements. It cannot be determined when such a procedure is loaded whether those statements produce result sets, so it is necessary to assume that they do so.

`CLIENT_MULTI_RESULTS` can be enabled when you call [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html), either explicitly by passing the `CLIENT_MULTI_RESULTS` flag itself, or implicitly by passing `CLIENT_MULTI_STATEMENTS` (which also enables `CLIENT_MULTI_RESULTS`). `CLIENT_MULTI_RESULTS` is enabled by default.

To process the result of a [`CALL`](call.html "13.2.1 CALL Statement") statement executed using [`mysql_query()`](/doc/c-api/5.7/en/mysql-query.html) or [`mysql_real_query()`](/doc/c-api/5.7/en/mysql-real-query.html), use a loop that calls [`mysql_next_result()`](/doc/c-api/5.7/en/mysql-next-result.html) to determine whether there are more results. For an example, see [Multiple Statement Execution Support](/doc/c-api/5.7/en/c-api-multiple-queries.html).

C programs can use the prepared-statement interface to execute [`CALL`](call.html "13.2.1 CALL Statement") statements and access `OUT` and `INOUT` parameters. This is done by processing the result of a [`CALL`](call.html "13.2.1 CALL Statement") statement using a loop that calls [`mysql_stmt_next_result()`](/doc/c-api/5.7/en/mysql-stmt-next-result.html) to determine whether there are more results. For an example, see [Prepared CALL Statement Support](/doc/c-api/5.7/en/c-api-prepared-call-statements.html). Languages that provide a MySQL interface can use prepared [`CALL`](call.html "13.2.1 CALL Statement") statements to directly retrieve `OUT` and `INOUT` procedure parameters.

Metadata changes to objects referred to by stored programs are detected and cause automatic reparsing of the affected statements when the program is next executed. For more information, see [Section 8.10.4, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "8.10.4 Caching of Prepared Statements and Stored Programs").
