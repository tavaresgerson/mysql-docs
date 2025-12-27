### 13.7.5 SHOW Statements

[13.7.5.1 SHOW BINARY LOGS Statement](show-binary-logs.html)

[13.7.5.2 SHOW BINLOG EVENTS Statement](show-binlog-events.html)

[13.7.5.3 SHOW CHARACTER SET Statement](show-character-set.html)

[13.7.5.4 SHOW COLLATION Statement](show-collation.html)

[13.7.5.5 SHOW COLUMNS Statement](show-columns.html)

[13.7.5.6 SHOW CREATE DATABASE Statement](show-create-database.html)

[13.7.5.7 SHOW CREATE EVENT Statement](show-create-event.html)

[13.7.5.8 SHOW CREATE FUNCTION Statement](show-create-function.html)

[13.7.5.9 SHOW CREATE PROCEDURE Statement](show-create-procedure.html)

[13.7.5.10 SHOW CREATE TABLE Statement](show-create-table.html)

[13.7.5.11 SHOW CREATE TRIGGER Statement](show-create-trigger.html)

[13.7.5.12 SHOW CREATE USER Statement](show-create-user.html)

[13.7.5.13 SHOW CREATE VIEW Statement](show-create-view.html)

[13.7.5.14 SHOW DATABASES Statement](show-databases.html)

[13.7.5.15 SHOW ENGINE Statement](show-engine.html)

[13.7.5.16 SHOW ENGINES Statement](show-engines.html)

[13.7.5.17 SHOW ERRORS Statement](show-errors.html)

[13.7.5.18 SHOW EVENTS Statement](show-events.html)

[13.7.5.19 SHOW FUNCTION CODE Statement](show-function-code.html)

[13.7.5.20 SHOW FUNCTION STATUS Statement](show-function-status.html)

[13.7.5.21 SHOW GRANTS Statement](show-grants.html)

[13.7.5.22 SHOW INDEX Statement](show-index.html)

[13.7.5.23 SHOW MASTER STATUS Statement](show-master-status.html)

[13.7.5.24 SHOW OPEN TABLES Statement](show-open-tables.html)

[13.7.5.25 SHOW PLUGINS Statement](show-plugins.html)

[13.7.5.26 SHOW PRIVILEGES Statement](show-privileges.html)

[13.7.5.27 SHOW PROCEDURE CODE Statement](show-procedure-code.html)

[13.7.5.28 SHOW PROCEDURE STATUS Statement](show-procedure-status.html)

[13.7.5.29 SHOW PROCESSLIST Statement](show-processlist.html)

[13.7.5.30 SHOW PROFILE Statement](show-profile.html)

[13.7.5.31 SHOW PROFILES Statement](show-profiles.html)

[13.7.5.32 SHOW RELAYLOG EVENTS Statement](show-relaylog-events.html)

[13.7.5.33 SHOW SLAVE HOSTS Statement](show-slave-hosts.html)

[13.7.5.34 SHOW SLAVE STATUS Statement](show-slave-status.html)

[13.7.5.35 SHOW STATUS Statement](show-status.html)

[13.7.5.36 SHOW TABLE STATUS Statement](show-table-status.html)

[13.7.5.37 SHOW TABLES Statement](show-tables.html)

[13.7.5.38 SHOW TRIGGERS Statement](show-triggers.html)

[13.7.5.39 SHOW VARIABLES Statement](show-variables.html)

[13.7.5.40 SHOW WARNINGS Statement](show-warnings.html)

[`SHOW`](show.html "13.7.5 SHOW Statements") has many forms that provide information about databases, tables, columns, or status information about the server. This section describes those following:

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

If the syntax for a given [`SHOW`](show.html "13.7.5 SHOW Statements") statement includes a [`LIKE 'pattern'`](string-comparison-functions.html#operator_like) part, `'pattern'` is a string that can contain the SQL `%` and `_` wildcard characters. The pattern is useful for restricting statement output to matching values.

Several [`SHOW`](show.html "13.7.5 SHOW Statements") statements also accept a `WHERE` clause that provides more flexibility in specifying which rows to display. See [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

Many MySQL APIs (such as PHP) enable you to treat the result returned from a [`SHOW`](show.html "13.7.5 SHOW Statements") statement as you would a result set from a [`SELECT`](select.html "13.2.9 SELECT Statement"); see [Chapter 27, *Connectors and APIs*](connectors-apis.html "Chapter 27 Connectors and APIs"), or your API documentation for more information. In addition, you can work in SQL with results from queries on tables in the `INFORMATION_SCHEMA` database, which you cannot easily do with results from [`SHOW`](show.html "13.7.5 SHOW Statements") statements. See [Chapter 24, *INFORMATION\_SCHEMA Tables*](information-schema.html "Chapter 24 INFORMATION_SCHEMA Tables").
