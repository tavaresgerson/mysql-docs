### 13.2.1 Statement CALL

```sql
CALL sp_name([parameter[,...)
CALL sp_name[()]
```

O statement `CALL` invoca um *procedimento armazenado* (*stored procedure*) que foi definido previamente com `CREATE PROCEDURE`.

*Procedimentos armazenados* que não aceitam argumentos podem ser invocados sem parênteses. Ou seja, `CALL p()` e `CALL p` são equivalentes.

O `CALL` pode retornar valores ao seu chamador usando *parameters* que são declarados como *parameters* `OUT` ou `INOUT`. Quando o *procedure* retorna, um programa *client* pode também obter o número de *rows affected* (linhas afetadas) para o *statement* final executado dentro da rotina: No nível SQL, chame a *function* `ROW_COUNT()`; a partir da C API, chame a *function* `mysql_affected_rows()`.

Para informações sobre o efeito de *conditions* não tratadas em *parameters* de *procedure*, veja Section 13.6.7.8, “Condition Handling and OUT or INOUT Parameters”.

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

Em *prepared statements* `CALL` usados com `PREPARE` e `EXECUTE`, *placeholders* podem ser usados para *parameters* `IN`, `OUT` e `INOUT`. Esses tipos de *parameters* podem ser usados da seguinte forma:

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

Para escrever programas C que utilizam o *statement* SQL `CALL` para executar *procedimentos armazenados* que produzem *result sets*, o *flag* `CLIENT_MULTI_RESULTS` deve ser habilitado. Isso ocorre porque cada `CALL` retorna um resultado para indicar o *status* da chamada, além de quaisquer *result sets* que possam ser retornados por *statements* executados dentro do *procedure*. `CLIENT_MULTI_RESULTS` também deve ser habilitado se `CALL` for usado para executar qualquer *procedimento armazenado* que contenha *prepared statements*. Não é possível determinar quando tal *procedure* é carregado se esses *statements* produzem *result sets*, portanto é necessário assumir que sim.

`CLIENT_MULTI_RESULTS` pode ser habilitado ao chamar `mysql_real_connect()`, seja explicitamente passando o próprio *flag* `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (o que também habilita `CLIENT_MULTI_RESULTS`). `CLIENT_MULTI_RESULTS` é habilitado por padrão.

Para processar o resultado de um *statement* `CALL` executado usando `mysql_query()` ou `mysql_real_query()`, use um *loop* que chama `mysql_next_result()` para determinar se há mais resultados. Para um exemplo, veja Multiple Statement Execution Support.

Programas C podem usar a *interface* de *prepared statement* para executar *statements* `CALL` e acessar *parameters* `OUT` e `INOUT`. Isso é feito processando o resultado de um *statement* `CALL` usando um *loop* que chama `mysql_stmt_next_result()` para determinar se há mais resultados. Para um exemplo, veja Prepared CALL Statement Support. Linguagens que fornecem uma *interface* MySQL podem usar *prepared statements* `CALL` para recuperar diretamente os *parameters* `OUT` e `INOUT` do *procedure*.

Alterações de *metadata* em objetos referenciados por programas armazenados são detectadas e causam a reanálise automática (*reparsing*) dos *statements* afetados na próxima vez que o programa for executado. Para mais informações, veja Section 8.10.4, “Caching of Prepared Statements and Stored Programs”.