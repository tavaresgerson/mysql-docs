#### 13.7.5.9 Declaração `SHOW CREATE PROCEDURE`

```sql
SHOW CREATE PROCEDURE proc_name
```

Esta declaração é uma extensão do MySQL. Ela retorna a string exata que pode ser usada para recriar o procedimento armazenado nomeado. Uma declaração semelhante, `SHOW CREATE FUNCTION`, exibe informações sobre funções armazenadas (consulte Seção 13.7.5.8, “Declaração SHOW CREATE FUNCTION”).

Para usar qualquer uma dessas declarações, você deve ser o usuário nomeado na cláusula da rotina `DEFINER` ou ter acesso à tabela `mysql.proc` com o comando `SELECT`. Se você não tiver privilégios para a própria rotina, o valor exibido para a coluna `Criar Procedimento` ou `Criar Função` será `NULL`.

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

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando a rotina foi criada. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando a rotina foi criada. `Database Collation` é a collation do banco de dados com o qual a rotina está associada.
