#### 13.7.5.9 SHOW CREATE PROCEDURE Statement

```sql
SHOW CREATE PROCEDURE proc_name
```

This statement is a MySQL extension. It returns the exact string that can be used to re-create the named stored procedure. A similar statement, [`SHOW CREATE FUNCTION`](show-create-function.html "13.7.5.8 SHOW CREATE FUNCTION Statement"), displays information about stored functions (see [Section 13.7.5.8, “SHOW CREATE FUNCTION Statement”](show-create-function.html "13.7.5.8 SHOW CREATE FUNCTION Statement")).

To use either statement, you must be the user named in the routine `DEFINER` clause or have [`SELECT`](select.html "13.2.9 SELECT Statement") access to the `mysql.proc` table. If you do not have privileges for the routine itself, the value displayed for the `Create Procedure` or `Create Function` column is `NULL`.

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

`character_set_client` is the session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the routine was created. `collation_connection` is the session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the routine was created. `Database Collation` is the collation of the database with which the routine is associated.
