--- title: MySQL 8.4 Reference Manual :: 14 Functions and Operators url: https://dev.mysql.com/doc/refman/8.4/en/functions.html order: 1 ---



# Chapter 14 Functions and Operators

**Table of Contents**

 14.1 Built-In Function and Operator Reference

 14.2 Loadable Function Reference

 14.3 Type Conversion in Expression Evaluation

 14.4 Operators :    14.4.1 Operator Precedence

     14.4.2 Comparison Functions and Operators

     14.4.3 Logical Operators

     14.4.4 Assignment Operators

 14.5 Flow Control Functions

 14.6 Numeric Functions and Operators :    14.6.1 Arithmetic Operators

     14.6.2 Mathematical Functions

 14.7 Date and Time Functions

 14.8 String Functions and Operators :    14.8.1 String Comparison Functions and Operators

     14.8.2 Regular Expressions

     14.8.3 Character Set and Collation of Function Results

 14.9 Full-Text Search Functions :    14.9.1 Natural Language Full-Text Searches

     14.9.2 Boolean Full-Text Searches

     14.9.3 Full-Text Searches with Query Expansion

     14.9.4 Full-Text Stopwords

     14.9.5 Full-Text Restrictions

     14.9.6 Fine-Tuning MySQL Full-Text Search

     14.9.7 Adding a User-Defined Collation for Full-Text Indexing

     14.9.8 ngram Full-Text Parser

     14.9.9 MeCab Full-Text Parser Plugin

 14.10 Cast Functions and Operators

 14.11 XML Functions

 14.12 Bit Functions and Operators

 14.13 Encryption and Compression Functions

 14.14 Locking Functions

 14.15 Information Functions

 14.16 Spatial Analysis Functions :    14.16.1 Spatial Function Reference

     14.16.2 Argument Handling by Spatial Functions

     14.16.3 Functions That Create Geometry Values from WKT Values

     14.16.4 Functions That Create Geometry Values from WKB Values

     14.16.5 MySQL-Specific Functions That Create Geometry Values

     14.16.6 Geometry Format Conversion Functions

     14.16.7 Geometry Property Functions

     14.16.8 Spatial Operator Functions

     14.16.9 Functions That Test Spatial Relations Between Geometry Objects

     14.16.10 Spatial Geohash Functions

     14.16.11 Spatial GeoJSON Functions

     14.16.12 Spatial Aggregate Functions

     14.16.13 Spatial Convenience Functions

 14.17 JSON Functions :    14.17.1 JSON Function Reference

     14.17.2 Functions That Create JSON Values

     14.17.3 Functions That Search JSON Values

     14.17.4 Functions That Modify JSON Values

     14.17.5 Functions That Return JSON Value Attributes

     14.17.6 JSON Table Functions

     14.17.7 JSON Schema Validation Functions

     14.17.8 JSON Utility Functions

 14.18 Replication Functions :    14.18.1 Group Replication Functions

     14.18.2 Functions Used with Global Transaction Identifiers (GTIDs)

     14.18.3 Asynchronous Replication Channel Failover Functions

     14.18.4 Position-Based Synchronization Functions

 14.19 Aggregate Functions :    14.19.1 Aggregate Function Descriptions

     14.19.2 GROUP BY Modifiers

     14.19.3 MySQL Handling of GROUP BY

     14.19.4 Detection of Functional Dependence

 14.20 Window Functions :    14.20.1 Window Function Descriptions

     14.20.2 Window Function Concepts and Syntax

     14.20.3 Window Function Frame Specification

     14.20.4 Named Windows

     14.20.5 Window Function Restrictions

 14.21 Performance Schema Functions

 14.22 Internal Functions

 14.23 Miscellaneous Functions

 14.24 Precision Math :    14.24.1 Types of Numeric Values

     14.24.2 DECIMAL Data Type Characteristics

     14.24.3 Expression Handling

     14.24.4 Rounding Behavior

     14.24.5 Precision Math Examples

Expressions can be used at several points in SQL statements, such as in the `ORDER BY` or `HAVING` clauses of `SELECT` statements, in the `WHERE` clause of a `SELECT`, `DELETE`, or `UPDATE` statement, or in `SET` statements. Expressions can be written using values from several sources, such as literal values, column values, `NULL`, variables, built-in functions and operators, loadable functions, and stored functions (a type of stored object).

This chapter describes the built-in functions and operators that are permitted for writing expressions in MySQL. For information about loadable functions and stored functions, see Section 7.7, “MySQL Server Loadable Functions”, and Section 27.2, “Using Stored Routines”. For the rules describing how the server interprets references to different kinds of functions, see Section 11.2.5, “Function Name Parsing and Resolution”.

An expression that contains `NULL` always produces a `NULL` value unless otherwise indicated in the documentation for a particular function or operator.

::: info Note

By default, there must be no whitespace between a function name and the parenthesis following it. This helps the MySQL parser distinguish between function calls and references to tables or columns that happen to have the same name as a function. However, spaces around function arguments are permitted.

To tell the MySQL server to accept spaces after function names by starting it with the `--sql-mode=IGNORE_SPACE` option. (See  Section 7.1.11, “Server SQL Modes”.) Individual client programs can request this behavior by using the `CLIENT_IGNORE_SPACE` option for `mysql_real_connect()`. In either case, all function names become reserved words.


:::

For the sake of brevity, some examples in this chapter display the output from the  `mysql` program in abbreviated form. Rather than showing examples in this format:

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


