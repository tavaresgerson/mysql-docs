#### 13.7.5.14 SHOW DATABASES Statement

```sql
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

[`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") lists the databases on the MySQL server host. [`SHOW SCHEMAS`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") is a synonym for [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which database names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

You see only those databases for which you have some kind of privilege, unless you have the global [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") privilege. You can also get this list using the [**mysqlshow**](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information") command.

If the server was started with the [`--skip-show-database`](server-options.html#option_mysqld_skip-show-database) option, you cannot use this statement at all unless you have the [`SHOW DATABASES`](privileges-provided.html#priv_show-databases) privilege.

MySQL implements databases as directories in the data directory, so this statement simply lists directories in that location. However, the output may include names of directories that do not correspond to actual databases.

Database information is also available from the `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table. See [Section 24.3.22, “The INFORMATION\_SCHEMA SCHEMATA Table”](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table").

Caution

Because a global privilege is considered a privilege for all databases, *any* global privilege enables a user to see all database names with [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") or by examining the `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table.
