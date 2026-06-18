#### 15.7.7.40 SHOW TABLES Statement

```
SHOW [EXTENDED] [FULL] TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

[`SHOW TABLES`](show-tables.html "15.7.7.40 SHOW TABLES Statement") lists the
non-`TEMPORARY` tables in a given database. You
can also get this list using the [**mysqlshow
*`db_name`***](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information") command. The
[`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates
which table names to match. The `WHERE` clause
can be given to select rows using more general conditions, as
discussed in [Section 28.8, “Extensions to SHOW Statements”](extended-show.html "28.8 Extensions to SHOW Statements").

Matching performed by the `LIKE` clause is
dependent on the setting of the
[`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) system
variable.

The optional `EXTENDED` modifier causes
[`SHOW TABLES`](show-tables.html "15.7.7.40 SHOW TABLES Statement") to list hidden tables
created by failed [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement")
statements. These temporary tables have names beginning with
`#sql` and can be dropped using
[`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement").

This statement also lists any views in the database. The
optional `FULL` modifier causes
[`SHOW TABLES`](show-tables.html "15.7.7.40 SHOW TABLES Statement") to display a second
output column with values of `BASE TABLE` for a
table, `VIEW` for a view, or `SYSTEM
VIEW` for an `INFORMATION_SCHEMA`
table.

If you have no privileges for a base table or view, it does not
show up in the output from [`SHOW
TABLES`](show-tables.html "15.7.7.40 SHOW TABLES Statement") or [**mysqlshow db\_name**](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information").

Table information is also available from the
`INFORMATION_SCHEMA`
[`TABLES`](information-schema-tables-table.html "28.3.44 The INFORMATION_SCHEMA TABLES Table") table. See
[Section 28.3.44, “The INFORMATION\_SCHEMA TABLES Table”](information-schema-tables-table.html "28.3.44 The INFORMATION_SCHEMA TABLES Table").