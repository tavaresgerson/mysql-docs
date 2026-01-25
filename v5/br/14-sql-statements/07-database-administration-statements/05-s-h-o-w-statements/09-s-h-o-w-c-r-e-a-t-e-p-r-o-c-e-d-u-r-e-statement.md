#### 13.7.5.9 Instrução SHOW CREATE PROCEDURE

```sql
SHOW CREATE PROCEDURE proc_name
```

Esta instrução é uma extensão do MySQL. Ela retorna a string exata que pode ser usada para recriar o procedimento armazenado nomeado. Uma instrução similar, [`SHOW CREATE FUNCTION`](show-create-function.html "13.7.5.8 SHOW CREATE FUNCTION Statement"), exibe informações sobre funções armazenadas (veja [Seção 13.7.5.8, “SHOW CREATE FUNCTION Statement”](show-create-function.html "13.7.5.8 SHOW CREATE FUNCTION Statement")).

Para usar qualquer uma das instruções, você deve ser o usuário nomeado na cláusula `DEFINER` da routine ou ter acesso `SELECT` à tabela `mysql.proc`. Se você não tiver privilégios para a routine em si, o valor exibido para a coluna `Create Procedure` ou `Create Function` é `NULL`.

```sql
mysql> SHOW CREATE PROCEDURE test.citycount\G
*************************** 1. row ***************************
           Procedure: citycount
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
    Create Procedure: CREATE DEFINER=`me`@`localhost`
                      PROCEDURE `citycount`(IN country CHAR(3), OUT cities INT)
                      BEGIN
                        SELECT COUNT(*) INTO cities FROM world.city
                        WHERE CountryCode = country;
                      END
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci

mysql> SHOW CREATE FUNCTION test.hello\G
*************************** 1. row ***************************
            Function: hello
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
     Create Function: CREATE DEFINER=`me`@`localhost`
                      FUNCTION `hello`(s CHAR(20))
                      RETURNS char(50) CHARSET latin1
                      DETERMINISTIC
                      RETURN CONCAT('Hello, ',s,'!')
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

`character_set_client` é o valor de sessão da variável de sistema [`character_set_client`](server-system-variables.html#sysvar_character_set_client) quando a routine foi criada. `collation_connection` é o valor de sessão da variável de sistema [`collation_connection`](server-system-variables.html#sysvar_collation_connection) quando a routine foi criada. `Database Collation` é a collation do Database à qual a routine está associada.