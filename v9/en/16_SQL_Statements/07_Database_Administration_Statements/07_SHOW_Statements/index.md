### 15.7.7 SHOW Statements

[15.7.7.1 SHOW BINARY LOG STATUS Statement](show-binary-log-status.html)

[15.7.7.2 SHOW BINARY LOGS Statement](show-binary-logs.html)

[15.7.7.3 SHOW BINLOG EVENTS Statement](show-binlog-events.html)

[15.7.7.4 SHOW CHARACTER SET Statement](show-character-set.html)

[15.7.7.5 SHOW COLLATION Statement](show-collation.html)

[15.7.7.6 SHOW COLUMNS Statement](show-columns.html)

[15.7.7.7 SHOW CREATE DATABASE Statement](show-create-database.html)

[15.7.7.8 SHOW CREATE EVENT Statement](show-create-event.html)

[15.7.7.9 SHOW CREATE FUNCTION Statement](show-create-function.html)

[15.7.7.10 SHOW CREATE LIBRARY Statement](show-create-library.html)

[15.7.7.11 SHOW CREATE PROCEDURE Statement](show-create-procedure.html)

[15.7.7.12 SHOW CREATE TABLE Statement](show-create-table.html)

[15.7.7.13 SHOW CREATE TRIGGER Statement](show-create-trigger.html)

[15.7.7.14 SHOW CREATE USER Statement](show-create-user.html)

[15.7.7.15 SHOW CREATE VIEW Statement](show-create-view.html)

[15.7.7.16 SHOW DATABASES Statement](show-databases.html)

[15.7.7.17 SHOW ENGINE Statement](show-engine.html)

[15.7.7.18 SHOW ENGINES Statement](show-engines.html)

[15.7.7.19 SHOW ERRORS Statement](show-errors.html)

[15.7.7.20 SHOW EVENTS Statement](show-events.html)

[15.7.7.21 SHOW FUNCTION CODE Statement](show-function-code.html)

[15.7.7.22 SHOW FUNCTION STATUS Statement](show-function-status.html)

[15.7.7.23 SHOW GRANTS Statement](show-grants.html)

[15.7.7.24 SHOW INDEX Statement](show-index.html)

[15.7.7.25 SHOW LIBRARY STATUS Statement](show-library-status.html)

[15.7.7.26 SHOW OPEN TABLES Statement](show-open-tables.html)

[15.7.7.27 SHOW PARSE\_TREE Statement](show-parse-tree.html)

[15.7.7.28 SHOW PLUGINS Statement](show-plugins.html)

[15.7.7.29 SHOW PRIVILEGES Statement](show-privileges.html)

[15.7.7.30 SHOW PROCEDURE CODE Statement](show-procedure-code.html)

[15.7.7.31 SHOW PROCEDURE STATUS Statement](show-procedure-status.html)

[15.7.7.32 SHOW PROCESSLIST Statement](show-processlist.html)

[15.7.7.33 SHOW PROFILE Statement](show-profile.html)

[15.7.7.34 SHOW PROFILES Statement](show-profiles.html)

[15.7.7.35 SHOW RELAYLOG EVENTS Statement](show-relaylog-events.html)

[15.7.7.36 SHOW REPLICA STATUS Statement](show-replica-status.html)

[15.7.7.37 SHOW REPLICAS Statement](show-replicas.html)

[15.7.7.38 SHOW STATUS Statement](show-status.html)

[15.7.7.39 SHOW TABLE STATUS Statement](show-table-status.html)

[15.7.7.40 SHOW TABLES Statement](show-tables.html)

[15.7.7.41 SHOW TRIGGERS Statement](show-triggers.html)

[15.7.7.42 SHOW VARIABLES Statement](show-variables.html)

[15.7.7.43 SHOW WARNINGS Statement](show-warnings.html)

[`SHOW`](show.html "15.7.7 SHOW Statements") has many forms that provide
information about databases, tables, columns, or status
information about the server. This section describes those
following:

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

If the syntax for a given [`SHOW`](show.html "15.7.7 SHOW Statements")
statement includes a [`LIKE
'pattern'`](string-comparison-functions.html#operator_like) part,
`'pattern'` is a
string that can contain the SQL `%` and
`_` wildcard characters. The pattern is useful
for restricting statement output to matching values.

Several [`SHOW`](show.html "15.7.7 SHOW Statements") statements also accept
a `WHERE` clause that provides more flexibility
in specifying which rows to display. See
[Section 28.8, “Extensions to SHOW Statements”](extended-show.html "28.8 Extensions to SHOW Statements").

In [`SHOW`](show.html "15.7.7 SHOW Statements") statement results, user
names and host names are quoted using backticks (`).

Many MySQL APIs (such as PHP) enable you to treat the result
returned from a [`SHOW`](show.html "15.7.7 SHOW Statements") statement as
you would a result set from a
[`SELECT`](select.html "15.2.13 SELECT Statement"); see
[Chapter 31, *Connectors and APIs*](connectors-apis.html "Chapter 31 Connectors and APIs"), or your API documentation for
more information. In addition, you can work in SQL with results
from queries on tables in the
`INFORMATION_SCHEMA` database, which you cannot
easily do with results from [`SHOW`](show.html "15.7.7 SHOW Statements")
statements. See [Chapter 28, *INFORMATION\_SCHEMA Tables*](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables").