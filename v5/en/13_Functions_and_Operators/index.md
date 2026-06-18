# Chapter 12 Functions and Operators

**Table of Contents**

[12.1 Built-In Function and Operator Reference](built-in-function-reference.html)

[12.2 Loadable Function Reference](loadable-function-reference.html)

[12.3 Type Conversion in Expression Evaluation](type-conversion.html)

[12.4 Operators](non-typed-operators.html)
:   [12.4.1 Operator Precedence](operator-precedence.html)

    [12.4.2 Comparison Functions and Operators](comparison-operators.html)

    [12.4.3 Logical Operators](logical-operators.html)

    [12.4.4 Assignment Operators](assignment-operators.html)

[12.5 Flow Control Functions](flow-control-functions.html)

[12.6 Numeric Functions and Operators](numeric-functions.html)
:   [12.6.1 Arithmetic Operators](arithmetic-functions.html)

    [12.6.2 Mathematical Functions](mathematical-functions.html)

[12.7 Date and Time Functions](date-and-time-functions.html)

[12.8 String Functions and Operators](string-functions.html)
:   [12.8.1 String Comparison Functions and Operators](string-comparison-functions.html)

    [12.8.2 Regular Expressions](regexp.html)

    [12.8.3 Character Set and Collation of Function Results](string-functions-charset.html)

[12.9 Full-Text Search Functions](fulltext-search.html)
:   [12.9.1 Natural Language Full-Text Searches](fulltext-natural-language.html)

    [12.9.2 Boolean Full-Text Searches](fulltext-boolean.html)

    [12.9.3 Full-Text Searches with Query Expansion](fulltext-query-expansion.html)

    [12.9.4 Full-Text Stopwords](fulltext-stopwords.html)

    [12.9.5 Full-Text Restrictions](fulltext-restrictions.html)

    [12.9.6 Fine-Tuning MySQL Full-Text Search](fulltext-fine-tuning.html)

    [12.9.7 Adding a User-Defined Collation for Full-Text Indexing](full-text-adding-collation.html)

    [12.9.8 ngram Full-Text Parser](fulltext-search-ngram.html)

    [12.9.9 MeCab Full-Text Parser Plugin](fulltext-search-mecab.html)

[12.10 Cast Functions and Operators](cast-functions.html)

[12.11 XML Functions](xml-functions.html)

[12.12 Bit Functions and Operators](bit-functions.html)

[12.13 Encryption and Compression Functions](encryption-functions.html)

[12.14 Locking Functions](locking-functions.html)

[12.15 Information Functions](information-functions.html)

[12.16 Spatial Analysis Functions](spatial-analysis-functions.html)
:   [12.16.1 Spatial Function Reference](spatial-function-reference.html)

    [12.16.2 Argument Handling by Spatial Functions](spatial-function-argument-handling.html)

    [12.16.3 Functions That Create Geometry Values from WKT Values](gis-wkt-functions.html)

    [12.16.4 Functions That Create Geometry Values from WKB Values](gis-wkb-functions.html)

    [12.16.5 MySQL-Specific Functions That Create Geometry Values](gis-mysql-specific-functions.html)

    [12.16.6 Geometry Format Conversion Functions](gis-format-conversion-functions.html)

    [12.16.7 Geometry Property Functions](gis-property-functions.html)

    [12.16.8 Spatial Operator Functions](spatial-operator-functions.html)

    [12.16.9 Functions That Test Spatial Relations Between Geometry Objects](spatial-relation-functions.html)

    [12.16.10 Spatial Geohash Functions](spatial-geohash-functions.html)

    [12.16.11 Spatial GeoJSON Functions](spatial-geojson-functions.html)

    [12.16.12 Spatial Convenience Functions](spatial-convenience-functions.html)

[12.17 JSON Functions](json-functions.html)
:   [12.17.1 JSON Function Reference](json-function-reference.html)

    [12.17.2 Functions That Create JSON Values](json-creation-functions.html)

    [12.17.3 Functions That Search JSON Values](json-search-functions.html)

    [12.17.4 Functions That Modify JSON Values](json-modification-functions.html)

    [12.17.5 Functions That Return JSON Value Attributes](json-attribute-functions.html)

    [12.17.6 JSON Utility Functions](json-utility-functions.html)

[12.18 Functions Used with Global Transaction Identifiers (GTIDs)](gtid-functions.html)

[12.19 Aggregate Functions](aggregate-functions-and-modifiers.html)
:   [12.19.1 Aggregate Function Descriptions](aggregate-functions.html)

    [12.19.2 GROUP BY Modifiers](group-by-modifiers.html)

    [12.19.3 MySQL Handling of GROUP BY](group-by-handling.html)

    [12.19.4 Detection of Functional Dependence](group-by-functional-dependence.html)

[12.20 Miscellaneous Functions](miscellaneous-functions.html)

[12.21 Precision Math](precision-math.html)
:   [12.21.1 Types of Numeric Values](precision-math-numbers.html)

    [12.21.2 DECIMAL Data Type Characteristics](precision-math-decimal-characteristics.html)

    [12.21.3 Expression Handling](precision-math-expressions.html)

    [12.21.4 Rounding Behavior](precision-math-rounding.html)

    [12.21.5 Precision Math Examples](precision-math-examples.html)

Expressions can be used at several points in
[SQL](glossary.html#glos_sql "SQL") statements, such as in the
`ORDER BY` or `HAVING` clauses of
[`SELECT`](select.html "13.2.9 SELECT Statement") statements, in the
`WHERE` clause of a
[`SELECT`](select.html "13.2.9 SELECT Statement"),
[`DELETE`](delete.html "13.2.2 DELETE Statement"), or
[`UPDATE`](update.html "13.2.11 UPDATE Statement") statement, or in
[`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment")
statements. Expressions can be written using values from several
sources, such as literal values, column values,
`NULL`, variables, built-in functions and
operators, loadable functions, and stored functions (a type of
stored object).

This chapter describes the built-in functions and operators that are
permitted for writing expressions in MySQL. For information about
loadable functions and stored functions, see
[Section 5.6, “MySQL Server Loadable Functions”](server-loadable-functions.html "5.6 MySQL Server Loadable Functions"), and
[Section 23.2, “Using Stored Routines”](stored-routines.html "23.2 Using Stored Routines"). For the rules describing how the
server interprets references to different kinds of functions, see
[Section 9.2.5, “Function Name Parsing and Resolution”](function-resolution.html "9.2.5 Function Name Parsing and Resolution").

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
(See [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").) Individual client programs can
request this behavior by using the
`CLIENT_IGNORE_SPACE` option for
[`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html). In either
case, all function names become reserved words.

For the sake of brevity, some examples in this chapter display the
output from the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") program in abbreviated
form. Rather than showing examples in this format:

```sql
mysql> SELECT MOD(29,9);
+-----------+
| mod(29,9) |
+-----------+
|         2 |
+-----------+
1 rows in set (0.00 sec)
```

This format is used instead:

```sql
mysql> SELECT MOD(29,9);
        -> 2
```