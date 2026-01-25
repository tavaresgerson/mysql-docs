### 13.2.1 Statement CALL

```sql
CALL sp_name([parameter[,...)
CALL sp_name[()]
```

O statement [`CALL`](call.html "13.2.1 CALL Statement") invoca um *procedimento armazenado* (*stored procedure*) que foi definido previamente com [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").

*Procedimentos armazenados* que não aceitam argumentos podem ser invocados sem parênteses. Ou seja, `CALL p()` e `CALL p` são equivalentes.

O [`CALL`](call.html "13.2.1 CALL Statement") pode retornar valores ao seu chamador usando *parameters* que são declarados como *parameters* `OUT` ou `INOUT`. Quando o *procedure* retorna, um programa *client* pode também obter o número de *rows affected* (linhas afetadas) para o *statement* final executado dentro da rotina: No nível SQL, chame a *function* [`ROW_COUNT()`](information-functions.html#function_row-count); a partir da C API, chame a *function* [`mysql_affected_rows()`](/doc/c-api/5.7/en/mysql-affected-rows.html).

Para informações sobre o efeito de *conditions* não tratadas em *parameters* de *procedure*, veja [Section 13.6.7.8, “Condition Handling and OUT or INOUT Parameters”](conditions-and-parameters.html "13.6.7.8 Condition Handling and OUT or INOUT Parameters").

Para obter um valor de um *procedure* usando um *parameter* `OUT` ou `INOUT`, passe o *parameter* por meio de uma variável de usuário e, em seguida, verifique o valor da variável após o *procedure* retornar. (Se você estiver chamando o *procedure* de dentro de outro *procedimento armazenado* ou *function*, você também pode passar um *parameter* de rotina ou uma variável de rotina local como um *parameter* `IN` ou `INOUT`.) Para um *parameter* `INOUT`, inicialize seu valor antes de passá-lo para o *procedure*. O *procedure* a seguir possui um *parameter* `OUT` que ele define para a versão atual do *server*, e um valor `INOUT` que o *procedure* incrementa em um a partir de seu valor atual:

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

Antes de chamar o *procedure*, inicialize a variável a ser passada como o *parameter* `INOUT`. Após chamar o *procedure*, os valores das duas variáveis foram definidos ou modificados:

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

Em *prepared statements* [`CALL`](call.html "13.2.1 CALL Statement") usados com [`PREPARE`](prepare.html "13.5.1 PREPARE Statement") e [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement"), *placeholders* podem ser usados para *parameters* `IN`, `OUT` e `INOUT`. Esses tipos de *parameters* podem ser usados da seguinte forma:

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

Para escrever programas C que utilizam o *statement* SQL [`CALL`](call.html "13.2.1 CALL Statement") para executar *procedimentos armazenados* que produzem *result sets*, o *flag* `CLIENT_MULTI_RESULTS` deve ser habilitado. Isso ocorre porque cada [`CALL`](call.html "13.2.1 CALL Statement") retorna um resultado para indicar o *status* da chamada, além de quaisquer *result sets* que possam ser retornados por *statements* executados dentro do *procedure*. `CLIENT_MULTI_RESULTS` também deve ser habilitado se [`CALL`](call.html "13.2.1 CALL Statement") for usado para executar qualquer *procedimento armazenado* que contenha *prepared statements*. Não é possível determinar quando tal *procedure* é carregado se esses *statements* produzem *result sets*, portanto é necessário assumir que sim.

`CLIENT_MULTI_RESULTS` pode ser habilitado ao chamar [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html), seja explicitamente passando o próprio *flag* `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (o que também habilita `CLIENT_MULTI_RESULTS`). `CLIENT_MULTI_RESULTS` é habilitado por padrão.

Para processar o resultado de um *statement* [`CALL`](call.html "13.2.1 CALL Statement") executado usando [`mysql_query()`](/doc/c-api/5.7/en/mysql-query.html) ou [`mysql_real_query()`](/doc/c-api/5.7/en/mysql-real-query.html), use um *loop* que chama [`mysql_next_result()`](/doc/c-api/5.7/en/mysql-next-result.html) para determinar se há mais resultados. Para um exemplo, veja [Multiple Statement Execution Support](/doc/c-api/5.7/en/c-api-multiple-queries.html).

Programas C podem usar a *interface* de *prepared statement* para executar *statements* [`CALL`](call.html "13.2.1 CALL Statement") e acessar *parameters* `OUT` e `INOUT`. Isso é feito processando o resultado de um *statement* [`CALL`](call.html "13.2.1 CALL Statement") usando um *loop* que chama [`mysql_stmt_next_result()`](/doc/c-api/5.7/en/mysql-stmt-next-result.html) para determinar se há mais resultados. Para um exemplo, veja [Prepared CALL Statement Support](/doc/c-api/5.7/en/c-api-prepared-call-statements.html). Linguagens que fornecem uma *interface* MySQL podem usar *prepared statements* [`CALL`](call.html "13.2.1 CALL Statement") para recuperar diretamente os *parameters* `OUT` e `INOUT` do *procedure*.

Alterações de *metadata* em objetos referenciados por programas armazenados são detectadas e causam a reanálise automática (*reparsing*) dos *statements* afetados na próxima vez que o programa for executado. Para mais informações, veja [Section 8.10.4, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "8.10.4 Caching of Prepared Statements and Stored Programs").