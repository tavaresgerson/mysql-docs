#### 27.3.6.13 SqlError Object

When an `SqlError` is thrown, an error is raised in MySQL similar to how one is raised by a `SIGNAL` statement. You can create an `SqlError` using the constructor shown here:

```
new SqlError(
  sql_state: Number,
  message: String,
  error_number: Number
)
```

The JavaScript stored procedure in the following example tries and throws an `SqlError` created using this constructor. Invoking the procedure raises the error, as can be seen here:

```
mysql> CREATE PROCEDURE test_catch_throw_signal() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>   try {
    $>     throw new mysql.SQLError(45000, 'Some error', 1001)
    $>   } catch (e) {
    $>     console.log(e)
    $>   }
    $> $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CALL test_catch_throw_signal();
Query OK, 0 rows affected (0.04 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
org.graalvm.polyglot.nativeapi.PolyglotNativeAPI$CallbackException: SQL-CALLOUT:
Error code: 1001 Error state: 45000 Error message: `Some error`

1 row in set (0.00 sec)
```

*`sql_state`* and *`error_number`* must be of type `Number`. MLE throws an exception if either of these values is `Infinity` or `NaN`.

You can also invoke `SIGNAL` from JavaScript routine code to throw an exception, similar to what is shown here:

```
mysql> CREATE PROCEDURE test_signal_no_catch() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>     session.runSql("SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT= 'Some error', MYSQL_ERRNO = 1000")
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL test_signal_no_catch();
ERROR 1000 (45000): Some error
```
