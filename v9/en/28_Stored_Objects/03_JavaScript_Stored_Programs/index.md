## 27.3 JavaScript Stored Programs

[27.3.1 JavaScript Stored Program Creation and Management](srjs-management.html)

[27.3.2 Obtaining Information About JavaScript Stored Programs](srjs-metadata.html)

[27.3.3 JavaScript Stored Program Language Support](srjs-language-support.html)

[27.3.4 JavaScript Stored Program Data Types and Argument Handling](srjs-data-arguments.html)

[27.3.5 JavaScript Stored Programs—Session Information and Options](srjs-session-info.html)

[27.3.6 JavaScript SQL API](srjs-sql-api.html)

[27.3.7 Using the JavaScript SQL API](srjs-api-using.html)

[27.3.8 Using JavaScript Libraries](srjs-libraries.html)

[27.3.9 Using WebAssembly Libraries](srjs-webassembly.html)

[27.3.10 JavaScript GenAI API](srjs-genai-api.html)

[27.3.11 JavaScript Stored Program Limitations and Restrictions](srjs-limitations.html)

[27.3.12 JavaScript Stored Program Examples](srjs-examples.html)

MySQL 9.5 supports stored routines written in
JavaScript, as in the simple example shown here:

```
mysql> CREATE FUNCTION add_nos(arg1 INT, arg2 INT)
    ->   RETURNS INT LANGUAGE JAVASCRIPT AS
    ->   $$
    $>     return arg1 + arg2
    $>   $$
    ->   ;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT add_nos(12,52);
+----------------+
| add_nos(12,52) |
+----------------+
|             64 |
+----------------+
1 row in set (0.00 sec)
```

Note

Support for JavaScript stored routines requires installation of
the Multilingual Engine (MLE) component. For information about installing and
configuring the MLE component, see
[Section 7.5.7, “Multilingual Engine Component (MLE)”](mle-component.html "7.5.7 Multilingual Engine Component (MLE)").

JavaScript stored programs can be used together with other
user-created and MySQL-native stored programs (subject to
limitations described elsewhere in this section), as well as with
MySQL system and user variables. We can see some of this here, using
the `add_nos()` function created in the previous
example:

```
mysql> SET @x = 2;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x;
+------+
| @x   |
+------+
|    2 |
+------+
1 row in set (0.00 sec)

mysql> SELECT @@server_id;
+-------------+
| @@server_id |
+-------------+
|           1 |
+-------------+
1 row in set (0.00 sec)

mysql> SELECT add_nos(POW(2,@x), 1);
+-----------------------+
| add_nos(POW(2,@x), 1) |
+-----------------------+
|                     5 |
+-----------------------+
1 row in set (0.01 sec)

mysql> SELECT POW(add_nos(@x, @@server_id), add_nos(@x, 1));
+-----------------------------------------------+
| POW(add_nos(@x, @@server_id), add_nos(@x, 1)) |
+-----------------------------------------------+
|                                            27 |
+-----------------------------------------------+
1 row in set (0.01 sec)
```

JavaScript stored procedures can be invoked using
[`CALL`](call.html "15.2.1 CALL Statement"), as with SQL stored procedures.

JavaScript stored programs can also take column values as arguments.
JavaScript stored functions can be invoked anywhere in an SQL
expression that it is legal to use any other function, such as in
`WHERE`, `HAVING`, `ORDER
BY`, and `JOIN` clauses. They can also be
invoked within the body of a trigger or event definition, although
the definitions themselves must be written in SQL. Examples of some
of these features can be found later in this section (see
[Section 27.3.12, “JavaScript Stored Program Examples”](srjs-examples.html "27.3.12 JavaScript Stored Program Examples")).