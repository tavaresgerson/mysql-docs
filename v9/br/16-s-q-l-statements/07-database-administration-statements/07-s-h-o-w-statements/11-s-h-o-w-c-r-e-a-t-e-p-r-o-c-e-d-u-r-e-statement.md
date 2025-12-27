#### 15.7.7.11 Declaração `SHOW CREATE PROCEDURE`

```
SHOW CREATE PROCEDURE proc_name
```

Esta declaração é uma extensão do MySQL. Ela retorna a string exata que pode ser usada para recriar o procedimento armazenado nomeado. Uma declaração semelhante, `SHOW CREATE FUNCTION`, exibe informações sobre funções armazenadas (veja a Seção 15.7.7.9, “Declaração `SHOW CREATE FUNCTION`”).

Para usar qualquer uma dessas declarações, você deve ser o usuário nomeado como a rotina `DEFINER`, ter o privilégio `SHOW_ROUTINE`, ter o privilégio `SELECT` no nível global ou ter o privilégio `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE` concedido em um escopo que inclua a rotina. O valor exibido para o campo `Create Procedure` ou `Create Function` é `NULL` se você tiver apenas `CREATE ROUTINE`, `ALTER ROUTINE` ou `EXECUTE`.

```
mysql> SHOW CREATE PROCEDURE test.citycount\G
*************************** 1. row ***************************
           Procedure: citycount
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
    Create Procedure: CREATE DEFINER=`me`@`localhost`
                      PROCEDURE `citycount`(IN country CHAR(3), OUT cities INT)
                      BEGIN
                        SELECT COUNT(*) INTO cities FROM world.city
                        WHERE CountryCode = country;
                      END
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci

mysql> SHOW CREATE FUNCTION test.hello\G
*************************** 1. row ***************************
            Function: hello
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
     Create Function: CREATE DEFINER=`me`@`localhost`
                      FUNCTION `hello`(s CHAR(20))
                      RETURNS char(50) CHARSET utf8mb4
                      DETERMINISTIC
                      RETURN CONCAT('Hello, ',s,'!')
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

`character_set_client` é o valor de sessão da variável de sistema `character_set_client` quando a rotina foi criada. `collation_connection` é o valor de sessão da variável de sistema `collation_connection` quando a rotina foi criada. `Database Collation` é a collation do banco de dados com o qual a rotina está associada.

Para uma rotina armazenada em JavaScript que foi criada com `USING` para importar uma ou mais bibliotecas, a lista completa das bibliotecas está incluída na saída de `SHOW CREATE PROCEDURE`, mesmo para bibliotecas listadas que não existem na realidade. Isso também é verdadeiro para `SHOW CREATE FUNCTION`.