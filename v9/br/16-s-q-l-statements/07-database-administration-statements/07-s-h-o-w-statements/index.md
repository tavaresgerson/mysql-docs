### 15.7.7 Declarações `SHOW`

15.7.7.1 Declaração `SHOW BINARY LOG STATUS`

15.7.7.2 Declaração `SHOW BINARY LOGS`

15.7.7.3 Declaração `SHOW BINLOG EVENTS`

15.7.7.4 Declaração `SHOW CHARACTER SET`

15.7.7.5 Declaração `SHOW COLLATION`

15.7.7.6 Declaração `SHOW COLUMNS`

15.7.7.7 Declaração `SHOW CREATE DATABASE`

15.7.7.8 Declaração `SHOW CREATE EVENT`

15.7.7.9 Declaração `SHOW CREATE FUNCTION`

15.7.7.10 Declaração `SHOW CREATE LIBRARY`

15.7.7.11 Declaração `SHOW CREATE PROCEDURE`

15.7.7.12 Declaração `SHOW CREATE TABLE`

15.7.7.13 Declaração `SHOW CREATE TRIGGER`

15.7.7.14 Declaração `SHOW CREATE USER`

15.7.7.15 Declaração `SHOW CREATE VIEW`

15.7.7.16 Declaração `SHOW DATABASES`

15.7.7.17 Declaração `SHOW ENGINE`

15.7.7.18 Declaração `SHOW ENGINES`

15.7.7.19 Declaração `SHOW ERRORS`

15.7.7.20 Declaração `SHOW EVENTS`

15.7.7.21 Declaração `SHOW FUNCTION CODE`

15.7.7.22 Declaração `SHOW FUNCTION STATUS`

15.7.7.23 Declaração `SHOW GRANTS`

15.7.7.24 Declaração `SHOW INDEX`

15.7.7.25 Declaração `SHOW LIBRARY STATUS`

15.7.7.26 Declaração `SHOW OPEN TABLES`

15.7.7.27 Declaração `SHOW PARSE\_TREE`

15.7.7.28 Declaração `SHOW PLUGINS`

15.7.7.29 Declaração `SHOW PRIVILEGES`

15.7.7.30 Declaração `SHOW PROCEDURE CODE`

15.7.7.31 Declaração `SHOW PROCEDURE STATUS`

15.7.7.32 Declaração `SHOW PROCESSLIST`

15.7.7.33 Declaração `SHOW PROFILE`

15.7.7.34 Declaração `SHOW PROFILES`

15.7.7.35 Declaração `SHOW RELAYLOG EVENTS`

15.7.7.36 Declaração `SHOW REPLICA STATUS`

15.7.7.37 Declaração `SHOW REPLICAS`

15.7.7.38 Declaração `SHOW STATUS`

15.7.7.39 Declaração `SHOW TABLE STATUS`

15.7.7.40 Declaração `SHOW TABLES`

15.7.7.41 Declaração `SHOW TRIGGERS`

15.7.7.42 Declaração `SHOW VARIABLES`

15.7.7.43 Declaração `SHOW WARNINGS`

`SHOW` tem muitas formas que fornecem informações sobre bancos de dados, tabelas, colunas ou informações de status do servidor. Esta seção descreve as seguintes:

```
SHOW BINARY LOG STATUS
SHOW BINARY LOGS
SHOW BINLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW {CHARACTER SET | CHARSET} [like_or_where]
SHOW COLLATION [like_or_where]
SHOW [FULL] COLUMNS FROM tbl_name [FROM db_name] [like_or_where]
SHOW CREATE DATABASE db_name
SHOW CREATE EVENT event_name
SHOW CREATE FUNCTION func_name
SHOW CREATE PROCEDURE proc_name
SHOW CREATE TABLE tbl_name
SHOW CREATE TRIGGER trigger_name
SHOW CREATE VIEW view_name
SHOW DATABASES [like_or_where]
SHOW ENGINE engine_name {STATUS | MUTEX}
SHOW [STORAGE] ENGINES
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW EVENTS
SHOW FUNCTION CODE func_name
SHOW FUNCTION STATUS [like_or_where]
SHOW GRANTS FOR user
SHOW INDEX FROM tbl_name [FROM db_name]
SHOW OPEN TABLES [FROM db_name] [like_or_where]
SHOW PLUGINS
SHOW PROCEDURE CODE proc_name
SHOW PROCEDURE STATUS [like_or_where]
SHOW PRIVILEGES
SHOW [FULL] PROCESSLIST
SHOW PROFILE [types] [FOR QUERY n] [OFFSET n] [LIMIT n]
SHOW PROFILES
SHOW RELAYLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW REPLICA STATUS [FOR CHANNEL channel]
SHOW REPLICAS
SHOW [GLOBAL | SESSION] STATUS [like_or_where]
SHOW TABLE STATUS [FROM db_name] [like_or_where]
SHOW [FULL] TABLES [FROM db_name] [like_or_where]
SHOW TRIGGERS [FROM db_name] [like_or_where]
SHOW [GLOBAL | SESSION] VARIABLES [like_or_where]
SHOW WARNINGS [LIMIT [offset,] row_count]

like_or_where: {
    LIKE 'pattern'
  | WHERE expr
}
```

Se a sintaxe de uma declaração `SHOW` específica incluir uma parte `LIKE 'padrão'`, `'padrão'` é uma string que pode conter os caracteres de comodinho `%` e `_` do SQL. O padrão é útil para restringir a saída da declaração a valores que correspondem.

Várias declarações `SHOW` também aceitam uma cláusula `WHERE` que oferece mais flexibilidade na especificação de quais linhas exibir. Veja a Seção 28.8, “Extensões para Declarações SHOW”.

Nos resultados das declarações `SHOW`, os nomes de usuário e nomes de host são citados usando aspas (`).

Muitas APIs do MySQL (como o PHP) permitem que você trate o resultado retornado por uma declaração `SHOW` como se fosse um conjunto de resultados de uma consulta `SELECT`; veja o Capítulo 31, *Conectores e APIs*, ou consulte a documentação da sua API para mais informações. Além disso, você pode trabalhar em SQL com resultados de consultas em tabelas do banco de dados `INFORMATION_SCHEMA`, o que não é fácil de fazer com resultados de declarações `SHOW`. Veja o Capítulo 28, *Tabelas INFORMATION_SCHEMA*.