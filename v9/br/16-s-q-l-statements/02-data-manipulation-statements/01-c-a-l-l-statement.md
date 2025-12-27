### 15.2.1 Declaração `CALL`

```
CALL sp_name([parameter[,...]])
CALL sp_name[()]
```

A declaração `CALL` invoca um procedimento armazenado que foi definido anteriormente com `CREATE PROCEDURE`.

Procedimentos armazenados que não aceitam argumentos podem ser invocados sem parênteses. Ou seja, `CALL p()` e `CALL p` são equivalentes.

`CALL` pode retornar valores para o invocante usando parâmetros declarados como parâmetros `OUT` ou `INOUT`. Quando o procedimento retornar, um programa cliente também pode obter o número de linhas afetadas para a última instrução executada dentro da rotina: No nível SQL, chame a função `ROW_COUNT()`; a partir da API C, chame a função `mysql_affected_rows()`.

Para obter informações sobre o efeito das condições não tratadas nos parâmetros do procedimento, consulte a Seção 15.6.7.8, “Tratamento de Condições e Parâmetros `OUT` ou `INOUT`”.

Para obter um valor de um procedimento usando um parâmetro `OUT` ou `INOUT`, passe o parâmetro por meio de uma variável de usuário e, em seguida, verifique o valor da variável após o procedimento retornar. (Se você estiver chamando o procedimento a partir de outro procedimento armazenado ou função, também pode passar um parâmetro de rotina ou uma variável de rotina local como um parâmetro `IN` ou `INOUT`.) Para um parâmetro `INOUT`, inicie seu valor antes de passá-lo ao procedimento. O seguinte procedimento tem um parâmetro `OUT` que o procedimento define para a versão do servidor atual, e um valor `INOUT` que o procedimento incrementa em um de seu valor atual:

```
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

Antes de chamar o procedimento, inicie a variável a ser passada como o parâmetro `INOUT`. Após chamar o procedimento, você pode ver que os valores das duas variáveis são definidos ou modificados:

```
mysql> SET @increment = 10;
mysql> CALL p(@version, @increment);
mysql> SELECT @version, @increment;
+----------+------------+
| @version | @increment |
+----------+------------+
| 9.5.0   |         11 |
+----------+------------+
```

Em declarações `CALL` preparadas usadas com `PREPARE` e `EXECUTE`, podem ser usados marcadores para parâmetros `IN`, `OUT` e `INOUT`. Esses tipos de parâmetros podem ser usados da seguinte forma:

```
mysql> SET @increment = 10;
mysql> PREPARE s FROM 'CALL p(?, ?)';
mysql> EXECUTE s USING @version, @increment;
mysql> SELECT @version, @increment;
+----------+------------+
| @version | @increment |
+----------+------------+
| 9.5.0   |         11 |
+----------+------------+
```

Para escrever programas em C que usam a declaração `CALL` SQL para executar procedimentos armazenados que produzem conjuntos de resultados, a bandeira `CLIENT_MULTI_RESULTS` deve estar habilitada. Isso ocorre porque cada `CALL` retorna um resultado para indicar o status da chamada, além de quaisquer conjuntos de resultados que possam ser retornados por instruções executadas dentro do procedimento. `CLIENT_MULTI_RESULTS` também deve ser habilitado se `CALL` for usado para executar qualquer procedimento armazenado que contenha instruções preparadas. Não pode ser determinado quando um procedimento é carregado se essas instruções produzem conjuntos de resultados, então é necessário assumir que elas o fazem.

`CLIENT_MULTI_RESULTS` pode ser habilitado quando você chama `mysql_real_connect()`, seja explicitamente passando a própria bandeira `CLIENT_MULTI_RESULTS`, ou implicitamente passando `CLIENT_MULTI_STATEMENTS` (que também habilita `CLIENT_MULTI_RESULTS`). `CLIENT_MULTI_RESULTS` está habilitado por padrão.

Para processar o resultado de uma declaração `CALL` executada usando `mysql_query()` ou `mysql_real_query()`, use um loop que chama `mysql_next_result()` para determinar se há mais resultados. Para um exemplo, veja Suporte à Execução de Instruções Múltiplas.

Os programas em C podem usar a interface de declaração preparada para executar declarações `CALL` e acessar os parâmetros `OUT` e `INOUT`. Isso é feito processando o resultado de uma declaração `CALL` usando um loop que chama `mysql_stmt_next_result()` para determinar se há mais resultados. Para um exemplo, veja Suporte a Declarações `CALL` Preparadas. Linguagens que fornecem uma interface MySQL podem usar declarações `CALL` preparadas para recuperar diretamente os parâmetros de procedimento `OUT` e `INOUT`.

Alterações de metadados em objetos referenciados por programas armazenados são detectadas e causam a reparsa automática das declarações afetadas quando o programa é executado novamente. Para mais informações, consulte Seção 10.10.3, “Cache de Declarações Preparadas e Programas Armazenados”.