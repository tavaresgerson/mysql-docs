### 15.7.7 SHOW Statements

15.7.7.1 SHOW BINARY LOG STATUS Statement

15.7.7.2 SHOW BINARY LOGS Statement

15.7.7.3 SHOW BINLOG EVENTS Statement

15.7.7.4 SHOW CHARACTER SET Statement

15.7.7.5 SHOW COLLATION Statement

15.7.7.6 SHOW COLUMNS Statement

15.7.7.7 SHOW CREATE DATABASE Statement

15.7.7.8 SHOW CREATE EVENT Statement

15.7.7.9 SHOW CREATE FUNCTION Statement

15.7.7.10 SHOW CREATE LIBRARY Statement

15.7.7.11 SHOW CREATE PROCEDURE Statement

15.7.7.12 SHOW CREATE TABLE Statement

15.7.7.13 SHOW CREATE TRIGGER Statement

15.7.7.14 SHOW CREATE USER Statement

15.7.7.15 SHOW CREATE VIEW Statement

15.7.7.16 SHOW DATABASES Statement

15.7.7.17 SHOW ENGINE Statement

15.7.7.18 SHOW ENGINES Statement

15.7.7.19 SHOW ERRORS Statement

15.7.7.20 SHOW EVENTS Statement

15.7.7.21 SHOW FUNCTION CODE Statement

15.7.7.22 SHOW FUNCTION STATUS Statement

15.7.7.23 SHOW GRANTS Statement

15.7.7.24 SHOW INDEX Statement

15.7.7.25 SHOW LIBRARY STATUS Statement

15.7.7.26 SHOW OPEN TABLES Statement

15.7.7.27 SHOW PARSE_TREE Statement

15.7.7.28 SHOW PLUGINS Statement

15.7.7.29 SHOW PRIVILEGES Statement

15.7.7.30 SHOW PROCEDURE CODE Statement

15.7.7.31 SHOW PROCEDURE STATUS Statement

15.7.7.32 SHOW PROCESSLIST Statement

15.7.7.33 SHOW PROFILE Statement

15.7.7.34 SHOW PROFILES Statement

15.7.7.35 SHOW RELAYLOG EVENTS Statement

15.7.7.36 SHOW REPLICA STATUS Statement

15.7.7.37 SHOW REPLICAS Statement

15.7.7.38 SHOW STATUS Statement

15.7.7.39 SHOW TABLE STATUS Statement

15.7.7.40 SHOW TABLES Statement

15.7.7.41 SHOW TRIGGERS Statement

15.7.7.42 SHOW VARIABLES Statement

15.7.7.43 SHOW WARNINGS Statement

`SHOW` has many forms that provide information about databases, tables, columns, or status information about the server. This section describes those following:

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

If the syntax for a given `SHOW` statement includes a `LIKE 'pattern'` part, `'pattern'` is a string that can contain the SQL `%` and `_` wildcard characters. The pattern is useful for restricting statement output to matching values.

Several `SHOW` statements also accept a `WHERE` clause that provides more flexibility in specifying which rows to display. See Section 28.8, “Extensions to SHOW Statements”.

In `SHOW` statement results, user names and host names are quoted using backticks (`).

Many MySQL APIs (such as PHP) enable you to treat the result returned from a `SHOW` statement as you would a result set from a `SELECT`; see Chapter 31, *Connectors and APIs*, or your API documentation for more information. In addition, you can work in SQL with results from queries on tables in the `INFORMATION_SCHEMA` database, which you cannot easily do with results from `SHOW` statements. See Chapter 28, *INFORMATION_SCHEMA Tables*.
