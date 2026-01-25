### 13.7.5 Instruções SHOW

[13.7.5.1 Instrução SHOW BINARY LOGS](show-binary-logs.html)

[13.7.5.2 Instrução SHOW BINLOG EVENTS](show-binlog-events.html)

[13.7.5.3 Instrução SHOW CHARACTER SET](show-character-set.html)

[13.7.5.4 Instrução SHOW COLLATION](show-collation.html)

[13.7.5.5 Instrução SHOW COLUMNS](show-columns.html)

[13.7.5.6 Instrução SHOW CREATE DATABASE](show-create-database.html)

[13.7.5.7 Instrução SHOW CREATE EVENT](show-create-event.html)

[13.7.5.8 Instrução SHOW CREATE FUNCTION](show-create-function.html)

[13.7.5.9 Instrução SHOW CREATE PROCEDURE](show-create-procedure.html)

[13.7.5.10 Instrução SHOW CREATE TABLE](show-create-table.html)

[13.7.5.11 Instrução SHOW CREATE TRIGGER](show-create-trigger.html)

[13.7.5.12 Instrução SHOW CREATE USER](show-create-user.html)

[13.7.5.13 Instrução SHOW CREATE VIEW](show-create-view.html)

[13.7.5.14 Instrução SHOW DATABASES](show-databases.html)

[13.7.5.15 Instrução SHOW ENGINE](show-engine.html)

[13.7.5.16 Instrução SHOW ENGINES](show-engines.html)

[13.7.5.17 Instrução SHOW ERRORS](show-errors.html)

[13.7.5.18 Instrução SHOW EVENTS](show-events.html)

[13.7.5.19 Instrução SHOW FUNCTION CODE](show-function-code.html)

[13.7.5.20 Instrução SHOW FUNCTION STATUS](show-function-status.html)

[13.7.5.21 Instrução SHOW GRANTS](show-grants.html)

[13.7.5.22 Instrução SHOW INDEX](show-index.html)

[13.7.5.23 Instrução SHOW MASTER STATUS](show-master-status.html)

[13.7.5.24 Instrução SHOW OPEN TABLES](show-open-tables.html)

[13.7.5.25 Instrução SHOW PLUGINS](show-plugins.html)

[13.7.5.26 Instrução SHOW PRIVILEGES](show-privileges.html)

[13.7.5.27 Instrução SHOW PROCEDURE CODE](show-procedure-code.html)

[13.7.5.28 Instrução SHOW PROCEDURE STATUS](show-procedure-status.html)

[13.7.5.29 Instrução SHOW PROCESSLIST](show-processlist.html)

[13.7.5.30 Instrução SHOW PROFILE](show-profile.html)

[13.7.5.31 Instrução SHOW PROFILES](show-profiles.html)

[13.7.5.32 Instrução SHOW RELAYLOG EVENTS](show-relaylog-events.html)

[13.7.5.33 Instrução SHOW SLAVE HOSTS](show-slave-hosts.html)

[13.7.5.34 Instrução SHOW SLAVE STATUS](show-slave-status.html)

[13.7.5.35 Instrução SHOW STATUS](show-status.html)

[13.7.5.36 Instrução SHOW TABLE STATUS](show-table-status.html)

[13.7.5.37 Instrução SHOW TABLES](show-tables.html)

[13.7.5.38 Instrução SHOW TRIGGERS](show-triggers.html)

[13.7.5.39 Instrução SHOW VARIABLES](show-variables.html)

[13.7.5.40 Instrução SHOW WARNINGS](show-warnings.html)

A instrução [`SHOW`](show.html "13.7.5 Instruções SHOW") possui muitas formas que fornecem informações sobre Databases, tables, columns, ou informações de status sobre o server. Esta seção descreve as seguintes:

```sql
SHOW {BINARY | MASTER} LOGS
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
SHOW MASTER STATUS
SHOW OPEN TABLES [FROM db_name] [like_or_where]
SHOW PLUGINS
SHOW PROCEDURE CODE proc_name
SHOW PROCEDURE STATUS [like_or_where]
SHOW PRIVILEGES
SHOW [FULL] PROCESSLIST
SHOW PROFILE [types] [FOR QUERY n] [OFFSET n] [LIMIT n]
SHOW PROFILES
SHOW RELAYLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW SLAVE HOSTS
SHOW SLAVE STATUS [FOR CHANNEL channel]
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

Se a sintaxe para uma determinada instrução [`SHOW`](show.html "13.7.5 Instruções SHOW") incluir uma parte [`LIKE 'pattern'`](string-comparison-functions.html#operator_like), `'pattern'` é uma string que pode conter os caracteres curinga SQL `%` e `_`. O pattern é útil para restringir a saída da instrução a valores correspondentes.

Diversas instruções [`SHOW`](show.html "13.7.5 Instruções SHOW") também aceitam uma cláusula `WHERE` que oferece mais flexibilidade ao especificar quais rows exibir. Consulte [Seção 24.8, “Extensões às Instruções SHOW”](extended-show.html "24.8 Extensões às Instruções SHOW").

Muitas APIs MySQL (como PHP) permitem tratar o resultado retornado de uma instrução [`SHOW`](show.html "13.7.5 Instruções SHOW") como você trataria um result set de uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement"); consulte [Capítulo 27, *Connectors and APIs*](connectors-apis.html "Chapter 27 Connectors and APIs"), ou a documentação de sua API para mais informações. Além disso, você pode trabalhar em SQL com resultados de Queries em tables no Database `INFORMATION_SCHEMA`, o que não é facilmente possível com resultados de instruções [`SHOW`](show.html "13.7.5 Instruções SHOW"). Consulte [Capítulo 24, *Tabelas INFORMATION_SCHEMA*](information-schema.html "Chapter 24 INFORMATION_SCHEMA Tables").