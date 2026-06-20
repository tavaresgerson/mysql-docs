# Chapter 14 Functions and Operators

Expressions can be used at several points in
[SQL](glossary.html#glos_sql "SQL") statements, such as in the
`ORDER BY` or `HAVING` clauses of
[`SELECT`](select.html "15.2.13 SELECT Statement") statements, in the
`WHERE` clause of a
[`SELECT`](select.html "15.2.13 SELECT Statement"),
[`DELETE`](delete.html "15.2.2 DELETE Statement"), or
[`UPDATE`](update.html "15.2.17 UPDATE Statement") statement, or in
[`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
statements. Expressions can be written using values from several
sources, such as literal values, column values,
`NULL`, variables, built-in functions and
operators, loadable functions, and stored functions (a type of
stored object).

This chapter describes the built-in functions and operators that are
permitted for writing expressions in MySQL. For information about
loadable functions and stored functions, see
[Section 7.7, “MySQL Server Loadable Functions”](server-loadable-functions.html "7.7 MySQL Server Loadable Functions"), and
[Section 27.2, “Using Stored Routines”](stored-routines.html "27.2 Using Stored Routines"). For the rules describing how the
server interprets references to different kinds of functions, see
[Section 11.2.5, “Function Name Parsing and Resolution”](function-resolution.html "11.2.5 Function Name Parsing and Resolution").

An expression that contains `NULL` always produces
a `NULL` value unless otherwise indicated in the
documentation for a particular function or operator.

Note

By default, there must be no whitespace between a function name
and the parenthesis following it. This helps the MySQL parser
distinguish between function calls and references to tables or
columns that happen to have the same name as a function. However,
spaces around function arguments are permitted.

To tell the MySQL server to accept spaces after function names by
starting it with the
[`--sql-mode=IGNORE_SPACE`](server-options.html#option_mysqld_sql-mode) option.
(See [Section 7.1.11, “Server SQL Modes”](sql-mode.html "7.1.11 Server SQL Modes").) Individual client programs can
request this behavior by using the
`CLIENT_IGNORE_SPACE` option for
[`mysql_real_connect()`](/doc/c-api/9.5/en/mysql-real-connect.html). In either
case, all function names become reserved words.

For the sake of brevity, some examples in this chapter display the
output from the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") program in abbreviated
form. Rather than showing examples in this format:

```
mysql> SELECT MOD(29,9);
+-----------+
| mod(29,9) |
+-----------+
|         2 |
+-----------+
1 rows in set (0.00 sec)
```

This format is used instead:

```
mysql> SELECT MOD(29,9);
        -> 2
```