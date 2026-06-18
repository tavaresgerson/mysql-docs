## 28.1 Introduction

`INFORMATION_SCHEMA` provides access to database
metadata, information about
the MySQL server such as the name of a database or table, the data
type of a column, or access privileges. Other terms that are
sometimes used for this information are
data dictionary and
system catalog.

* [INFORMATION\_SCHEMA Usage Notes](information-schema-introduction.html#information-schema-usage-notes "INFORMATION_SCHEMA Usage Notes")
* [Character Set Considerations](information-schema-introduction.html#information-schema-character-set-considerations "Character Set Considerations")
* [INFORMATION\_SCHEMA as Alternative to SHOW Statements](information-schema-introduction.html#information-schema-as-show-alternative "INFORMATION_SCHEMA as Alternative to SHOW Statements")
* [INFORMATION\_SCHEMA and Privileges](information-schema-introduction.html#information-schema-privileges "INFORMATION_SCHEMA and Privileges")
* [Performance Considerations](information-schema-introduction.html#information-schema-performance-considerations "Performance Considerations")
* [Standards Considerations](information-schema-introduction.html#information-schema-standards-considerations "Standards Considerations")
* [Conventions in the INFORMATION\_SCHEMA Reference Sections](information-schema-introduction.html#information-schema-conventions "Conventions in the INFORMATION_SCHEMA Reference Sections")
* [Related Information](information-schema-introduction.html#information-schema-related-information "Related Information")

### INFORMATION\_SCHEMA Usage Notes

`INFORMATION_SCHEMA` is a database within each
MySQL instance, the place that stores information about all the
other databases that the MySQL server maintains. The
`INFORMATION_SCHEMA` database contains several
read-only tables. They are actually views, not base tables, so
there are no files associated with them, and you cannot set
triggers on them. Also, there is no database directory with that
name.

Although you can select `INFORMATION_SCHEMA` as
the default database with a [`USE`](use.html "15.8.4 USE Statement")
statement, you can only read the contents of tables, not perform
[`INSERT`](insert.html "15.2.7 INSERT Statement"),
[`UPDATE`](update.html "15.2.17 UPDATE Statement"), or
[`DELETE`](delete.html "15.2.2 DELETE Statement") operations on them.

Here is an example of a statement that retrieves information
from `INFORMATION_SCHEMA`:

```
mysql> SELECT table_name, table_type, engine
       FROM information_schema.tables
       WHERE table_schema = 'db5'
       ORDER BY table_name;
+------------+------------+--------+
| table_name | table_type | engine |
+------------+------------+--------+
| fk         | BASE TABLE | InnoDB |
| fk2        | BASE TABLE | InnoDB |
| goto       | BASE TABLE | MyISAM |
| into       | BASE TABLE | MyISAM |
| k          | BASE TABLE | MyISAM |
| kurs       | BASE TABLE | MyISAM |
| loop       | BASE TABLE | MyISAM |
| pk         | BASE TABLE | InnoDB |
| t          | BASE TABLE | MyISAM |
| t2         | BASE TABLE | MyISAM |
| t3         | BASE TABLE | MyISAM |
| t7         | BASE TABLE | MyISAM |
| tables     | BASE TABLE | MyISAM |
| v          | VIEW       | NULL   |
| v2         | VIEW       | NULL   |
| v3         | VIEW       | NULL   |
| v56        | VIEW       | NULL   |
+------------+------------+--------+
17 rows in set (0.01 sec)
```

Explanation: The statement requests a list of all the tables in
database `db5`, showing just three pieces of
information: the name of the table, its type, and its storage
engine.

Beginning with MySQL 8.0.30, information about generated
invisible primary keys is visible by default in all
`INFORMATION_SCHEMA` tables describing table
columns, keys, or both, such as the
[`COLUMNS`](information-schema-columns-table.html "28.3.8 The INFORMATION_SCHEMA COLUMNS Table") and
[`STATISTICS`](information-schema-statistics-table.html "28.3.34 The INFORMATION_SCHEMA STATISTICS Table") tables. If you wish to
make such information hidden from queries that select from these
tables, you can do so by setting the value of the
[`show_gipk_in_create_table_and_information_schema`](server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema)
server system variable to `OFF`. For more
information, see [Section 15.1.20.11, “Generated Invisible Primary Keys”](create-table-gipks.html "15.1.20.11 Generated Invisible Primary Keys").

### Character Set Considerations

The definition for character columns (for example,
`TABLES.TABLE_NAME`) is generally
`VARCHAR(N) CHARACTER SET
utf8mb3` where *`N`* is at least

64. MySQL uses the default collation for this character set
(`utf8mb3_general_ci`) for all searches, sorts,
comparisons, and other string operations on such columns.

Because some MySQL objects are represented as files, searches in
`INFORMATION_SCHEMA` string columns can be
affected by file system case sensitivity. For more information,
see [Section 12.8.7, “Using Collation in INFORMATION\_SCHEMA Searches”](charset-collation-information-schema.html "12.8.7 Using Collation in INFORMATION_SCHEMA Searches").

### INFORMATION\_SCHEMA as Alternative to SHOW Statements

The `SELECT ... FROM INFORMATION_SCHEMA`
statement is intended as a more consistent way to provide access
to the information provided by the various
[`SHOW`](show.html "15.7.7 SHOW Statements") statements that MySQL
supports ([`SHOW DATABASES`](show-databases.html "15.7.7.14 SHOW DATABASES Statement"),
[`SHOW TABLES`](show-tables.html "15.7.7.39 SHOW TABLES Statement"), and so forth). Using
[`SELECT`](select.html "15.2.13 SELECT Statement") has these advantages,
compared to [`SHOW`](show.html "15.7.7 SHOW Statements"):

* It conforms to Codd's rules, because all access is done on
  tables.

* You can use the familiar syntax of the
  [`SELECT`](select.html "15.2.13 SELECT Statement") statement, and only
  need to learn some table and column names.

* The implementor need not worry about adding keywords.
* You can filter, sort, concatenate, and transform the results
  from `INFORMATION_SCHEMA` queries into
  whatever format your application needs, such as a data
  structure or a text representation to parse.

* This technique is more interoperable with other database
  systems. For example, Oracle Database users are familiar
  with querying tables in the Oracle data dictionary.

Because [`SHOW`](show.html "15.7.7 SHOW Statements") is familiar and
widely used, the [`SHOW`](show.html "15.7.7 SHOW Statements") statements
remain as an alternative. In fact, along with the implementation
of `INFORMATION_SCHEMA`, there are enhancements
to [`SHOW`](show.html "15.7.7 SHOW Statements") as described in
[Section 28.8, “Extensions to SHOW Statements”](extended-show.html "28.8 Extensions to SHOW Statements").

### INFORMATION\_SCHEMA and Privileges

For most `INFORMATION_SCHEMA` tables, each
MySQL user has the right to access them, but can see only the
rows in the tables that correspond to objects for which the user
has the proper access privileges. In some cases (for example,
the `ROUTINE_DEFINITION` column in the
`INFORMATION_SCHEMA`
[`ROUTINES`](information-schema-routines-table.html "28.3.30 The INFORMATION_SCHEMA ROUTINES Table") table), users who have
insufficient privileges see `NULL`. Some tables
have different privilege requirements; for these, the
requirements are mentioned in the applicable table descriptions.
For example, [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") tables (tables
with names that begin with `INNODB_`) require
the [`PROCESS`](privileges-provided.html#priv_process) privilege.

The same privileges apply to selecting information from
`INFORMATION_SCHEMA` and viewing the same
information through [`SHOW`](show.html "15.7.7 SHOW Statements")
statements. In either case, you must have some privilege on an
object to see information about it.

### Performance Considerations

`INFORMATION_SCHEMA` queries that search for
information from more than one database might take a long time
and impact performance. To check the efficiency of a query, you
can use [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement"). For information
about using [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement") output to
tune `INFORMATION_SCHEMA` queries, see
[Section 10.2.3, “Optimizing INFORMATION\_SCHEMA Queries”](information-schema-optimization.html "10.2.3 Optimizing INFORMATION_SCHEMA Queries").

### Standards Considerations

The implementation for the `INFORMATION_SCHEMA`
table structures in MySQL follows the ANSI/ISO SQL:2003 standard
Part 11 *Schemata*. Our intent is
approximate compliance with SQL:2003 core feature F021
*Basic information schema*.

Users of SQL Server 2000 (which also follows the standard) may
notice a strong similarity. However, MySQL has omitted many
columns that are not relevant for our implementation, and added
columns that are MySQL-specific. One such added column is the
`ENGINE` column in the
`INFORMATION_SCHEMA`
[`TABLES`](information-schema-tables-table.html "28.3.38 The INFORMATION_SCHEMA TABLES Table") table.

Although other DBMSs use a variety of names, like
`syscat` or `system`, the
standard name is `INFORMATION_SCHEMA`.

To avoid using any name that is reserved in the standard or in
DB2, SQL Server, or Oracle, we changed the names of some columns
marked “MySQL extension”. (For example, we changed
`COLLATION` to
`TABLE_COLLATION` in the
[`TABLES`](information-schema-tables-table.html "28.3.38 The INFORMATION_SCHEMA TABLES Table") table.) See the list of
reserved words near the end of this article:
<https://web.archive.org/web/20070428032454/http://www.dbazine.com/db2/db2-disarticles/gulutzan5>.

### Conventions in the INFORMATION\_SCHEMA Reference Sections

The following sections describe each of the tables and columns
in `INFORMATION_SCHEMA`. For each column, there
are three pieces of information:

* “`INFORMATION_SCHEMA` Name”
  indicates the name for the column in the
  `INFORMATION_SCHEMA` table. This
  corresponds to the standard SQL name unless the
  “Remarks” field says “MySQL
  extension.”

* “[`SHOW`](show.html "15.7.7 SHOW Statements") Name”
  indicates the equivalent field name in the closest
  [`SHOW`](show.html "15.7.7 SHOW Statements") statement, if there is
  one.

* “Remarks” provides additional information where
  applicable. If this field is `NULL`, it
  means that the value of the column is always
  `NULL`. If this field says “MySQL
  extension,” the column is a MySQL extension to
  standard SQL.

Many sections indicate what [`SHOW`](show.html "15.7.7 SHOW Statements")
statement is equivalent to a
[`SELECT`](select.html "15.2.13 SELECT Statement") that retrieves information
from `INFORMATION_SCHEMA`. For
[`SHOW`](show.html "15.7.7 SHOW Statements") statements that display
information for the default database if you omit a `FROM
db_name` clause, you can
often select information for the default database by adding an
`AND TABLE_SCHEMA = SCHEMA()` condition to the
`WHERE` clause of a query that retrieves
information from an `INFORMATION_SCHEMA` table.

### Related Information

These sections discuss additional
`INFORMATION_SCHEMA`-related topics:

* information about `INFORMATION_SCHEMA`
  tables specific to the [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine")
  storage engine:
  [Section 28.4, “INFORMATION\_SCHEMA InnoDB Tables”](innodb-information-schema-tables.html "28.4 INFORMATION_SCHEMA InnoDB Tables")

* information about `INFORMATION_SCHEMA`
  tables specific to the thread pool plugin:
  [Section 28.5, “INFORMATION\_SCHEMA Thread Pool Tables”](thread-pool-information-schema-tables.html "28.5 INFORMATION_SCHEMA Thread Pool Tables")

* information about `INFORMATION_SCHEMA`
  tables specific to the `CONNECTION_CONTROL`
  plugin:
  [Section 28.6, “INFORMATION\_SCHEMA Connection Control Tables”](connection-control-information-schema-tables.html "28.6 INFORMATION_SCHEMA Connection Control Tables")

* Answers to questions that are often asked concerning the
  `INFORMATION_SCHEMA` database:
  [Section A.7, “MySQL 8.0 FAQ: INFORMATION\_SCHEMA”](faqs-information-schema.html "A.7 MySQL 8.0 FAQ: INFORMATION_SCHEMA")

* `INFORMATION_SCHEMA` queries and the
  optimizer: [Section 10.2.3, “Optimizing INFORMATION\_SCHEMA Queries”](information-schema-optimization.html "10.2.3 Optimizing INFORMATION_SCHEMA Queries")

* The effect of collation on
  `INFORMATION_SCHEMA` comparisons:
  [Section 12.8.7, “Using Collation in INFORMATION\_SCHEMA Searches”](charset-collation-information-schema.html "12.8.7 Using Collation in INFORMATION_SCHEMA Searches")