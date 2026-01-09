### 7.6.5 The ddl_rewriter Plugin

7.6.5.1 Installing or Uninstalling ddl_rewriter

7.6.5.2 ddl_rewriter Plugin Options

MySQL 9.5 includes a `ddl_rewriter` plugin that modifies `CREATE TABLE` statements received by the server before it parses and executes them. The plugin removes `ENCRYPTION`, `DATA DIRECTORY`, and `INDEX DIRECTORY` clauses, which may be helpful when restoring tables from SQL dump files created from databases that are encrypted or that have their tables stored outside the data directory. For example, the plugin may enable restoring such dump files into an unencrypted instance or in an environment where the paths outside the data directory are not accessible.

Before using the `ddl_rewriter` plugin, install it according to the instructions provided in Section 7.6.5.1, “Installing or Uninstalling ddl_rewriter”.

`ddl_rewriter` examines SQL statements received by the server prior to parsing, rewriting them according to these conditions:

* `ddl_rewriter` considers only `CREATE TABLE` statements, and only if they are standalone statements that occur at the beginning of an input line or at the beginning of prepared statement text. `ddl_rewriter` does not consider `CREATE TABLE` statements within stored program definitions. Statements can extend over multiple lines.

* Within statements considered for rewrite, instances of the following clauses are rewritten and each instance replaced by a single space:

  + `ENCRYPTION`
  + `DATA DIRECTORY` (at the table and partition levels)

  + `INDEX DIRECTORY` (at the table and partition levels)

* Rewriting does not depend on lettercase.

If `ddl_rewriter` rewrites a statement, it generates a warning:

```
mysql> CREATE TABLE t (i INT) DATA DIRECTORY '/var/mysql/data';
Query OK, 0 rows affected, 1 warning (0.03 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'CREATE TABLE t (i INT) DATA DIRECTORY '/var/mysql/data''
         rewritten to 'CREATE TABLE t (i INT) ' by a query rewrite plugin
1 row in set (0.00 sec)
```

If the general query log or binary log is enabled, the server writes to it statements as they appear after any rewriting by `ddl_rewriter`.

When installed, `ddl_rewriter` exposes the Performance Schema `memory/rewriter/ddl_rewriter` instrument for tracking plugin memory use. See Section 29.12.20.10, “Memory Summary Tables”
