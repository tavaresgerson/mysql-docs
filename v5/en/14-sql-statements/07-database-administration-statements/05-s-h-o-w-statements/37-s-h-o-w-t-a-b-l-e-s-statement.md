#### 13.7.5.37 SHOW TABLES Statement

```sql
SHOW [FULL] TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

[`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") lists the non-`TEMPORARY` tables in a given database. You can also get this list using the [**mysqlshow *`db_name`***](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information") command. The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which table names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

Matching performed by the `LIKE` clause is dependent on the setting of the [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) system variable.

This statement also lists any views in the database. The optional `FULL` modifier causes [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") to display a second output column with values of `BASE TABLE` for a table, `VIEW` for a view, or `SYSTEM VIEW` for an `INFORMATION_SCHEMA` table.

If you have no privileges for a base table or view, it does not show up in the output from [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") or [**mysqlshow db_name**](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information").

Table information is also available from the `INFORMATION_SCHEMA` [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") table. See [Section 24.3.25, “The INFORMATION_SCHEMA TABLES Table”](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table").
