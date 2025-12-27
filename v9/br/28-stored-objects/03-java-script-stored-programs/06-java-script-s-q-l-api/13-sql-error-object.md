#### 27.3.6.13 Objeto SqlError

Quando um `SqlError` é lançado, um erro é gerado no MySQL de forma semelhante à gerada por uma instrução `SIGNAL`. Você pode criar um `SqlError` usando o construtor mostrado aqui:

```
new SqlError(
  sql_state: Number,
  message: String,
  error_number: Number
)
```

O procedimento armazenado em JavaScript no exemplo a seguir tenta e lança um `SqlError` criado usando este construtor. A invocação do procedimento gera o erro, como pode ser visto aqui:

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

*`sql_state`* e *`error_number`* devem ser do tipo `Number`. O MLE lança uma exceção se qualquer um desses valores for `Infinity` ou `NaN`.

Você também pode invocar `SIGNAL` a partir do código de rotina em JavaScript para lançar uma exceção, de forma semelhante à mostrada aqui:

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