## 27.3 JavaScript Stored Programs

MySQL 9.5 supports stored routines written in JavaScript, as in the simple example shown here:

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

Support for JavaScript stored routines requires installation of the Multilingual Engine (MLE) component. For information about installing and configuring the MLE component, see Section 7.5.7, “Multilingual Engine Component (MLE)”").

JavaScript stored programs can be used together with other user-created and MySQL-native stored programs (subject to limitations described elsewhere in this section), as well as with MySQL system and user variables. We can see some of this here, using the `add_nos()` function created in the previous example:

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

JavaScript stored procedures can be invoked using `CALL`, as with SQL stored procedures.

JavaScript stored programs can also take column values as arguments. JavaScript stored functions can be invoked anywhere in an SQL expression that it is legal to use any other function, such as in `WHERE`, `HAVING`, `ORDER BY`, and `JOIN` clauses. They can also be invoked within the body of a trigger or event definition, although the definitions themselves must be written in SQL. Examples of some of these features can be found later in this section (see Section 27.3.12, “JavaScript Stored Program Examples”).


### 27.3.1 JavaScript Stored Program Creation and Management

A stored function or stored procedure written in JavaScript is created, invoked, and maintained in much the same fashion as one written in SQL, subject to the differences listed here:

* The stored program language must be declared explicitly using `LANGUAGE JAVASCRIPT` in the `CREATE FUNCTION` or `CREATE PROCEDURE` statement used to create the stored program; otherwise, MySQL assumes the intended language is SQL.

  The syntax of the routine body is checked at creation time; any errors cause the `CREATE` statement to be rejected, and the stored program not to be created.

* The program body must be demarcated using the `AS` keyword plus dollar-quoted delimiters such as `$$`, `$js$`, `$mysql$`, and so on. You must use the same delimiter to mark both the beginning and end of the routine body. It is possible to use quotation marks to delimit the routine body, but dollar-quoted delimiters are preferred, since this avoids issues with quoting strings in function or procedure code. Following the first dollar-quoted delimiter, the **mysql** client prompt changes to `$>` for each new line within the routine body, until it reaches a closing dollar-quoted delimiter, after which the prompt reverts to the default (normally `->`). This can be seen in the `CREATE FUNCTION` statement used to create the `add_nos()` function previously.

* It is not necessary to specify a statement delimiter or terminator as it is for SQL stored routines. If you employ the optional `;` character to separate JavaScript statements, this is interpreted correctly as being part of the JavaScript routine, and not as an SQL statement delimiter, as shown here:

  ```
  mysql> CREATE FUNCTION js_pow(arg1 INT, arg2 INT)
      -> RETURNS INT LANGUAGE JAVASCRIPT
      -> AS
      ->   $$
      $>     let x = Math.pow(arg1, arg2);
      $>     return x;
      $>   $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)

  mysql> SELECT js_pow(2,3);
  +-------------+
  | js_pow(2,3) |
  +-------------+
  |           8 |
  +-------------+
  1 row in set (0.00 sec)
  ```

  To minimize possible confusion, we do not use the `;` separator for any JavaScript statements in the remaining examples in this section.

* The text of the routine body is always treated as `utfmb4` regardless of the character set actually used. What this means is that, whatever character set is used by the client for the routine body, the server converts it to `utf8mb4` before storing it in the data dictionary. Since utf8mb4 subsumes all other supported character sets, this should not be an issue.

  JavaScript program argument and routine names must use the `utfmb3` character set, as with SQL stored programs. See Section 12.9, “Unicode Support”.

* String arguments and return types are expected to be `utf8mb4`; this means that, if the default character set of the schema to which the JavaScript stored program belongs is some other character set, all of its arguments must be declared explicitly as `utf8mb4`.

  Input argument names must adhere to the rules for JavaScript identifiers: They can contain Unicode letters, `$`, `_`, and digits (0-9), but may not start with a digit.

  Using a word that is reserved in JavaScript (such as `var` or `function`) as the name of an argument raises an error. Since MySQL JavaScript stored programs always use strict mode, this also includes keywords such as `package` and `let`. See [Reserved Words](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#reserved_words) for a complete listing of these. In addition, the keywords `mysql`, `console`, and `graal` are also reserved by the MLE component, and cannot be used as variable or argument names in MySQL JavaScript stored programs.

* You can modify a JavaScript stored program using `ALTER FUNCTION` and `ALTER PROCEDURE` as you would an SQL stored function or procedure. Changing the language using `ALTER` is not supported; in such cases, you must use `DROP FUNCTION` or `DROP PROCEDURE` as applicable, then re-create the stored program using the appropriate `CREATE` statement.

To obtain a listing of all JavaScript stored programs in all databases on the server, query the Information Schema `ROUTINES` table similarly to this:

```
mysql> SELECT CONCAT(ROUTINE_SCHEMA, '.', ROUTINE_NAME) AS "JS Stored Routines"
    ->   FROM INFORMATION_SCHEMA.ROUTINES
    ->   WHERE EXTERNAL_LANGUAGE="JAVASCRIPT";
+------------------------+
| JS Stored Routines     |
+------------------------+
| test.pc1               |
| test.pc2               |
| world.jssp_simple1     |
| test.jssp_vsimple      |
| test.jssp_simple       |
| world.jssp_vsimple     |
| world.jssp_vsimple2    |
| world.jssp_simple_meta |
+------------------------+
8 rows in set (0.00 sec)
```


### 27.3.2 Obtaining Information About JavaScript Stored Programs

You can obtain metadata about JavaScript stored programs in the same ways in which you can do so for SQL stored programs; see Section 27.2.3, “Stored Routine Metadata”.

Additional information relating to the MLE component which provides JavaScript stored program functionality can be obtained by checking the values of server system and status variables which this component makes available. See Section 7.5.7.2, “MLE Component Status and Session Information”, for information about these.

For information about memory usage by JavaScript stored programs, see Section 7.5.7.3, “MLE Component Memory and Thread Usage”

You can retrieve the statement that was used to create an MLE stored routine using [`SHOW CREATE FUNCTION`](show-create-function.html "15.7.7.9 SHOW CREATE FUNCTION Statement") or [`SHOW CREATE PROCEDURE`](show-create-procedure.html "15.7.7.11 SHOW CREATE PROCEDURE Statement"), as with any other MySQL stored routine. Stored routine metadata can be retrieved by querying the Information Schema `ROUTINES` table, or by issuing `SHOW FUNCTION STATUS` or `SHOW PROCEDURE STATUS` as appropriate. This metadata is stored in the MySQL data dictionary, and is persistent.

You can retrieve the statement that was used to create an MLE JavaScript library using [`SHOW CREATE LIBRARY`](show-create-library.html "15.7.7.10 SHOW CREATE LIBRARY Statement"). Information about libraries used by routines can be found in the Information Schema `ROUTINE_LIBRARIES` table, as well as the `mysql_option.option_usage` table (see Section 7.5.8.1, “Option Tracker Tables”). This metadata is also stored in the MySQL data dictionary.

Information about the component's state in the current user session can be acquired using the loadable function `mle_session_state()`, which is described elsewhere in this section.


### 27.3.3 JavaScript Stored Program Language Support

JavaScript language support in MySQL conforms to the [ECMAScript 2024 Specification](https://262.ecma-international.org/15.0/), and uses strict mode by default. Strict mode cannot be disabled. This implementation includes all of the standard ECMAScript library objects such as `Object`, `Function`, `Math`, `Date`, `String`, and so forth. `console.log()` and `console.error()` are also supported (see Section 27.3.12, “JavaScript Stored Program Examples”).


### 27.3.4 JavaScript Stored Program Data Types and Argument Handling

Most MySQL data types are supported for MLE stored program input and output arguments, as well as for return data types. The data types are listed here:

* *Integer*: All variants and aliases of MySQL integer data types are supported, including `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), and `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  `SIGNED` and `UNSIGNED` are supported for all these types.

  `BOOL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and `SERIAL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") are also supported, and treated as integer types.

* *String*: The `CHAR`, `VARCHAR`, `TEXT`, and `BLOB` string types are supported.

  These types are supported as in the MySQL server with the following exceptions:

  1. String argument and return types can use the `utf8mb4` or binary character sets; use of other character sets for these raises an error. This restriction applies to argument and return type declarations; the server attempts to convert argument *values* using other character sets to `utfmb4` whenever necessary, as with SQL stored programs.

  2. The maximum supported length for a `LONGTEXT` value is 1073741799 (230 - 24 - 23 - 1) characters; for `LONGBLOB`, the maximum supported length is 2147483639 (231 - 28 - 1).

  Support for `BLOB` types includes support for `BINARY` and `VARBINARY`.

  The MySQL `JSON` data type is also supported.

* *Floating point*: `FLOAT` - FLOAT, DOUBLE") and `DOUBLE` - FLOAT, DOUBLE") are supported along with their aliases. `REAL` - FLOAT, DOUBLE") is also treated as floating point, but `UNSIGNED FLOAT` and `UNSIGNED DOUBLE` are deprecated in MySQL, and are not supported by MLE.

* *Temporal types*: `DATE`, `DATETIME`, and `TIMESTAMP` are supported, and are converted to JavaScript `Date` values. `TIME` values are treated as strings; `YEAR` values are treated as numbers.

  The first time a given JavaScript stored procedure is executed, it is associated with the current MySQL session time zone, and this time zone continues to be used by the stored program, even if the MySQL session time zone is changed concurrently, for the duration of the MLE component session, or until `mle_session_reset()` is invoked. More more information, see Time zone support, later in this section.

* The `VECTOR`, `DECIMAL` - DECIMAL, NUMERIC"), `NUMERIC` - DECIMAL, NUMERIC"), and `BIT` types are all supported in MySQL 9.5.

Input arguments (`IN` and `INOUT` parameters) are automatically converted into JavaScript types based on the mapping shown in the following table:

**Table 27.1 Conversion of MySQL data types to JavaScript types**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">MySQL Type</th> <th scope="col">JavaScript Type</th> </tr></thead><tbody><tr> <td><code>TINYINT</code>, <code>SMALLINT</code>, <code>MEDIUMINT</code>, <code>INT</code>, <code>BOOL</code>, <code>BIGINT</code>, or <code>SERIAL</code></td> <td>If safe: <code>Number</code>; otherwise: <code>String</code></td> </tr><tr> <td><code>FLOAT</code> or <code>DOUBLE</code></td> <td><code>Number</code></td> </tr><tr> <td><code>CHAR</code>, <code>VARCHAR</code>, <code>TINYTEXT</code>, <code>TEXT</code>, <code>MEDIUMTEXT</code>, or <code>LONGTEXT</code></td> <td><code>String</code></td> </tr><tr> <td><code>TINYBLOB</code>, <code>BLOB</code>, <code>MEDIUMBLOB</code>, <code>LONGBLOB</code>, <code>BINARY</code>, or <code>VARBINARY</code></td> <td><code>Uint8Array</code></td> </tr><tr> <td><code>DATE</code>, <code>DATETIME</code>, or <code>TIMESTAMP</code></td> <td><code>Date</code></td> </tr><tr> <td><code>TIME</code></td> <td><code>String</code></td> </tr><tr> <td><code>YEAR</code></td> <td><code>Number</code></td> </tr><tr> <td><code>VECTOR</code></td> <td><code>Float32Array</code></td> </tr><tr> <td><code>DECIMAL</code></td> <td><code>String</code> or <code>Number</code> depending on the value of <code>session.options.decimalType</code> (<code>STRING</code> or <code>NUMBER</code>, respectively). By default, converted to <code>String</code>.</td> </tr><tr> <td><code>BIT(<code>M</code>)</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code>BIT(<code>M</code>)</code> &lt;= <code>JavaScript.MAX_SAFE_INTEGER</code>: <code>Number</code> </p></li><li class="listitem"><p> <code>BIT(<code>M</code>)</code> &gt; <code>JavaScript.MAX_SAFE_INTEGER</code>: <code>BigInt</code> </p></li></ul> </div> </td> </tr></tbody></table>

Conversion to or from a MySQL integer whose value lies outside the range -(253-1) (-9007199254740991) to 253-1 (9007199254740991) is lossy. How conversion from MySQL integers to JavaScript is performed can be changed for the current session using `mle_set_session_state()`; the default behavior is equivalent to calling this function using `UNSAFE_STRING` as the value for `integer_type`. See the description of that function for more information.

SQL `NULL` is supported for all the types listed, and is converted to and from JavaScript `null` as required.

JavaScript (unlike SQL) is a dynamically typed language, which means that return types are known only at execution time. JavaScript return value and output arguments (`OUT` and `INOUT` parameters) are automatically converted back into the expected MySQL type based on the mappings shown in the following table:

**Table 27.2 Type Conversion: JavaScript to MySQL**

<table border="1" class="table" summary="Conversion of JavaScript data types to MySQL types"><colgroup><col/><col/><col/><col/><col/><col/><col/><col/><col/></colgroup><thead><tr><th scope="col">From JavaScript Type</th><th scope="col">To MySQL <code>TINYINT</code>, <code>SMALLINT</code>, <code>MEDIUMINT</code>, <code>INT</code>, <code>BIGINT</code>, <code>BOOLEAN</code>, or <code>SERIAL</code></th><th scope="col">To MySQL <code>CHAR</code> or <code>VARCHAR</code></th><th scope="col">To MySQL <code>FLOAT</code> or <code>DOUBLE</code></th><th scope="col">To MySQL <code>TINYTEXT</code>, <code>TEXT</code>, <code>MEDIUMTEXT</code>, or <code>LONGTEXT</code></th><th scope="col">To MySQL <code>TINYBLOB</code>, <code>BLOB</code>, <code>MEDIUMBLOB</code>, <code>LONGBLOB</code>, <code>BINARY</code>, <code>VARBINARY</code></th><th scope="col">To MySQL <code>VECTOR</code></th><th scope="col">To MySQL <code>DECIMAL</code> (<code>NUMERIC</code>)</th><th scope="col">To MySQL <code>BIT</code></th></tr></thead><tbody><tr><td scope="row"><code>Boolean</code></td><td>Cast to <code>Integer</code></td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Cast to <code>Float</code></td><td>If JavaScript <code>Boolean</code> <code>true</code>: convert to “true”; if JavaScript <code>Boolean</code> <code>false</code>: convert to “false”</td><td>Error</td><td>Error</td><td>Convert to <code>Decimal</code></td><td>Convert to <code>Bit</code></td></tr><tr><td scope="row"><code>Number</code></td><td>Round value to <code>Integer</code>; check whether value is out of range</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Retain value; check whether this is out of range</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Error</td><td>Error</td><td>Convert to <code>Decimal</code></td><td>Convert to <code>Bit</code></td></tr><tr><td scope="row"><code>BigInteger</code></td><td>Retain value; check whether out of range</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Cast to <code>Float</code>; check whether result is out of range</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Error</td><td>Error</td><td>Convert to <code>Decimal</code></td><td>Convert to <code>Bit</code></td></tr><tr><td scope="row"><code>String</code></td><td>Parse as number and round to <code>Integer</code>; check for value out of range</td><td>Retain value; check whether length is within range</td><td>Parse value to <code>Float</code>; check for value out of range values</td><td>Use existing string value; check whether length of string is within expected range</td><td>Error</td><td>Error</td><td>Convert to <code>Decimal</code></td><td>Convert to <code>Bit</code></td></tr><tr><td scope="row"><code>Symbol</code> or <code>Object</code></td><td>Raise invalid type conversion error</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Raise invalid type conversion error</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Error</td><td>Error</td><td>Error</td><td>Error</td></tr><tr><td scope="row">Typed <code>Array</code></td><td>Raise invalid type conversion error</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Raise invalid type conversion error</td><td>Convert to <code>String</code>; check whether length of result is within expected range</td><td>Convert to byte array; check whether result is within expected size</td><td>Treat as <code>Float32Array</code>; convert to byte array, checking whether it is within the expected <code>VECTOR</code> field size</td><td>Error</td><td>Error</td></tr><tr><td scope="row"><code>null</code> or <code>undefined</code></td><td><code>NULL</code></td><td><code>NULL</code></td><td><code>NULL</code></td><td><code>NULL</code></td><td><code>NULL</code></td><td><code>NULL</code></td><td><code>NULL</code></td><td><code>NULL</code></td></tr></tbody></table>

Notes:

* JavaScript `Infinity` and `-Infinity` are treated as out-of-range values.

* JavaScript `NaN` raises an invalid type conversion error.

* All rounding is performed using `Math.round()`.

* Attempting to cast a `BigInt` or `String` having a non-numeric value to MySQL `FLOAT` raises an invalid type conversion error.

* The maximum supported length for strings is 1073741799.
* The maximum supported length for `BLOB` values is 2147483639.

* `JavaScript.MAX_SAFE_INTEGER` is equal to 9007199254740991 (253-1).

**Table 27.3 Type Conversion: JavaScript Dates to MySQL**

<table border="1" class="table" summary="Conversion of JavaScript Date values to MySQL temporal types"><colgroup><col/><col/><col/><col/></colgroup><thead><tr><th scope="col">JavaScript Type</th><th scope="col">MySQL <code>DATE</code></th><th scope="col">MySQL <code>DATETIME</code>, <code>TIMESTAMP</code></th><th scope="col">MySQL YEAR</th></tr></thead><tbody><tr><td scope="row"><code>null</code> or <code>undefined</code></td><td><code>NULL</code></td><td><code>NULL</code></td><td><code>NULL</code></td></tr><tr><td scope="row"><code>Date</code></td><td>Retain value as is, rounding off any time part to the closest second.</td><td>Keep value as is.</td><td>Extract year from the <code>Date</code></td></tr><tr><td scope="row">Type convertible to JavaScript <code>Date</code> (formatted string)</td><td>Cast value to JavaScript <code>Date</code> and handle accordingly</td><td>Cast value to JavaScript <code>Date</code> and handle accordingly</td><td>If value contains 4-digit year, use it.</td></tr><tr><td scope="row">Type not convertible to JavaScript <code>Date</code></td><td>Invalid type conversion error</td><td>Invalid type conversion error</td><td>If value contains 4-digit year, use it.</td></tr></tbody></table>

Passing a MySQL zero date (`00-00-0000`) or zero-in-date value (such as `00-01-2023`) leads to the creation of an `Invalid Date` instance of `Date`. When passed a MySQL date which is invalid (for example, 31 February), MLE calls a JavaScript `Date` constructor with invalid individual date and time component values.

The MySQL `TIME` type is handled as a string, and is validated inside MySQL. See Section 13.2.3, “The TIME Type”, for more information.

**Table 27.4 Conversion of MySQL JSON types to JavaScript**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">MySQL JSON Type</th> <th scope="col">JavaScript Type</th> </tr></thead><tbody><tr> <td><code>NULL</code>, <code>JSON NULL</code></td> <td><code>null</code></td> </tr><tr> <td><code>JSON OBJECT</code></td> <td><code>Object</code></td> </tr><tr> <td><code>JSON ARRAY</code></td> <td><code>Array</code></td> </tr><tr> <td><code>JSON BOOLEAN</code></td> <td><code>Boolean</code></td> </tr><tr> <td><code>JSON INTEGER</code>, <code>JSON DOUBLE</code>, <code>JSON DECIMAL</code></td> <td><code>Number</code></td> </tr><tr> <td><code>JSON STRING</code></td> <td><code>String</code></td> </tr><tr> <td><code>JSON DATETIME</code>, <code>JSON DATE</code>, <code>JSON TIME</code></td> <td><code>String</code></td> </tr><tr> <td><code>JSON BLOB</code>, <code>JSON OPAQUE</code></td> <td><code>String</code></td> </tr></tbody></table>

Note

A MySQL JSON string, when converted to a JavaScript string, becomes unquoted.

**Table 27.5 Conversion of JavaScript types to MySQL JSON**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th scope="col">JavaScript Type</th> <th scope="col">MySQL JSON Type</th> </tr></thead><tbody><tr> <td><code>null</code>, <code>undefined</code></td> <td><code>NULL</code></td> </tr><tr> <td><code>Boolean</code></td> <td>Error</td> </tr><tr> <td><code>Number</code></td> <td>Error</td> </tr><tr> <td><code>String</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Can be parsed as JSON: JSON string, JSON object, or JSON array </p></li><li class="listitem"><p> Cannot be parsed as JSON: Error </p></li><li class="listitem"><p> <code>'null'</code>: JSON <code>null</code> </p></li></ul> </div> </td> </tr><tr> <td><code>BigInt</code></td> <td>Error</td> </tr><tr> <td><code>Object</code></td> <td>JSON object or error (see text following table)</td> </tr><tr> <td><code>Array</code></td> <td>JSON array</td> </tr><tr> <td><code>Symbol</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Inside an object: ignored </p></li><li class="listitem"><p> Inside an array: JSON <code>null</code> </p></li></ul> </div> Scalar value: Error</td> </tr></tbody></table>

Notes:

* A value within a container such as a JSON array or JSON object is converted (loss of precision is possible for `Number` values). A scalar value throws an error.

* JavaScript `BigInt` values cannot be converted to MySQL JSON; attempting to perform such a conversion always raises an error, regardless of whether the value is inside a container or not.

* It may or may not be possible to convert a JavaScript `Object` to MySQL JSON, depending on how `toJSON()` is implemented for the object in question. Some examples are listed here:

  + The `toJSON()` method of the JavaScript `Date` class converts a `Date` to a string having invalid JSON syntax, thus throwing a conversion error.

  + For the `Set` class, `toJSON()` returns `"{}"` which is a valid JSON string.

  + For JSON-like objects, `toJSON()` returns a valid JSON string.

**Conversion to and from MySQL ENUM and SET.** `ENUM` converts to a JavaScript `String`; `SET` converts to a JavaScript `Set` object, as shown in the following table:

**Table 27.6 Conversion of the MySQL ENUM and SET types to JavaScript**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <td>MySQL Type</td> <td>JavaScript Type</td> </tr></thead><tbody><tr> <td><code>ENUM</code></td> <td><code>String</code></td> </tr><tr> <td><code>SET</code></td> <td><code>Set</code></td> </tr></tbody></table>

The following table shows rules for converting a JavaScript type to a MySQL `ENUM` or `SET` type:

**Table 27.7 Type Conversion: JavaScript types to MySQL ENUM and SET**

<table border="1" class="table" summary="Conversion of JavaScript types to the MySQL ENUM and SET types"><colgroup><col/><col/><col/></colgroup><thead><tr><th scope="col">JavaScript Type</th><th scope="col">To MySQL <code>ENUM</code></th><th scope="col">To MySQL <code>SET</code></th></tr></thead><tbody><tr><td scope="row">String</td><td>Preserve value; check whether string is valid <code>ENUM</code> value</td><td>Preserve value; check whether string is valid <code>SET</code> value</td></tr><tr><td scope="row"><code>null</code>, <code>undefined</code></td><td><code>NULL</code></td><td><code>NULL</code></td></tr><tr><td scope="row"><code>Set</code></td><td>Error</td><td>Convert to comma-separated string; check whether string is valid <code>SET</code> value</td></tr><tr><td scope="row">Any other type</td><td>Error</td><td>Error</td></tr></tbody></table>

Additional notes

* All values used in or for `ENUM` or `SET` values or their JavaScript equivalents must employ the `utf8mb4` character set. See Section 12.9.1, “The utf8mb4 Character Set (4-Byte UTF-8 Unicode Encoding)”"), for more information.

* The server SQL mode can affect how an invalid JavaScript value is handled when attempting to insert it into an `ENUM` or `SET` column. When strict mode is in effect (the default), an invalid value throws an error; otherwise, an empty string is inserted, with a warning. See Section 7.1.11, “Server SQL Modes”.

**Conversion to and from MySQL DECIMAL and NUMERIC.** MySQL decimal types (`DECIMAL` - DECIMAL, NUMERIC") and `NUMERIC` - DECIMAL, NUMERIC")) are converted to either of JavaScript `String` or `Number`, depending on the value of `session.options.decimalType` (`STRING` or `NUMBER`, respectively). The default behavior is to convert such values to `String`.

To set this variable on the session level so that MySQL decimal types are converted to `Number` by default instead, call `mle_set_session_state()` like this:

```
mle_set_session_state("decimalType":"NUMBER")
```

The MLE stored program cache must be empty when this function is invoked; it is not empty, you can clear it using `mle_session_reset()`. See the description of `mle_set_session_state()` for more information.

To set the `decimalType` option within a JavaScript stored routine, use `Session.setOptions()`, as shown here:

```
session.setOptions('{"decimalType":"mysql.DecimalType.NUMBER"}')
```

This sets the default for conversion of MySQL decimal values to `Number` for the lifetime of the routine. Use `mysql.DecimalType.STRING` to make `String` the default.

Rules for conversion of JavaScript values to the MySQL `DECIMAL` type (or its alias `NUMERIC`) are shown in the following table:

**Table 27.8 Type Conversion: JavaScript types to MySQL DECIMAL**

<table border="1" class="table" summary="Conversion of JavaScript types to the MySQL DECIMAL type"><colgroup><col/><col/></colgroup><thead><tr><th scope="col">JavaScript Type</th><th scope="col">Returns</th></tr></thead><tbody><tr><td scope="row"><code>Object</code>, <code>Array</code>, or <code>Symbol</code></td><td>Error: Conversion not supported</td></tr><tr><td scope="row"><code>Boolean</code>, <code>Number</code>, <code>String</code>, or <code>BigInt</code></td><td><code>DECIMAL</code> value</td></tr><tr><td scope="row"><code>null</code>, <code>undefined</code></td><td>SQL <code>NULL</code></td></tr></tbody></table>

The maximum which a decimal value can hold is determined by the precision and scale of `DECIMAL(M, D)`, where *`M`* is the precision (maximum number of digits) in the range 1-65, and *`D`* is scale (the number of digits to the right of the decimal point, with the range 0-30. In addition, *`M`* must be greater than or equal to *`D`*. (See Section 13.1.3, “Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC” - DECIMAL, NUMERIC"), for more information.)

In the event that a decimal value exceeds the range specified by `DECIMAL(M, D)` or cannot be stored within the constraints of `DECIMAL(M, D)`, the behavior depends on the server SQL mode (see Section 7.1.11, “Server SQL Modes”), as follows:

* *Strict SQL Mode*: An error is raised, and the operation fails.

* *Otherwise*: The value is automatically capped to the nearest valid minimum or maximum value for the range given, and a warning is issued.

**Time zone support.** A JavaScript stored program uses the MySQL session timezone in effect at the time it is first invoked. This time zone remains in effect for this stored program for the duration of the session in the session.

Changing the MySQL session time zone is not automatically reflected in stored programs which have been used and thus are already cached. To make them use the new time zone, call `mle_session_reset()` to clear the cache; after this, stored programs use the new time zone.

Supported time zone types are listed here:

* Time zone offsets from UTC, such as `+11:00` or `-07:15`.

* Timezones defined in the [IANA time zone database](https://www.iana.org/time-zones) are supported, with the exception of configurations using leap seconds. For example, `Pacific/Nauru`, `Japan`, and `MET` are supported, while `leap/Pacific/Nauru` and `right/Pacific/Nauru` are not.

Range checks and invalid type conversion checks are performed following stored program execution. Casting is done inside JavaScript using type constructors such as `Number()` and `String()`; rounding to `Integer` is performed using `Math.round()`.

An input argument (`IN` or `INOUT` parameter) named in a JavaScript stored program definition is accessible from within the routine body using the same argument identifier. Output arguments (`INOUT` and `OUT` parameters) are also available in JavaScript stored procedures. The same argument identifier can be used to set the value using the JavaScript assignment (`=`) operator. As with SQL stored procedure `OUT` arguments, the initial value is set to JavaScript `null`.

Caution

You should *not* override program arguments using `let`, `var`, or `const` inside JavaScript stored programs. Doing so turns them into variables which are local to the program, and makes any values passed into the program using the same-named parameters inaccessible.

Example:

```
mysql> CREATE FUNCTION myfunc(x INT)
    ->   RETURNS INT LANGUAGE JAVASCRIPT AS
    -> $$
    $>   var x
    $>
    $>   return 2*x
    $> $$
    -> ;
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT myfunc(10);
ERROR 6000 (HY000): MLE-Type> Cannot convert value 'NaN' to INT
from MLE in 'myfunc(10)'
```

The JavaScript `return` statement should be used to return scalar values in stored functions. In stored procedures, this statement does not return a value, and merely exits the code block (this may or may not also exit the routine depending on program flow). `return` cannot be used to set stored procedure `OUT` or `INOUT` argument values; these must be set explicitly within the routine.

For information about accessing MySQL stored procedures and stored functions from within JavaScript stored routines, see Section 27.3.6.10, “Stored Routine API”.


### 27.3.5 JavaScript Stored Programs—Session Information and Options

For general information about stored routines in MySQL, see Section 27.2, “Using Stored Routines”.

The MLE component provides a number of loadable functions for working with MLE user sessions. These functions are listed and described here:

* `mle_session_reset()`

  Calling this function with no arguments cleans up the current MLE session state, removing any observable output from `mle_session_state()`. It also resets the session time zone, so that subsequent calls to JavaScript stored routines use the time zone set most recently in the session.

  This function accepts an optional string argument. Possible values and their effects are listed here:

  + `"stdout"`: Clears `stdout`.

  + `"stderr"`: Clears `stderr`.

  + `"output"`: Clears both `stdout` and `stderr`.

  Calling this function with no arguments continues to work as it did in previous versions of MySQL, clearing both `stderr` and `stdout`, as well as clearing the stack trace and resetting the session time zone.

* `mle_session_state()`

  Use this loadable function to obtain session information about the MLE stored program that was most recently executed. `mle_session_state()` takes one argument, a session state key (a string), and displays a session state value. A session state value is limited to a maximum size of 64K (equivalent to 16000 4-byte characters). This is a cyclic buffer; when the available space has been used up, a new entry overwrites the oldest one. Possible session state keys are listed here, with their descriptions:

  + `is_active`: Returns `1` if the current MySQL user session is an MLE session, otherwise `0`.

  + `stdout`: Output anything written by the stored program using `console.log()`.

  + `stderr`: Output anything written by the stored program using `console.error()`.

  + `stack_trace`: If execution of the MLE stored program is unsuccessful, this contains a stack trace which may help in pinpointing the source of the error.

    Syntax and similar errors encountered by an unsuccessful `CREATE FUNCTION` or `CREATE PROCEDURE` statement are not written here, only runtime errors raised during execution of a stored function or stored procedure.

  + `stored_functions`: Returns the number of currently cached stored functions in the current session.

  + `stored_procedures`: Returns the number of currently cached stored procedures in the current session.

  + `stored_programs`: Returns the number of currently cached stored programs (stored functions and stored procedures) in the current session.

  The session state key is a literal string value and must be quoted.

  Prior to the invocation of any MLE stored programs, all three of these session state values are empty. Exiting the client and restarting the session clears all of them.

  The next two examples illustrate retrieval of the session state values. We begin by creating a stored procedure `mle_states()` that displays all session state values, like this:

  ```
  mysql> delimiter //
  mysql> CREATE PROCEDURE mle_states()
      -> BEGIN
      ->   SELECT
      ->     mle_session_state("is_active") AS '-ACTIVE-',
      ->     mle_session_state("stdout") AS '-STDOUT-',
      ->     mle_session_state("stderr") AS '-STDERR-',
      ->     mle_session_state("stack_trace") AS '-STACK-',
      ->     mle_session_state("stored_functions") AS '-FUNCS-',
      ->     mle_session_state("stored_procedures") AS '-PROCS-',
      ->     mle_session_state("stored_programs") AS '-PROGS-';
      -> END//
  Query OK, 0 rows affected (0.02 sec)

  mysql> delimiter ;
  ```

  Prior to running any MLE stored programs, all of the values in the output from `mle_states()` are `0` or empty, as shown here:

  ```
  mysql> CALL mle_states();
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 0        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Now we create a JavaScript stored procedure `pc1()` that uses `console.log()` and `console.error()` in a short loop to write multiple times to `stdout` and to `stderr`, like this:

  ```
  mysql> CREATE PROCEDURE pc1()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>
      $>   do  {
      $>     console.log(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

  Following the execution of the [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements") statement just shown, `mle_states()` shows an active MLE session. No stored programs have yet been run, so none have been cached; this means the columns reflecting JavaScript stored functions, procedures, and programs all show `0`. The output is shown here:

  ```
  mysql> CALL mle_states;
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 1        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Note

  Quoting strings with backtick (`` ` ``) characters allows us to use variable interpolation in the output. If you are unfamiliar with this quoting mechanism, see [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) at Mozilla Developer for more information.

  Invoking `pc1()` followed by `mle_states()` produces the result shown here:

  ```
  mysql> CALL pc1();
  Query OK, 0 rows affected (0.00 sec)

  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

   -STACK-:
   -FUNCS-: 0
   -PROCS-: 1
   -PROGS-: 1
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Executing the stored procedure starts an MLE session, so `is_active` (`-ACTIVE-`) is now `1`.

  Successive writes to `stdout` or `stderr` within the same session are appended to any existing content. To see this, call `pc1()` again, then check the output from `mle_states()`, as shown here:

  ```
  mysql> CALL pc1();
  Query OK, 0 rows affected (0.00 sec)

  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.
  This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.
  This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

   -STACK-:
   -FUNCS-: 0
   -PROCS-: 1
   -PROGS-: 1
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Since no errors were produced by `pc1()`, the stack trace remains empty. To test the stack trace, we can create a modified copy of `pc1()` in which we change the reference to `console.log()` to the undefined function `console.lob()`, like this:

  ```
  mysql> CREATE PROCEDURE pc2()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>   do  {
      $>     console.lob(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

  ```
  CREATE PROCEDURE pc2()
  LANGUAGE JAVASCRIPT AS
    $$
     let x = 0
     do  {
       console.lob(`This is message #${++x} to stdout.`)
       console.error(`This is message #${x} to stderr.`)
     }
     while(x < 3)
    $$
  ;
  ```

  ```
  mysql> CREATE PROCEDURE pc2()
      -> LANGUAGE JAVASCRIPT AS
      -> $$
      $>   let x = 0
      $>   do  {
      $>     console.lob(`This is message #${++x} to stdout.`)
      $>     console.error(`This is message #${x} to stderr.`)
      $>   }
      $>   while(x < 3)
      $> $$
      -> ;
  Query OK, 0 rows affected (0.02 sec)
  ```

  The `CREATE PROCEDURE` statement runs successfully, but when we attempt to invoke `pc2()`, an error results, as shown here:

  ```
  mysql> CALL pc2();
  ERROR 6113 (HY000): JavaScript> TypeError: (intermediate value).lob is not a function
  ```

  Following this, when we invoke `mle_states()` again, we see that, since we are within the same session, the `stdout` and `stderr` fields still contain the content written to them previously. The stack trace from the error just shown is displayed in the last column of the output:

  ```
  mysql> CALL mle_states()\G
  *************************** 1. row ***************************
  -ACTIVE-: 1
  -STDOUT-: This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.
  This is message #1 to stdout.
  This is message #2 to stdout.
  This is message #3 to stdout.

  -STDERR-: This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.
  This is message #1 to stderr.
  This is message #2 to stderr.
  This is message #3 to stderr.

  -STACK-: <js> pc2:3:6-54

  -FUNCS-: 0
  -PROCS-: 2
  -PROGS-: 2
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  In addition the values of the `stored_functions`, `stored_procedures`, and `stored_programs` keys for `mle_session_state()` are `0`, `2`, and `2`, respectively—we have created 2 stored JavaScript procedures, and no JavaScript stored functions, for a total of 2 JavaScript stored programs.

  The stack trace does not persist between JavaScript stored program invocations.

  To clear all information from all fields in the output of `mle_states()`, call `mle_session_reset()`, like this:

  ```
  mysql> SELECT mle_session_reset();
  mysql> SELECT mle_session_reset();
  +------------------------------------------+
  | mle_session_reset()                      |
  +------------------------------------------+
  | The session state is successfully reset. |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Invoking `mle_states()` again produces the same as the initial result, before any stored JavaScript stored programs had been used.

  ```
  mysql> CALL mle_states;
  +----------+----------+----------+---------+---------+---------+---------+
  | -ACTIVE- | -STDOUT- | -STDERR- | -STACK- | -FUNCS- | -PROCS- | -PROGS- |
  +----------+----------+----------+---------+---------+---------+---------+
  | 0        |          |          |         | 0       | 0       | 0       |
  +----------+----------+----------+---------+---------+---------+---------+
  1 row in set (0.00 sec)

  Query OK, 0 rows affected (0.00 sec)
  ```

  Alternatively, you can clear `stdout` and `stderr` from within a JavaScript routine using `console.clear()`.

* `mle_set_session_state()`

  The MLE component provides this function as a means for determining the rules in effect during the current session for converting MySQL integer types (`TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BIGINT`) and MySQL decimal types (`DECIMAL` - DECIMAL, NUMERIC"), `NUMERIC` - DECIMAL, NUMERIC")) to JavaScript values. These rules apply to input arguments to JavaScript programs as well as to values in result sets.

  Possible conversion rules for integer types (key: `integer_type`) are listed here by name:

  + `BIGINT`: Always convert to JavaScript `BigInt`.

  + `STRING`: Always convert to JavaScript `String`.

  + `UNSAFE_BIGINT`: If the value is safe, convert to JavaScript `Number`; otherwise convert to JavaScript `BigInt`.

  + `UNSAFE_STRING`: If the value is safe, convert to JavaScript `Number`; otherwise convert to JavaScript `String`. This is the default behavior if no rule is specified.

  In the context of these conversion rules, “safe” means that the value to be converted is in the range of `-(253-1)` (`-9007199254740991`) to `(253-1)` (`9007199254740991`), inclusive.

  MySQL decimal types can be converted to JavaScript `Number` or `String` values; to determine which of these types is used, call `mle_set_session_state()` with the key `decimal_type`. This can have either of the following two values:

  + `STRING`: a MySQL `DECIMAL` or `NUMERIC` value is converted to a JavaScript `String`.

  + `NUMBER`: a MySQL `DECIMAL` or `NUMERIC` value is converted to a JavaScript `Number`.

  If not overriden by `mle_set_session_state()` or, within a JavaScript stored routine, by `Session.setOptions()`, the default is to convert MySQL decimal types to JavaScript `String`.

  This function can be invoked only if there are no cached stored programs in the current user session. When successful, the function returns `1`. Otherwise, attempting to invoke it raises an error, as shown here:

  ```
  mysql> SELECT gcd(536, 1676); // Call JS stored function
  +----------------+
  | gcd(536, 1676) |
  +----------------+
  |              4 |
  +----------------+
  1 row in set (0.00 sec)

  mysql> SELECT mle_set_session_state('{"integer_type":"BIGINT"}');
  ERROR 1123 (HY000): Can't initialize function 'mle_set_session_state'; Cannot
  set options of an active session. Please reset the session first.
  ```

  As the error message suggests, you must reset the session to clear the active session. To do this, use `mle_session_reset()`, like this:

  ```
  mysql> SELECT mle_session_reset();
  +------------------------------------------+
  | mle_session_reset()                      |
  +------------------------------------------+
  | The session state is successfully reset. |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Now you can call `mle_set_session_state()` as shown here:

  ```
  mysql> SELECT mle_set_session_state('{"integer_type":"BIGINT"}');
  +----------------------------------------------------+
  | mle_set_session_state('{"integer_type":"BIGINT"}') |
  +----------------------------------------------------+
  |                                                  1 |
  +----------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT mle_set_session_state('{"decimal_type":"Number"}');
  +----------------------------------------------------+
  | mle_set_session_state('{"decimal_type":"Number"}') |
  +----------------------------------------------------+
  |                                                  1 |
  +----------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  You can set the conversion type for a specific query prior to executing it using JavaScript API `Session` methods such as `sql()`, `runSql()`, and `prepare()`. See the description of `Session.sql()` for more information and examples.

You can obtain information about resource usage by the MLE component by querying the Performance Schema `memory_summary_by_thread_by_event_name` and `memory_summary_global_by_event_name` tables using the key `memory/language_component/session`, which tracks memory usage by each MLE user session. This key is provided by the MLE component; it is included in the `setup_instruments` table when the MLE component is installed, as shown here:

```
mysql> SELECT * FROM performance_schema.setup_instruments
     > WHERE NAME LIKE '%language_component%'\G
*************************** 1. row ***************************
         NAME: memory/language_component/session
      ENABLED: YES
        TIMED: NULL
   PROPERTIES: controlled_by_default
        FLAGS: controlled
   VOLATILITY: 0
DOCUMENTATION: Session-specific allocations for the Language component
1 row in set (0.00 sec)
```

Prior to creating executing or executing any JavaScript stored programs, queries, MLE remains inactive, so that using this key returns results which are empty, or consist chiefly of zeroes, like those shown here:

```
mysql> SELECT * FROM performance_schema.memory_summary_by_thread_by_event_name
    -> WHERE
    ->   EVENT_NAME = 'memory/language_component/session'
    ->     AND
    ->   COUNT_ALLOC < 0\G
Empty set (0.02 sec)

mysql> SELECT * FROM performance_schema.memory_summary_global_by_event_name
    -> WHERE EVENT_NAME LIKE 'memory/language_component/%'\G
*************************** 1. row ***************************
                  EVENT_NAME: memory/language_component/session
                 COUNT_ALLOC: 0
                  COUNT_FREE: 0
   SUM_NUMBER_OF_BYTES_ALLOC: 0
    SUM_NUMBER_OF_BYTES_FREE: 0
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 0
             HIGH_COUNT_USED: 0
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 0
   HIGH_NUMBER_OF_BYTES_USED: 0
1 row in set (0.01 sec)
```

After invoking a JavaScript stored function, the same queries now reflect the memory consumed by MLE, as shown here:

```
mysql> SELECT * FROM performance_schema.memory_summary_by_thread_by_event_name
    -> WHERE
    ->   EVENT_NAME = 'memory/language_component/session'
    ->     AND
    ->   COUNT_ALLOC < 0\G
*************************** 1. row ***************************
                   THREAD_ID: 46
                  EVENT_NAME: memory/language_component/session
                 COUNT_ALLOC: 25
                  COUNT_FREE: 20
   SUM_NUMBER_OF_BYTES_ALLOC: 4445
    SUM_NUMBER_OF_BYTES_FREE: 2989
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 5
             HIGH_COUNT_USED: 14
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 1456
   HIGH_NUMBER_OF_BYTES_USED: 3239
1 row in set (0.00 sec)

mysql> SELECT * FROM performance_schema.memory_summary_global_by_event_name
    -> WHERE EVENT_NAME LIKE 'memory/language_component/%'\G
*************************** 1. row ***************************
                  EVENT_NAME: memory/language_component/session
                 COUNT_ALLOC: 25
                  COUNT_FREE: 20
   SUM_NUMBER_OF_BYTES_ALLOC: 4445
    SUM_NUMBER_OF_BYTES_FREE: 2989
              LOW_COUNT_USED: 0
          CURRENT_COUNT_USED: 5
             HIGH_COUNT_USED: 14
    LOW_NUMBER_OF_BYTES_USED: 0
CURRENT_NUMBER_OF_BYTES_USED: 1456
   HIGH_NUMBER_OF_BYTES_USED: 3239
1 row in set (0.00 sec)
```

For more information about these and related Performance Schema tables, see Section 29.12.20.10, “Memory Summary Tables”.

Memory usage by the MLE component in a given user session is subject to the limit imposed by the `connection_memory_limit` server system variable. See the description of this variable for more information.


### 27.3.6 JavaScript SQL API

This section provides reference information for the SQL and result set API supported by JavaScript stored routines in the MLE Component.

The API supports the top-level objects listed here:

* `Column`: Result set column metadata.

* `PreparedStatement`: Handler for execution of prepared statements.

* `Row`: Row in a result set.
* `Session`: MySQL user session. For information about `Session` transactional methods such as `startTransaction()`, `commit()`, and `rollback()`, see Section 27.3.6.11, “JavaScript Transaction API”.

* `SqlExecute`: Handler for execution of (simple) SQL statements. Its `execute()` method executes an SQL statement.

* `SqlResult`: Result set returned by an SQL statement.

* `Warning`: Warning raised by statement execution.

The SQL API can be used only within JavaScript stored procedures, and cannot be used within JavaScript stored functions.


#### 27.3.6.1 Session Object

The `Session` object is always available as the `session` property of the global object. `Session` has the methods listed here:

* `createSchema(String name)`: Creates a database having the specified *`name`*, and returns the corresponding `Schema` object.

* `dropSchema(String name)`: Drops the database having the specified *`name`*. The return value is undefined.

* `getDefaultSchema()`: Returns a `Schema` corresponding to the default (current) database.

* `getOption(String name)`: Gets the value of statement option *`name`*. Returns a string or a true-false value depending on the option type.

* `getSchema(String name)`: Gets the `Schema` object having the supplied *`name`* if the corresponding schema exists, otherwise throwing an error.

* `getSchemas()`: Returns a list of all available `Schema` objects.

* `prepare(String sql, {passResultToClient: Bool, charsetName: String})`: Enables the execution of a prepared statements; takes an SQL statement and returns a `PreparedStatement` object.

  Calling this method is equivalent to executing a `PREPARE` statement in the **mysql** client.

* `quoteName(String name)`: Returns *`name`*, after escaping it.

* `runSql(String query[[, Array statementParameters], Options options])`: Executes a query, with any options specified, and using an optional list of statement parameters; it returns an `SqlResult`.

* `setOptions(Object options)`: Sets statement option defaults. Options not specified assume their default values. See the description of `Session.sql()` for option names and possible values.

* `sql(String sql, {passResultToClient: Bool, charsetName: String, integerType: IntegerType, decimalType: DecimalType})`: Executes a simple SQL statement. Can also be used to provide attributes overriding the `passResultToClient` and `charsetName` values set in the session. Returns an `SqlExecute` object.

  *`IntegerType`* consists of a JSON key-value pair whose key is `IntegerType`, and whose possible values and their effects are listed here:

  + `mysql.IntegerType.BIGINT`: Convert all MySQL integer values to JavaScript `BigInt`.

  + `mysql.IntegerType.STRING`: Convert all MySQL integer values to JavaScript `String`

  + `mysql.IntegerType.UNSAFE_BIGINT`: If the MySQL value is safe, convert it to JavaScript `Number`; otherwise convert it to JavaScript `BigInt`. If the value is safe, convert to JavaScript `Number`; otherwise convert to JavaScript `String`. This is the default behavior if no rule is specified.

  + `mysql.IntegerType.UNSAFE_STRING`: If the MySQL value is safe, convert it to JavaScript `Number`; otherwise convert it to JavaScript `String`. This is the default behavior if no rule is specified.

  The rule set by this value determines how MySQL integer values are converted to JavaScript by this SQL statement. Their names (less object references) correspond to those for the used with the `integer_type` key used with `mle_set_session_state()`. The default behavior is equivalent to having set `mysql.IntegerType.UNSAFE_STRING`, or having called `mle_set_session_state('{"integer_type":"STRING"}')`.

  *`DecimalType`* consists of a JSON key-value pair whose key is `DecimalType`, and whose possible values and their effects are listed here:

  + `mysql.DecimalType.STRING`: Convert MySQL decimal values (`DECIMAL` - DECIMAL, NUMERIC") and its alias `NUMERIC`) to JavaScript `String` values. (This is the default behavior.)

  + `mysql.DecimalType.NUMBER`: Convert MySQL decimal values to JavaScript `Number`.

  These options can also be set for a given statement using `runSQL()` or `prepare()`. To set them on the session or routine level, you can also use `setOptions()`.

JavaScript transactional functions are also methods of `Session`. See Section 27.3.6.11, “JavaScript Transaction API” for descriptions and examples.

##### Accessing Session Variables from JavaScript

You can access MySQL session variables as properties of the `Session` object, as shown in this example:

```
mysql> SET @myvar = 27;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE PROCEDURE get_session_var() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>     let the_var = session.myvar
    $>
    $>     console.log("the_var: " + the_var)
    $>     console.log("typeof the_var: " + typeof the_var)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL get_session_var();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): the_var: 27
typeof the_var: number

mysql> SET @myvar = "Something that is not 27";
Query OK, 0 rows affected (0.00 sec)

mysql> CALL get_session_var();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): the_var: Something that is not 27
typeof the_var: string

1 row in set (0.00 sec)
```

You can also set session variables by accessing them in the same way, as shown here:

```
mysql> CREATE PROCEDURE set_session_var(IN x INT) LANGUAGE JAVASCRIPT
    -> AS $$
    $>   session.myvar = x
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL set_session_var(72);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @myvar;
+--------+
| @myvar |
+--------+
|     72 |
+--------+
1 row in set (0.00 sec)
```

Session variables accessed as `Session` properties in JavaScript are created automatically if they do not already exist, as shown in this example:

```
mysql> CREATE PROCEDURE set_any_var(IN name VARCHAR, IN val INT)
    ->   LANGUAGE JAVASCRIPT
    -> AS $$
    $>   session[name] = val
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @yourvar;
+--------------------+
| @yourvar           |
+--------------------+
| NULL               |
+--------------------+
1 row in set (0.00 sec)

mysql> CALL set_any_var("myvar", 25);
Query OK, 0 rows affected (0.01 sec)

mysql> CALL set_any_var("yourvar", 100);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @myvar, @yourvar;
+--------+----------+
| @myvar | @yourvar |
+--------+----------+
|     25 |      100 |
+--------+----------+
1 row in set (0.00 sec)
```

Rules for type conversion from MySQL session variables to JavaScript variables are shown in the following table:

<table border="1" class="informaltable" summary="Type conversion: MySQL session variables to JavaScript variables"><colgroup><col/><col/><col/></colgroup><thead><tr><th scope="col">MySQL type</th><th scope="col">JavaScript type</th><th scope="col">Comments</th></tr></thead><tbody><tr><td scope="row"><code>NULL</code></td><td><code>null</code></td><td>-</td></tr><tr><td scope="row"><code>BIGINT</code></td><td><code>Number</code>, <code>String</code>, or <code>BigInt</code></td><td>Depends on <code>session.sql()</code> method <code>integerType</code> option value</td></tr><tr><td scope="row"><code>DECIMAL</code> or <code>NUMERIC</code></td><td><code>String</code> or <code>Number</code></td><td>Depends on <code>session.sql()</code> method <code>decimalType</code> option value</td></tr><tr><td scope="row"><code>DOUBLE</code></td><td><code>Number</code></td><td>-</td></tr><tr><td scope="row">Binary string</td><td><code>Uint8Array</code></td><td>-</td></tr><tr><td scope="row">String</td><td><code>String</code></td><td>-</td></tr></tbody></table>

Rules for type conversion from JavaScript variables to MySQL session variables are shown in the following table:

<table border="1" class="informaltable" summary="Type conversion: JavaScript variables to MySQL session variables"><colgroup><col/><col/><col/></colgroup><thead><tr><th scope="col">JavaScript type</th><th scope="col">MySQL type</th><th scope="col">Comment</th></tr></thead><tbody><tr><td scope="row"><code>null</code> or <code>undefined</code></td><td><code>NULL</code></td><td>-</td></tr><tr><td scope="row"><code>Boolean</code></td><td><code>BIGINT</code></td><td>-</td></tr><tr><td scope="row"><code>Number</code></td><td><code>BIGINT</code>, <code>DECIMAL</code>, or <code>DOUBLE</code></td><td>-</td></tr><tr><td scope="row"><code>Infinity</code>, <code>NaN</code>, or <code>Symbol</code></td><td>-</td><td>Error: Type cannot be used for session variables</td></tr><tr><td scope="row"><code>String</code></td><td>string</td><td>-</td></tr><tr><td scope="row"><code>BigInt</code></td><td><code>BIGINT</code></td><td>-</td></tr><tr><td scope="row"><code>TypedArray</code> or <code>Float32Array</code></td><td><code>BINARY</code></td><td>-</td></tr><tr><td scope="row"><code>Object</code></td><td>string</td><td>-</td></tr><tr><td scope="row"><code>Array</code></td><td>string</td><td>-</td></tr></tbody></table>

##### JavaScript Localization and Internationalization

JavaScript stored programs in MySQL support MySQL locales. Localization and internationalization are handled using the `Intl` global object.

MySQL locale names map to JavaScript locale names by replacing the underscore character with a dash. This can be seen in the following example, which shows how to retrieve the current locale:

```
mysql> SET @@lc_time_names = "sv_SE";

mysql> CREATE PROCEDURE lc1() LANGUAGE JAVASCRIPT
mysql>   AS
mysql>   $$
mysql>     const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale
mysql>     console.log("Default Locale: ", defaultLocale)
mysql>   $$;

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: sv-SE |
+-----------------------------+
1 row in set (0.04 sec)
```

It is also possible to override the session locale within a JavaScript stored program; here, we show the same number displayed twice in succession using a different locale each time:

```
mysql> SET @@lc_time_names = "fr_FR";
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE PROCEDURE lc2() LANGUAGE JAVASCRIPT
mysql>   AS
mysql>   $$
mysql>     const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale
mysql>     const n = 1234567.89;
mysql>     console.log("Default Locale (", defaultLocale, "): ", n.toLocaleString());
mysql>     console.log("ja_JP Locale: ", n.toLocaleString("ja-JP"));
mysql>   $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL lc2();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+--------------------------------------+
| mle_session_state("stdout")          |
+--------------------------------------+
| Default Locale (fr-FR): 1 234 567,89
  Using ja_JP locale: 1,234,567.89     |
+--------------------------------------+
1 row in set (0.04 sec)
```

You can use `toLocaleString()` and other such methods to specify the locale for numbers and dates. For currency and other special numeric values, create an instance of `NumberFormat` having the appropriate properties.

A JavaScript stored program continues to use by default the session locale setting that was in effect the first time it was invoked is executed during a given session remains in effect, even if the session locale setting is changed, until the session is reset. (This does not affect the result of `toLocaleString()` or `NumberFormat` called with an explicit locale.) If `lc_time_names` is updated, call `mle_session_reset()` to cause any existing stored programs to use the new locale setting by default instead. An example is shown here:

```
mysql> SELECT @@lc_time_names;
+-----------------+
| @@lc_time_names |
+-----------------+
| fr_FR           |
+-----------------+
1 row in set (0.00 sec)

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: fr-FR |
+-----------------------------+
1 row in set (0.04 sec)

mysql> SET @@lc_time_names = "ja_JP";
+-----------------+
| @@lc_time_names |
+-----------------+
| ja_JP           |
+-----------------+
1 row in set (0.00 sec)

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: fr-FR |
+-----------------------------+
1 row in set (0.04 sec)

mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.01 sec)

mysql> CALL lc1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout");
+-----------------------------+
| mle_session_state("stdout") |
+-----------------------------+
|       Default Locale: ja-JP |
+-----------------------------+
1 row in set (0.04 sec)
```


#### 27.3.6.2 SqlExecute Object

`SqlExecute` has the following methods:

* `execute()`: Executes the SQL statement and returns an `SqlResult`.

* `getOption(String optionName)`: Gets the value for the named option to this statement. Supported values are `passResultToClient` and `charsetName`. Returns a string or true/false value, depending on the option's type.


#### 27.3.6.3 SqlResult Object

An `SqlResult` is produced whenever a query is executed using `sqlExecute.execute()`, `PreparedStatement.execute()`, or `Session.runSql()`.

Note

No `SqlResult` is produced if `passResultsToClient` is used.

Methods supported by `SqlResult` are listed here:

* `close()`: Closes the result set. The value returned is undefined.

* `fetchAll()`: Retrieves a list of all rows in the result set.

* `fetchOne()`: Retrieves the next `Row` in the result set.

* `getAffectedItemsCount()`: Retrieves the number of rows affected by the most recent operation.

* `getAutoIncrementValue()`: Retrieves the autogenerated ID used for the most recent insert operation.

  Calling this method is equivalent to executing `LAST_INSERT_ID()` in the **mysql** client.

* `getColumnCount()`: Gets the number of columns in the result set.

* `getColumnNames()`: Retrieves the names of the columns in the current result set.

* `getColumns()`: Retrieves the columns metadata in the current result set.

* `getExecutionTime()`: Retrieves the time spent executing this query, to the nearest whole second.

* `getWarnings()`: Retrieves any warnings (as a list of `Warning` objects) raised by the operation most recently executed.

* `getWarningsCount()`: Retrieves the number of warnings raised by the operation last executed.

* `hasData()`: Returns `true` if the most recently executed statement yielded a result set, `false` otherwise.

* `nextResult()`: Moves to the next result set if available. Returns `true` if the result set is available and contains data.


#### 27.3.6.4 Schema Object

The `Schema` object represents a database schema. You can obtain an instance of `Schema` by calling the `Session` object's `getSchema()` method; you can also obtain a list of all available databases by calling `getSchemas()`.

Schema supports the methods listed here:

* `existsInDatabase()`: Returns `true` if the schema exists, otherwise `false`.

* `getTable(String name)`: Returns the `Table` having the specified *`name`*.

* `getTables()`: Returns a list of tables (`Table` objects) existing within this `Schema`.

* `getName()`: Returns the name of the `Schema` (a `String`).

* `getName()`: Returns the `Schema` itself.

* `getSession()`: Returns the `Session` object corresponding to the current session.


#### 27.3.6.5 Table Object

The `Table` object represents a database table

* `existsInDatabase()`: Returns `true` if the table exists in the current database, otherwise `false`.

* `count()`: Returns the number of rows in this table if it exists in the current database, otherwise throws an error.

* `isView()`: Returns `true` if the table is a view, otherwise `false`.

  See also Section 27.6, “Using Views”, for further information about database views in MySQL.

* `getName()`: Returns the name of the `Table` (a `String`).

* `getName()`: Returns the `Schema` in which this table resides.

* `getSession()`: Returns the `Session` object corresponding to the current session.


#### 27.3.6.6 Column Object

The `Column` object represents the column metadata in a result set. `Column` has the methods listed here:

* `getFractionalDigits()`: Gets the fractional digits of the column value, if applicable. Returns an integer.

* `getLength()` Retrieves the length of the column, as an integer.

* `getCharacterSetName()`: Retrieves the name of the character set used by the column.

  See Chapter 12, *Character Sets, Collations, Unicode*, for more information about MySQL character sets and collations.

* `getCollationName()` Retrieves the name of the character set collation used by the column.

  See Chapter 12, *Character Sets, Collations, Unicode*, for more information about MySQL character sets and collations.

* `getColumnLabel()`: Returns a string value representing the column alias, or the column name if no alias is defined.

* `getColumnName()`: Returns a string value representing the column name.

* `getSchemaName()`: Gets the name of the schema in which the column is defined.

* `String getTableLabel()`: Retrieves the alias for the table in which the column occurs.

* `getTableName()`: Gets the name of the table in which the column occurs.

* `getType()`: Retrieves the column's type (a `Type` object).

* `isNumberSigned()`: Indicates whether a numeric column is signed (`true` if it is signed).

* `isPadded()`: If `true`, padding is used for the column value.

All of the methods just listed return strings unless otherwise indicated.


#### 27.3.6.7 Row Object

A `Row` object models a row in a result set. `Row` provides the methods listed here:

* `getField(String name)`: Returns the value of the first field named *`name`*. You can retrieve the name using `getColumnLabel()`.

* `getLength()`: Returns the number of fields in the row.

In addition, the API provides the following convenience mechanisms for looking up a column value in a given row:

* *`Row` object property lookup*: The column name can be used directly as an object property as long as it is a legal JavaScript identifier.

  Example: `row.my_column`.

* *`Row` object key lookup*: The column name, quoted, can be used as a key name.

  Example: `row['my_column']`.

* *`Row` object index lookup*: A valid column index can be used to look up the column value.

  Example: `row[2]`.


#### 27.3.6.8 Warning Object

`Warning` represents a warning raised by statement execution, and has the following properties:

* `code`: MySQL error code (integer).
* `level`: Warning level. Can be any one of 1 (`NOTE`), 2 (`WARNING`), or 3 (`ERROR`).

* `message`: Text of the warning message; a string.

You can also employ the JavaScript `Error` object, such as obtained from a try-catch block. See Error Handling, for more information.


#### 27.3.6.9 PreparedStatement Object

The `PreparedStatement` object represents a handler for the execution of a prepared statement. It supports the following methods:

* `bind(Value data)`: Registers a list of one or more values to be bound on the execution of the SQL statement. Parameters are bound in the order listed and are type-specific; see Section 27.3.4, “JavaScript Stored Program Data Types and Argument Handling”, for a list of supported data types.

  Prior to a prepared statement's initial execution, all its parameters must be bound to values; failing to do so raises an error when the attempting to call `PreparedStatement.execute()`. Subsequent executions of the prepared statement can be performed using fewer bind parameters than parameter markers in the statement; in this case, the “missing” parameters retain their values from the previous execution.

  Attempting to bind more parameters than parameter markers or to parameters of incorrect types is rejected with an error. Invoking this method after `deallocate()` has been called for this prepared statement also raises an error.

  Returns a reference to the same `PreparedStatement` object on which it was invoked.

* `deallocate()`: Closes the prepared statement and frees associated resources. No `PreparedStatement` or `SqlResult` method calls should be made after this is done.

  Calling this method is equivalent to executing a `DEALLOCATE PREPARE` statement in the **mysql** client.

* `execute()`: Executes the prepared query and returns the corresponding `SqlResult`.

  Calling this method is equivalent to running an `EXECUTE` statement in the **mysql** client.

* `getOption(String optionName)`: get the value of the optionName option for this statement. Only the values `passResultToClient` and `charsetName` are supported.

See Section 27.3.7.2, “Prepared Statements”, for additional information and examples.


#### 27.3.6.10 Stored Routine API

Two functions, listed here, provide JavaScript [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) objects reflecting MySQL stored routines:

* `getFunction()`: Get a `Function` instance given the name of a stored function.

* `getProcedure()`: Get a `Function` instance given the name of a stored procedure.

Use the `close()` method to close the resource associated with the stored routine. An error is thrown if the routine, after it is closed, is called again, or if its `close()` method is called again.

The following example creates two stored functions `getArea()` and `getDiag()`, then creates and runs a JavaScript stored procedure procRect which uses these functions by instantiating them and executing them by means of `Function` objects.

```
mysql> CREATE FUNCTION getArea(w INT, h INT)
    -> RETURNS INT DETERMINISTIC
    -> RETURN w * h;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION getDiag(w INT, h INT)
    ->   RETURNS FLOAT DETERMINISTIC
    ->   RETURN Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE PROCEDURE procRect(IN x INT, IN y INT) LANGUAGE JAVASCRIPT
    -> AS $$
    $>   console.clear()
    $>
    $>   let s = session.getDefaultSchema()
    $>   let f = s.getFunction("getArea")
    $>   let g = s.getFunction("getDiag")
    $>
    $>   let a = x
    $>   let b = y
    $>
    $>   console.log (
    $>                 "Width: " + a + ", Height: " + b + "; Area: " +
    $>                 f(a,b) + "; Diagonal: " + g(a,b)
    $>               )
    $>
    $>   f.close()
    $>   g.close()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL procRect(5, 10);
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Width: 5, Height: 10; Area: 50; Diagonal: 11.180339813232422

1 row in set (0.00 sec)

mysql> CALL procRect(2, 25);
Query OK, 0 rows affected (0.02 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Width: 2, Height: 25; Area: 50; Diagonal: 25.079872131347656

1 row in set (0.00 sec)
```

For stored functions, arguments are simply passed by value, as shown in the examples just shown with `getDiag()` and `getArea()`. For stored procedures, argument handling is as follows:

* `IN` parameter: Parameter values are passed directly.

* `OUT` or `INOUT` parameter: It is necessary to create a placeholder, using the `mysql.arg()`") function, in which to store the output value for the parameter. `my.arg()` is discussed in the next few paragraphs of this section.

**mysql.arg().** This function is always called as a method of the global `mysql` object. It creates an `Argument` object, which can be assigned a value on creation, or by a procedure call. Afterwards, the value can be retrieved as `argument.val`. This is shown in the following example, where argument instances `a` and `b` are created in `use_my_proc()` to act as placeholders for `y` and `z` in `my_proc()`:

```
mysql> CREATE PROCEDURE my_proc(
    ->   IN x INT,
    ->   OUT y VARCHAR(20),
    ->   INOUT z TEXT
    -> )
    -> LANGUAGE JAVASCRIPT
    -> AS $$
    $>     y = "Hello world " + x
    $>     z += "Hello again JS"
    $> $$;
Query OK, 0 rows affected (0.04 sec)

mysql> CREATE PROCEDURE use_my_proc() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>
    $>     let s = session.getDefaultSchema()
    $>     let p = s.getProcedure("my_proc")
    $>
    $>     let a = mysql.arg()
    $>     let b = mysql.arg("World ")
    $>
    $>     p(42, a, b)
    $>
    $>     console.log(a.val)
    $>     console.log(b.val)
    $>
    $>     p.close()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL use_my_proc();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): Hello world 42
World Hello again JS

1 row in set (0.00 sec)
```

Note

An `Argument` can be instantiated only by calling `mysql.arg()`, and accessed only through its `val` property. It is otherwise inaccessible.

Equivalents between the MySQL types of `OUT` or `INOUT` parameters and JavaScript types are shown in the following table:

<table border="1" class="informaltable" summary="Descriptive text"><colgroup><col/><col/><col/></colgroup><thead><tr><th scope="col">MySQL Type</th><th scope="col">Javascript Type</th><th scope="col">Notes</th></tr></thead><tbody><tr><td scope="row"><code>NULL</code></td><td><code>null</code></td><td>-</td></tr><tr><td scope="row"><code>BIGINT</code></td><td><code>Number</code>, <code>String</code>, <code>BigInt</code></td><td>Depends on <code>session.sql()</code> method <code>integerType</code> option value</td></tr><tr><td scope="row"><code>DECIMAL</code></td><td>-</td><td>Error: Unsupported type</td></tr><tr><td scope="row"><code>DOUBLE</code></td><td><code>Number</code></td><td>-</td></tr><tr><td scope="row">Binary string (<code>BINARY</code>, <code>BLOB</code>)</td><td><code>Uint8Array</code></td><td>-</td></tr><tr><td scope="row">Non-binary string (<code>TEXT</code>)</td><td><code>String</code></td><td>-</td></tr><tr><td scope="row"><code>VECTOR</code></td><td><code>Float32Array</code></td><td>-</td></tr><tr><td scope="row"><code>JSON</code></td><td><code>Object</code></td><td>-</td></tr><tr><td scope="row"><code>DATE</code>, <code>DATETIME</code>, <code>TIMESTAMP</code></td><td><code>Date</code></td><td>-</td></tr><tr><td scope="row"><code>ENUM</code></td><td><code>String</code></td><td>-</td></tr><tr><td scope="row"><code>SET</code></td><td><code>Set</code> (<code>String</code>)</td><td>JavaScript <code>Set</code> can be converted to a comma-delimited string</td></tr></tbody></table>


#### 27.3.6.11 JavaScript Transaction API

MLE supports a JavaScript MySQL transaction API which mimics the actions of most MySQL transactional SQL statements. All of the functions listed here, along with their descriptions and SQL equivalents, are methods of the `Session` object:

* `commit()`: Commit the ongoing transaction.

  Equivalent to `COMMIT`.

* `releaseSavepoint()`: Release a given savepoint from an ongoing transaction. Throw an error if the savepoint name is empty.

  Equivalent to [`RELEASE SAVEPOINT`](savepoint.html "15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements").

* `rollback()`: Roll back the ongoing transaction.

  Equivalent to `ROLLBACK`.

* `rollbackTo()`: Go back to an existing savepoint. Throw an error if the savepoint name is empty.

  Equivalent to [`ROLLBACK TO SAVEPOINT`](savepoint.html "15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements").

* `setSavepoint()`: Create a new savepoint with the given name (and return it). If no savepoint name is provided, one is generated.

  Equivalent to `SAVEPOINT`.

* `startTransaction()`: Begin a new transaction.

  Equivalent to [`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

* `autocommit()`: Get or set the value of the `autocommit` system variable: If `session.autocommit()` is called without a value, it returns the current value of `autocommit`; otherwise, it sets the value of `autocommit`.

  Equivalent to [`SET AUTOCOMMIT`](set.html "13.3.7 The SET Type").


#### 27.3.6.12 MySQL Functions

The following SQL built-in functions can be called directly from the `mysql` namespace. These are described in the following list, along with their analogous SQL functions:

* `rand()` (MySQL `RAND()`): Returns a random floating-point value *`v`* in the range 0 <= *`v`* < 1.0.

* `sleep(seconds)` (MySQL `SLEEP()`): Pauses for *`seconds`* seconds, then returns 0.

* `uuid()` (MySQL `UUID()`): Returns a Universal Unique Identifier (UUID).

* `isUUID(argument)` (MySQL `IS_UUID()`): Returns 1 if the *`argument`* is a valid string-format UUID, 0 if it is not a valid UUID, and `NULL` if the argument is `NULL`.


#### 27.3.6.13 SqlError Object

When an `SqlError` is thrown, an error is raised in MySQL similar to how one is raised by a `SIGNAL` statement. You can create an `SqlError` using the constructor shown here:

```
new SqlError(
  sql_state: Number,
  message: String,
  error_number: Number
)
```

The JavaScript stored procedure in the following example tries and throws an `SqlError` created using this constructor. Invoking the procedure raises the error, as can be seen here:

```
mysql> CREATE PROCEDURE test_catch_throw_signal() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>   try {
    $>     throw new mysql.SQLError(45000, 'Some error', 1001)
    $>   } catch (e) {
    $>     console.log(e)
    $>   }
    $> $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CALL test_catch_throw_signal();
Query OK, 0 rows affected (0.04 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
org.graalvm.polyglot.nativeapi.PolyglotNativeAPI$CallbackException: SQL-CALLOUT:
Error code: 1001 Error state: 45000 Error message: `Some error`

1 row in set (0.00 sec)
```

*`sql_state`* and *`error_number`* must be of type `Number`. MLE throws an exception if either of these values is `Infinity` or `NaN`.

You can also invoke `SIGNAL` from JavaScript routine code to throw an exception, similar to what is shown here:

```
mysql> CREATE PROCEDURE test_signal_no_catch() LANGUAGE JAVASCRIPT
    -> AS $$
    $>     console.clear()
    $>     session.runSql("SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT= 'Some error', MYSQL_ERRNO = 1000")
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CALL test_signal_no_catch();
ERROR 1000 (45000): Some error
```


### 27.3.7 Using the JavaScript SQL API

This section discusses the use of the API in executing and in obtaining and processing results from both simple SQL statements and prepared statements. SQL execution in JavaScript is available in stored procedures only, and not in stored functions.

The SQL API supports two types of statements: simple SQL statements (see Section 27.3.7.1, “Simple Statements”) and prepared statements (Section 27.3.7.2, “Prepared Statements”). Prepared statements support bound parameters; simple statements do not.

The maximum number of simple statements which can be open concurrently for execution of stored procedures in a given session is 1024. This number is fixed, and non-configurable by the user. Trying to execute more simple statements than this number at the same time gives rise to an error. Prepared statements executed in JavaScript count towards the global limit determined by `max_prepared_stmt_count`; see the description of this variable for more information.

The result set returned by an SQL statement is buffered in memory. For a simple statement, the size of the (entire) result set is limited to 1 MB; for a prepared statement, any single row may use up to 1 MB. In either case, exceeding the limit raises an error.

Regardless of the type of statement, two mechanisms are available for consuming results. The result set can be processed inside JavaScript or it can be passed directly to the client. See Result Sets, for more information.

You can also can access session data such as temporary tables, session variables, and transaction state. Session variables declared outside stored procedures can be accessed inside stored procedures; the same is true with respect to temporary tables. In addition, a transaction started outside a stored procedure can be committed inside it.

A statement producing a result set containing unsupported data types results in an unsupported type error. For example, statements involving `DESCRIBE`, `EXPLAIN`, or `ANALYZE TABLE` are affected by this limitation, as shown here:

```
mysql> CALL jssp_simple("DESCRIBE t1");
ERROR 6113 (HY000): JavaScript> Unsupported type BLOB/TEXT for 'Type'
mysql> SHOW WARNINGS;
+-------+------+---------------------------------------------------+
| Level | Code | Message                                           |
+-------+------+---------------------------------------------------+
| Error | 6113 | JavaScript> Unsupported type BLOB/TEXT for 'Type' |
+-------+------+---------------------------------------------------+
1 row in set (0.00 sec)
```

Setting a JavaScript local variable from an SQL statement inside a stored procedure is not supported.

The API also supports multiple result sets, such as produced when one stored procedure calls another. Multi-statement queries are not supported, and produce a syntax error.

Some of the examples in this section are based on the `world` example database available from the [MySQL web site](/doc/index-other.html). For help installing the database from the download file, see Section 6.5.1.5, “Executing SQL Statements from a Text File”.


#### 27.3.7.1 Simple Statements

A simple statement returns a result set which can be used to access data (rows), metadata, and diagnostic information.

A simple statement is static, and cannot be modified after creation; in other words, it cannot be parametrized. A simple statement containing one or more `?` parameter markers raises an error. See Section 27.3.7.2, “Prepared Statements”, for information about prepared statements, which allow arbitrary values for parameters to be specified at execution time.

Most SQL statements which are valid in MySQL can be used as simple statements; for exceptions, see SQL Statements Not Permitted in Stored Routines. A minimal example of a stored procedure using the JavaScript simple statement API is shown here:

```
CREATE PROCEDURE jssp_vsimple(IN query VARCHAR(250))
LANGUAGE JAVASCRIPT AS $$

  let stmt = session.sql(query)
  let result = stmt.execute()

  console.log(result.getColumnNames())

  let row = result.fetchOne()

  while(row) {
    console.log(row.toArray())
    row = result.fetchOne()
  }

$$;
```

This stored procedure takes a single input parameter: the text of an SQL statement. We obtain an instance of `SqlExecute` by passing this text to the global `Session` object's `sql()` method. Calling this instance's `execute()` method yields an `SqlResult`; we can get the names of the columns in this result set using `getColumnNames()`, and iterate through all its rows by calling `fetchOne()` until it fails to return another row (that is, until the method returns `false`). The column names and row contents are written to `stdout` using `console.log()`.

We can test this procedure using a simple join on two tables in the **`world`** database and then checking **`stdout`** afterwards, like this:

```
mysql> CALL jssp_vsimple("
    ">   SELECT c.Name, c.LocalName, c.Population, l.Language
    ">   FROM country c
    ">   JOIN countrylanguage l
    ">   ON c.Code=l.CountryCode
    ">   WHERE l.Language='Swedish'
    "> ");
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state('stdout')\G
*************************** 1. row ***************************
mle_session_state('stdout'): Name,LocalName,Population,Language
Denmark,Danmark,5330000,Swedish
Finland,Suomi,5171300,Swedish
Norway,Norge,4478500,Swedish
Sweden,Sverige,8861400,Swedish

1 row in set (0.00 sec)
```

The result set returned by a single simple statement cannot be greater than 1 MB.


#### 27.3.7.2 Prepared Statements

The prepared statement API allows supported SQL statements (see SQL Syntax Permitted in Prepared Statements) to be re-executed without incurring the cost of parsing and optimization each time.

Prepared statements support parametrization. The question mark or interrogation point (`?`) is used as a parameter marker; parameters are updated (bound to values) beforehand, each time the statement is executed, using `PreparedStatement.bind()`. See the description of this method for more information.

To free up resources taken up by parsed query and statement parameters, call `PreparedStatement.deallocate()`, which closes the prepared statement and frees its resources. Omitting deallocation does not produce an error but memory consumed during stored procedure execution is otherwise not freed until routine execution has finished. Once a prepared statement has been closed (deallocated), it is no longer available for execution.

Execution flow for prepared statements consists of the following steps:

1. Prepare statement (`prepare()`)

2. Update parameters (`bind()`)

3. Execute statement (`execute()`)

4. Close statement (`deallocate()`)

Steps 2 and 3 can be repeated any number of times prior to closing the prepared statement.

The JavaScript stored procedure `jssp_prep1()`, shown here, accepts an arbitrary SQL statement containing two parameter markers, prepares the statement, then executes it twice, binding different values to the parameters each time, and printing the result to `stdout`:

```
CREATE PROCEDURE jssp_prep1(IN query VARCHAR(200))
LANGUAGE JAVASCRIPT AS $$

  function print_result(result) {
    console.log(result.getColumnNames())
    let row = result.fetchOne()

    while(row) {
      console.log(row.toArray())
      row = result.fetchOne()
    }
  }

  function fetch_warnings(result) {
    console.log("Number of warnings: " + result.getWarningsCount())

    for (var w in result.getWarnings()) {
      console.log(w.level + ", " + w.code + ", " + w.message)
     }
  }

  let stmt = session.prepare(query)

  stmt.bind(3, 4)
  let res1 = stmt.execute()
  print_result(res1)
  fetch_warnings(res1)

  stmt.bind(2, 3)
  let res2 = stmt.execute()
  print_result(res2)
  fetch_warnings(res2)

  stmt.bind(5)
  let res3 = stmt.execute()
  print_result(res3)
  fetch_warnings(res3)

  stmt.deallocate()
$$;
```

When finished with the prepared statement, we close it, freeing up any resources used in preparing and executing it, by calling `deallocate()`.

Calling `bind()` with fewer arguments than there are parameters in the statement is allowed after all parameters have been bound at least once. In this case, calling `stmt.bind(5)` after previously having called `stmt.bind(2,3)` is the same as calling `stmt.bind(5,3)`—the missing second value is reused from the previous invocation, as we can see here:

```
mysql> CALL jssp_prep1("
    ">   SELECT *
    ">   FROM t1
    ">   WHERE c1 = ? OR c1 = ?
    "> ");
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state('stdout'): c1,c2,c3
3,37,peach
4,221,watermelon
Number of warnings: 0
c1,c2,c3
2,139,apple
3,37,peach
Number of warnings: 0
c1,c2,c3
3,37,peach
5,83,pear
Number of warnings: 0

1 row in set (0.00 sec)
```


#### 27.3.7.3 Working with Data and Metadata

##### Result Sets

The function `print_result()`, shown here, takes a result set (`SqlResult`) as input:

```
function print_result(result) {
  if (result.hasData()) {
    console.log(result.getColumnNames())
    console.log(result.getColumns())

    let row = result.fetchOne()

    while(row) {
      console.log(row.toArray())
      row = result.fetchOne()
    }
  }
  else {
    console.log("Number of affected rows: " + result.getAffectedItemsCount())
    console.log("Last insert ID: " + result.getAutoIncrementValue())
  }

  while(result.nextResult()) {
    console.log("\nNext result set")
    print_result(result)
  }
}
```

If `query` is the text of a valid SQL statement, the function can be called like this in the body of a JavaScript stored procedure:

```
let stmt = session.sql(query);
let res = stmt.execute();

print_result(res);
```

`print_result()` prints its output to `stdout`. This includes the names of the columns in the result set. If the result set is not empty, the contents of each row are printed in the order obtained; otherwise, the function gets the number of rows affected by the statement and the value of the last inserted ID. Finally it checks for multiple result sets using `nextResult()`, and calls itself for the next result set if there is one.

##### Metadata

This section demonstrates how to obtain column metadata.

```
CREATE PROCEDURE jssp_simple_meta(IN query VARCHAR(250))
LANGUAGE JAVASCRIPT AS $$

  let stmt = session.sql(query)
  let result = stmt.execute()

  console.log(result.getColumnNames())

  let cols = result.getColumns()
  let cnt = result.getColumnCount()

  var out = 'COLUMN INFO:'

  for (var i=0; i<cnt; i++) {
    let col = cols[i]

    out += "\nColumn: " + col.getColumnName() + "(" + col.getColumnLabel() + ")"
    out += "; Schema: " + col.getSchemaName()
    out += "; Table: " + col.getTableName() + "(" + col.getTableLabel() + ")"
    out += "; Type: " + col.getType();
  }

  out += "\n"

  console.log(out);

  if (result.hasData()) {
    console.log("ROWS:")
    let row = result.fetchOne()

    while(row) {
      console.log(row.toArray())
      row = result.fetchOne()
    }
  }

$$;
```

Output:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.01 sec)

mysql> CALL jssp_simple_meta("
    ">   SELECT c.Name, c.LocalName, t.Name AS Capital, c.Population
    ">   FROM country c
    ">   JOIN countrylanguage l
    ">   ON c.Code=l.CountryCode
    ">   JOIN city t
    ">   ON c.Capital=t.ID
    ">   WHERE l.Language='Swedish'
    "> ");
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state('stdout')\G
*************************** 1. row ***************************
mle_session_state('stdout'): Name,LocalName,Capital,Population
COLUMN INFO:
Column: Name(Name); Schema: world; Table: country(c); Type: STRING
Column: LocalName(LocalName); Schema: world; Table: country(c); Type: STRING
Column: Name(Capital); Schema: world; Table: city(t); Type: STRING
Column: Population(Population); Schema: world; Table: country(c); Type: INT

ROWS:
Denmark,Danmark,København,5330000
Finland,Suomi,Helsinki [Helsingfors],5171300
Norway,Norge,Oslo,4478500
Sweden,Sverige,Stockholm,8861400

1 row in set (0.00 sec)
```

##### Error Handling

This section describes basic error handling in MySQL JavaScript stored programs, when using the SQL API.

SQL errors encountered during statement preparation or execution are thrown in JavaScript as exceptions where they can be handled using one or more `try ... catch` blocks, in which case execution proceeds. If the error is not handled in this way, stored procedure execution halts and produces the original SQL error that was encountered during the SQL query execution inside JavaScript.

Executing `SHOW WARNINGS` after a JavaScript stored procedure is executed returns the errors or warnings generated by the most recent statement executed inside the procedure.

Some errors cannot be handled in JavaScript. For example, if a query is aborted (`CTRL-C`), the stored program stops executing immediately and produces an error. Likewise, out of memory errors cannot be handled within JavaScript routines.

An SQL statement that causes errors that are not handled within the stored program passes them back to the client. To observe this, we create a stored procedure using the following SQL statement:

```
CREATE PROCEDURE jssp_simple_error(IN query VARCHAR(250))
LANGUAGE JAVASCRIPT AS $$
 let session = mysql.getSession()
 var result1 = session.sql("SELECT * FROM t_unknown;").execute()
$$;
```

Now we call `jssp_simple_error()`, passing to it a query against a table which we know not to exist, like this:

```
mysql> CALL jssp_simple_error("SELECT * FROM bogus");
ERROR 1146 (42S02): Table 'test.t_unknown' doesn't exist
```

You can choose to handle SQL errors in JavaScript instead, using try-catch syntax, like this:

```
CREATE PROCEDURE jssp_catch_errors(IN query VARCHAR(200))
LANGUAGE JAVASCRIPT AS $$
 try {
  var result = session.sql("SELECT * FROM bogus").execute()
 } catch (e) {
  console.error("\nJS Error:\n" + e.name + ":\n" + e.message)
 }
$$;
```

Here you can see the result when the query passed to `jssp_catch_errors()` is one which attempts to access a nonexistent table:

```
mysql> CALL jssp_catch_errors("SELECT * FROM bogus");
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state('stderr')\G
*************************** 1. row ***************************
mle_session_state('stderr'):
JS Error:
org.graalvm.polyglot.nativeapi.PolyglotNativeAPI$CallbackException:
SQL-CALLOUT: Error code: 1146 Error state: 42S02 Error message: Table 'test.bogus' doesn't exist

1 row in set (0.00 sec)
```


### 27.3.8 Using JavaScript Libraries

This section provides information about and examples of use of JavaScript libraries in JavaScript stored programs as supported by the Multilingual Engine (MLE) in MySQL Enterprise Edition. (See Section 7.5.7, “Multilingual Engine Component (MLE)”")).

First we create a database `jslib`, and make it the current database, like this:

```
mysql> CREATE DATABASE IF NOT EXISTS jslib;
Query OK, 0 rows affected (0.02 sec)

mysql> USE jslib;
Database changed
```

Using the two `CREATE LIBRARY` statements shown here, we create two JavaScript libraries, each exporting one function. To be importable, the function must be declared with the `export` keyword. (This is true of all JavaScript values that you wish to import into another routine; see [*export*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Reference/Statements/export), in the Mozilla Developer documentation for more information).

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib2 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function g(n) {
    $>         return n * 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.00 sec)
```

You can optionally declare one function within a given library as `export default`. In this case, the function must be called by the importing routine as `libname.default()`.

You can obtain general information about JavaScript libraries by querying the Information Schema `LIBRARIES` table; the Information Schema `ROUTINE_LIBRARIES` shows imports into stored routines. The rows corresponding to the libraries `jslib.lib1` and `jslib.lib2` in these two tables are shown by the following queries:

```
mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib1
LIBRARY_DEFINITION:
      export function f(n) {
        return n
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
*************************** 2. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib2
LIBRARY_DEFINITION:
      export function g(n) {
        return n * 2
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 09:20:26
      LAST_ALTERED: 2024-12-16 09:20:26
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
2 rows in set (0.00 sec)

mysql> SELECT * FROM information_schema.ROUTINE_LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib1
LIBRARY_VERSION: NULL
*************************** 2. row ***************************
ROUTINE_CATALOG: def
 ROUTINE_SCHEMA: jslib
   ROUTINE_NAME: foo
   ROUTINE_TYPE: FUNCTION
LIBRARY_CATALOG: def
 LIBRARY_SCHEMA: jslib
   LIBRARY_NAME: lib2
LIBRARY_VERSION: NULL
2 rows in set (0.00 sec)
```

The second query answers the question, “Which stored routines import from `jslib`, and what do they import?”

The `LIBRARIES` and `ROUTINE_LIBRARIES` tables are provided by the MLE component, and are not present if the component is not installed.

If you have the necessary privileges, you can also view a library's JavaScript code using the [`SHOW CREATE LIBRARY`](show-create-library.html "15.7.7.10 SHOW CREATE LIBRARY Statement") statement. See the description of this statement for more information and examples.

You can also use [`SHOW LIBRARY STATUS`](show-library-status.html "15.7.7.25 SHOW LIBRARY STATUS Statement") to obtain basic information about one or more JavaScript libraries, including name, database, creator (definer), and dates of creation and most recent modification. See Section 15.7.7.25, “SHOW LIBRARY STATUS Statement”, for more information and examples.

To create a JavaScript function that uses the two libraries, include the `USING` keyword together with a list of libraries to be imported as part of [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement"), like this:

```
mysql> CREATE FUNCTION foo(n INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    ->         USING (jslib.lib1 AS mylib, jslib.lib2 AS yourlib)
    ->         AS $$
    $>           return mylib.f(n) + yourlib.g(n)
    $>         $$;
Query OK, 0 rows affected (0.00 sec)
```

The alias (`AS` keyword and clause) is generally optional, but if specified, you must use this for the library name when including functions from it in your own stored programs. A library identifier—the name, or its alias if there is one, exclusive of database name—must be unique within a given JavaScript stored function. You can use `AS` with `CREATE FUNCTION` to avoid name collisions between libraries. For example, to include a library named `ourlib` in the current database along with one having the same name but residing in the `other` database, you could use the statement shown here:

```
CREATE FUNCTION myfunc(x INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    USING (ourlib, other.ourlib AS theirlib)
...
;
```

In the case just shown, there are two libraries having the same name; to avoid any conflicts, it is necessary to use an alias for at least one of them.

If one (or more) of the included libraries does not exist, or if the user does not have the required privileges to access it, the `CREATE FUNCTION` statement referencing it is rejected with an error.

References to an imported library within a JavaScript stored routine are expected to match the library name as declared. Note that the name as employed in the `USING` clause need not have the same lettercasing; for example, `USING (MY_LIB)` can be used to import a library named `my_lib`, although references to the library within the stored routine body must use `my_lib`.

You can verify that the function was created by checking the Information Schema `ROUTINES` table, with a query similar to that which is shown here:

```
mysql> SELECT
    ->   SPECIFIC_NAME, ROUTINE_NAME, ROUTINE_SCHEMA,
    ->   DATA_TYPE, ROUTINE_DEFINITION
    -> FROM information_schema.ROUTINES
    -> WHERE ROUTINE_NAME='foo'\G
*************************** 1. row ***************************
     SPECIFIC_NAME: foo
      ROUTINE_NAME: foo
    ROUTINE_SCHEMA: jslib
         DATA_TYPE: int
ROUTINE_DEFINITION:
      return mylib.f(n) + otherlib.g(n)
1 row in set (0.00 sec)
```

We can invoke the function just created just as we would any other stored function.

```
mysql> SELECT foo(2), foo(3), foo(-10), foo(1.5), foo(1.2);
+--------+--------+----------+----------+----------+
| foo(2) | foo(3) | foo(-10) | foo(1.5) | foo(1.2) |
+--------+--------+----------+----------+----------+
|      6 |      9 |      -30 |        6 |        3 |
+--------+--------+----------+----------+----------+
1 row in set (0.00 sec)
```

Because the input parameter is of type `INTEGER`, rounding as if using `Math.round()` takes place before the value is used in any calculations, 1.5 is evaluated as `2 + (2 * 2) = 6`, and 1.2 as `1 + (2 *
1) = 3`.

JavaScript syntax is checked at library creation time, as shown here:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib3 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n $ 2
    $>       }
    $>     $$;
ERROR 6113 (HY000): JavaScript> SyntaxError: lib3:3:17 Expected ; but found $
        return n $ 2
                 ^
```

The `CREATE LIBRARY` statement executes successfully after correcting the typographical error, as shown here:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib3 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function h(n) {
    $>         return n - 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.01 sec)
```

It is also possible to perform dynamic imports, which do not have to be specified with a `USING` clause. You should be aware that a dynamic import returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise); use [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) to obtain the imported library. In general, it is recommended that you use `await` to wait for any `Promise` created in your code.

You can use `await` in the top level of stored functions and stored procedures, as shown here:

```
mysql> CREATE DATABASE db1;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE LIBRARY db1.lib1 LANGUAGE JAVASCRIPT
    -> AS $$
    $>   export function myAdd(x, y) {returns x + y}
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION use_dynamic_import() RETURNS INT LANGUAGE JAVASCRIPT
    -> AS $$
    $>   let m = await import("/db1/lib1")
    $>   return m.myAdd(1, 2)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT use_dynamic_import();
+-----------------------+
| uses_dynamic_import() |
+-----------------------+
|                     3 |
+-----------------------+
1 row in set (0.00 sec)
```

Using `await` causes the `Promise` returned by `import()` to be resolved. Resolution can be pending, fulfilled, or rejected; a “resolved” or “settled” `Promise` is one that is no longer pending, and can be either fulfilled or rejected.

`import()` takes the path of the imported library, which must be a string of the form `"/db_name/lib_name"`; it returns a `Promise` of an ECMAScript module.

The following example demonstrates how you can determine which of multiple libraries to load at runtime. First we create two libraries—each of which exports multiple functions and objects, and has a default export—like this:

```
mysql> CREATE LIBRARY db1.lib_rectangle LANGUAGE JAVASCRIPT
    -> AS $$
    $>  export class Rectangle {
    $>    constructor(height, width) {
    $>      this.height = height
    $>      this.width = width
    $>    }
    $>    print() {
    $>      return "Rectangle of size " + this.height + " by " + this.width
    $>    }
    $>  }
    $>  export function area(x) {return x.height * x.width}
    $>  const r = new Rectangle(2, 3)
    $>  export default r
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE LIBRARY db1.lib_square LANGUAGE JAVASCRIPT
    -> AS $$
    $>  export class Square {
    $>    constructor(a) {
    $>      this.a = a
    $>    }
    $>    print() {return "Square of size " + this.a}
    $>  }
    $>  export function area(x) {return x.a * x.a}
    $>  const s = new Square(2)
    $>  export default s
    $> $$;
Query OK, 0 rows affected (0.01 sec)
```

The `printObject()` function determines the library to import at runtime, based on the value passed to it, as shown here:

```
mysql> CREATE FUNCTION printObject(object_type VARCHAR(16)) RETURNS TEXT LANGUAGE JAVASCRIPT
    -> AS $$
    $>  let module = await import(`/db1/lib_${object_type}`)
    $>  // both libraries have default exports with print methods
    $>  return module.default.print()
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT printObject("square");
+-----------------------+
| printObject("square") |
+-----------------------+
|      Square of size 2 |
+-----------------------+
1 row in set (0.00 sec)

mysql> SELECT printObject("rectangle");
+--------------------------+
| printObject("rectangle") |
+--------------------------+
| Rectangle of size 2 by 3 |
+--------------------------+
1 row in set (0.00 sec)
```

In addition, the namespace object returned after awaiting the `Promise` can be destructed like any other object; the default and other exports can easily be renamed for use within the importing stored program, as shown here:

```
mysql> CREATE FUNCTION computeRectangle() RETURNS INT LANGUAGE JAVASCRIPT
    -> AS $$
    $>  let {default: myRectangle, area: area} = await import(`/db1/lib_rectangle`)
    $>  return area(myRectangle)
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT computeRectangle();
+--------------------+
| computeRectangle() |
+--------------------+
|                  6 |
+--------------------+
1 row in set (0.00 sec)
```

It is possible to import libraries or portions of them into other libraries, as shown in this example where function `foo()` is imported from library `mylib` into library `theirlib` and used in a function `bar()` defined in `theirlib`, which is then imported into stored function `myfunc()` which invokes `bar()`:

```
mysql> CREATE LIBRARY mylib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   export function foo(){return 42}
    $> $$;
Query OK, 0 rows affected (0.04 sec)

mysql> CREATE LIBRARY theirlib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   import {foo} from "/db1/mylib"
    $>   export function bar(){return 2 * foo()}
    $> $$;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE FUNCTION myfunc(x INTEGER) RETURNS INT
    -> LANGUAGE JAVASCRIPT
    -> NO SQL
    -> USING (theirlib)
    -> AS $$
    $>   let result = theirlib.bar()
    $>
    $>   result += x
    $>
    $>   return result
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT myfunc(1), myfunc(10);
+-----------+------------+
| myfunc(1) | myfunc(10) |
+-----------+------------+
|        85 |         94 |
+-----------+------------+
1 row in set (0.00 sec)
```

Library functions can be invoked only within the library or stored routine into which their containing library is imported. For example, the following stored function `myfunc2()` imports `theirlib`, and `theirlib` imports `mylib`. The `CREATE FUNCTION` statement in this case succeeds, but a direct attempt to invoke a function originating in `mylib` is rejected at runtime, as shown here:

```
mysql> CREATE FUNCTION myfunc2(x INTEGER) RETURNS INT
    -> LANGUAGE JAVASCRIPT
    -> NO SQL
    -> USING (theirlib)
    -> AS $$
    $>   return mylib.foo()
    $> $$;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT myfunc2(1), myfunc2(10);
ERROR 6113 (HY000): JavaScript> ReferenceError: mylib is not defined
```

MLE JavaScript library code is executed only when invoked as part of a stored routine which includes the library. Library code is not executed by any of the following statements:

* `CREATE FUNCTION`
* `CREATE PROCEDURE`
* `CREATE LIBRARY`

For example, these are valid `CREATE LIBRARY` and `CREATE FUNCTION` statements, since the code is not actually executed:

```
mysql> CREATE LIBRARY my_lib LANGUAGE JAVASCRIPT
    -> AS $$
    $>   throw "MyError"
    $> $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE FUNCTION my_func(x INTEGER)
    -> RETURNS INTEGER LANGUAGE JAVASCRIPT NO SQL
    -> USING(my_lib)
    -> AS $$
    $>   return x * 10
    $> $$;
Query OK, 0 rows affected (0.02 sec)
```

Invoking the function that imports the library actually invokes the library code, which causes an error, as shown here:

```
mysql> SELECT my_func(8);
ERROR 6113 (HY000): JavaScript> MyError
```


### 27.3.9 Using WebAssembly Libraries

This section discusses compilation of C, C++, or other code to WebAssembly, incorporating the compiled code into a MySQL library, and using such a library in MySQL JavaScript programs.

In the examples that follow, to compile C code to WebAssembly, we employ the Emscripten toolchain, for which you can obtain source or binaries from `https://emscripten.org/docs/getting_started/downloads.html`. We assume in the remainder of this discussion that you have downloaded and installed it according to the Emscripten documentation; we suggest you begin with `https://emscripten.org/docs/getting_started/index.html`.

In this example, we first save the following C code containing three simple functions to a file named `main.c`:

```
int foo() { return 42; }

int bar(int x) { return x + foo(); }

int my_add(int a, int b) { return a + b; }
```

If you have not yet read the necessary environment and other variables into the current terminal session, do so before proceeding, using the command shown here:

```
$> source ./emsdk_env.sh
```

You should now be able to compile this file to WebAssembly using the following Emscripten command:

```
$> emcc --no-entry -s EXPORTED_FUNCTIONS=_foo,_bar,_my_add -o my_module.wasm main.c -O3
```

`EXPORTED_FUNCTIONS` lists all the C functions that should be exported so that the JavaScript module can import them.

The WebAssembly module just created can now be loaded and the exported functions used in a JavaScript stored program as shown here, where the input parameter `wasm_src` is a binary buffer loaded from `my_module.wasm`:

```
CREATE FUNCTION my_func(IN wasm_src LONGBLOB) RETURNS INT LANGUAGE JAVASCRIPT
AS $$
  // Create a new WebAssembly module instance
  const wasmModule = new WebAssembly.Module(wasm_src)
  let wasmInstance = new WebAssembly.Instance(wasmModule)

  // Access exported functions through its exports member
  let expect42 = wasmInstance.exports.foo();
  console.log("expect42: ", expect42);

  let expect49 = wasmInstance.exports.bar(7);
  console.log("expect49: ", expect49);

  let expect3 = wasmInstance.exports.my_add(1, 2);
  console.log("expect3: ", expect3);

  return 0;
$$;
```

To test `my_func()`, first execute the following SQL statement, adjusting the path as necessary to local conditions:

```
mysql> SET @wasm_content=LOAD_FILE('path/to/my_module.wasm');
```

You must have the `FILE` privilege to use the SQL `LOAD_FILE()` function. The `secure_file_priv` server system variable also has an effect on data import and export operations; see this variable's description for more information.

Now you can invoke the function and view its output, like this:

```
mysql> SELECT my_func(@wasm_content);
+-------------------------+--------------+
|  my_func(@wasm_content) | expect42: 42
                            expect49: 49
                            expect3: 3   |
+-------------------------+--------------+
```


### 27.3.10 JavaScript GenAI API

This section provides reference information for the GenAI API supported by JavaScript stored routines in the MLE Component.

This API enables the GenAI feature, with which you can perform natural-language searches using large language models (LLMs). A large language model is reflected in the JavaScript API as the `LLM` class and its attendant methods.

For more information about the GenAI feature, see:

* In the *MySQL HeatWave User Guide*: About MySQL HeatWave GenAI

* In the *MySQL AI User Guide*: About GenAI

GenAI is supported only with MySQL HeatWave and MySQL AI.

While MySQL provides SQL stored functions and procedures to invoke AutoML features, accessing these can be unintuitive for JavaScript developers. The JavaScript API described in this section acts as a wrapper which invokes these SQL stored programs.

The AutoML feature is supported only by MySQL HeatWave and MySQL AI, and thus the JavaScript API described here is supported when either MySQL HeatWave is enabled, or when MySQL AI is installed.

For more information about the AutoML feature, see:

* In the *MySQL HeatWave User Guide*: Train and Use Machine Learning Models

* In the *MySQL AI User Guide*: Training and Using Machine Learning Models


#### 27.3.10.1 AnomalyDetector Class

* AnomalyDetector Constructor
* AnomalyDetector.train()")
* AnomalyDetector.fit()")
* AnomalyDetector.predict()")
* AnomalyDetector.score()")
* AnomalyDetector.unload()")

This class encapsulates the anomaly detection task as described in Detect Anomalies. `AnomalyDetector` supports methods for loading, training, and unloading models, predicting labels, calculating probabilities, and related tasks.

`AnomalyDetector` provides the following accessible properties:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options specified in the constructor when creating an instance of `AnomalyDetector`.

##### AnomalyDetector Constructor

The `AnomalyDetector` class constructor is shown here:

**AnomalyDetector class constructor**

* ``` new ml.AnomalyDetector( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  `AnomalyDetector`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options; the
  same as the training options which can be used with
  [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html).

**Return type**

* An instance of `AnomalyDetector`.

##### AnomalyDetector.train()

Trains and loads a new anomaly detector. This method acts as a
wrapper for both [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html)
and [`sys.ML_MODEL_LOAD`](/doc/heatwave/en/mys-hwaml-ml-model-load.html), but is
specific to MySQL HeatWave AutoML anomaly detection.

**Signature**

* ```
  AnomalyDetector.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` containing a training dataset. The table must not take up more than 10 GB space, or hold more than 100 million rows or more than 1017 columns.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values. The type used for this column cannot be `TEXT`.

**Return type**

* *None*.

##### AnomalyDetector.fit()

An alias for `train()`"), and identical to it in all respects other than name. See AnomalyDetector.train()"), for more information.

##### AnomalyDetector.predict()

This method predicts labels, acting as a wrapper for `sys.ML_PREDICT_ROW`.

Predicts a label for a single sample of data, and returns the label. See ML_PREDICT_ROW, for more information.

**Signature**

* ``` String AnomalyDetector.predict( Object sample[, Object options] )
  ```

**Arguments**

* *`sample`*
  (`Object`): Sample data. This argument
  must contain members that were used for training; extra
  members may be included, but these are ignored during
  prediction.
* *`options`*
  (`Object`)
  (*optional*): Set of one of more
  options.

**Return type**

* `String`.

##### AnomalyDetector.score()

This method serves as a JavaScript wrapper for
[`sys.ML_SCORE`](/doc/heatwave/en/mys-hwaml-ml-score.html), returning the
score for the test data in the specified table and column. For
possible metrics, see [Optimization and Scoring Metrics](/doc/heatwave/en/mys-hwaml-ml-metrics.html).

**Signature**

* ```
  score(
    Table testData,
    String targetColumnName,
    String metric[,
    Object options]
  )
  ```

**Arguments**

* *`testData`* (`Table`): Table containing test data to be scored; must contain the same columns as the training dataset.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values.

* *`metric`* (`String`): Name of the scoring metric to use. See Optimization and Scoring Metrics, for information about metrics which can be used for AutoML anomaly detection.

* *`options`* (`Object`) (*optional*): A set of options in JSON object format. See the description of `ML_SCORE` for more information.

**Return type**

* `Number`.

##### AnomalyDetector.unload()

This method is a wrapper for `sys.ML_MODEL_UNLOAD`, and Unloads the model.

**Signature**

* ``` AnomalyDetector.unload()
  ```

**Arguments**

* *None*.

**Return type**

* *None*.


#### 27.3.10.2 Classifier Class

* Classifier Constructor
* Classifier.train()")
* Classifier.fit()")
* Classifier.predict()")
* Classifier.predictProba()")
* Classifier.score()")
* Classifier.explain()")
* Classifier.getExplainer()")
* Classifier.unload()")

This class encapsulates the classification task as described in Train a Model. `Classifier` supports methods for loading, training, and unloading models, predicting labels, calculating probabilities, producing explainers, and related tasks.

An instance of `Classifier` has three accessible properties, listed here:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata stored in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options specified in the constructor.

##### Classifier Constructor

You can obtain an instance of `Classifier` by invoking its constructor, shown here:

**Signature**

* ``` new ml.Classifier( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  `Classifier`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options; these
  are the same as the training options used with
  [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html).

**Return type**

* An instance of `Classifier`.

It is also possible to obtain a
[`Classifier`](srjsapi-classifier.html "27.3.10.2 Classifier Class") by invoking
[`ml.load()`](srjsapi-convenience-methods.html#srjsapi-ml-load "ml.load()"). See
[ml.load()](srjsapi-convenience-methods.html#srjsapi-ml-load "ml.load()"), for more information.

##### Classifier.train()

Trains and loads a new classifier. This method acts as a
wrapper for both [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html)
and [`sys.ML_MODEL_LOAD`](/doc/heatwave/en/mys-hwaml-ml-model-load.html), but is
specific to the MySQL HeatWave AutoML classification task.

**Signature**

* ```
  Classifier.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` containing a training dataset. The table must not take up more than 10 GB space, or hold more than 100 million rows or more than 1017 columns.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values. The type used for this column cannot be `TEXT`.

**Return type**

* *None*.

##### Classifier.fit()

An alias for `train()`"), and identical to it in all respects save the method name. See Classifier.train()"), for more information.

##### Classifier.predict()

This method predicts labels; it has two variants, one of which predicts labels from data found in the indicated table and stores them in an output table; this is a wrapper for `sys.ML_PREDICT_TABLE`. The other variant of this method acts as a wrapper for `sys.ML_PREDICT_ROW`, and predicts a label for a single set of sample data and returns it to the caller. Both versions of `predict()` are shown here.

###### Version 1

Predicts labels and saves them in the specified output table.

**Signature**

* ``` Classifier.predict( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing test data.
* *`outputTable`*
  (`Table`): Table in which to store
  labels. The content and format of the output is the same
  as that generated by `ML_PREDICT_TABLE`.
* *`options`*
  (`Object`)
  (*optional*): Set of options in JSON
  format. See [ML_PREDICT_TABLE](/doc/heatwave/en/mys-hwaml-ml-predict-table.html),
  for more information.

**Return type**

* *None*. (Inserts into
  *`outputTable`*; see
  [ML_PREDICT_ROW](/doc/heatwave/en/mys-hwaml-ml-predict-row.html).)

###### Version 2

Predicts a label for a single sample of data, and returns it.
See [ML_PREDICT_ROW](/doc/heatwave/en/mys-hwaml-ml-predict-row.html), for more
information.

**Signature**

* ```
  String Classifier.predict(
    Object sample
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample data. This argument must contain members that were used for training; extra members may be included, but these are ignored during prediction.

**Return type**

* `String`. See the documentation for `ML_PREDICT_ROW` for more information.

##### Classifier.predictProba()

Obtains the probabilities for all classes of the passed sample data. Like the single-argument version of `predict()`"), this method is a wrapper for `sys.ML_PREDICT_ROW`, but unlike `predict()`, `predictProba()` returns the probabilities only.

**Signature**

* ``` Classifier.predict( Object sample )
  ```

**Arguments**

* *`sample`*
  (`Object`): Sample data, in the form of a
  JSON object. As with the single-argument version of
  [`Classifier.predict()`](srjsapi-classifier.html#srjsapi-classifier-predict "Classifier.predict()"),
  this argument must contain members that were used for
  training; extra members may be included, but these are
  ignored during prediction.

**Return type**

* `Object`. The probabilities for the
  sample data, in JSON format.

##### Classifier.score()

Returns the score for the test data in the indicated table and
column. For possible metric values and their effects, see
[Optimization and Scoring Metrics](/doc/heatwave/en/mys-hwaml-ml-metrics.html).

This method serves as a JavaScript wrapper for
[`sys.ML_SCORE`](/doc/heatwave/en/mys-hwaml-ml-score.html).

**Signature**

* ```
  score(
    Table testData,
    String targetColumnName,
    String metric[,
    Object options]
  )
  ```

**Arguments**

* *`testData`* (`Table`): Table containing test data to be scored; this table must contain the same columns as the training dataset.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values.

* *`metric`* (`String`): Name of the scoring metric. See Optimization and Scoring Metrics, for information about the metrics compatible with AutoML classification.

* *`options`* (`Object`) (*optional*): A set of options in JSON format. See the description of `ML_SCORE` for more information.

**Return type**

* `Number`.

##### Classifier.explain()

Given a `Table` containing a labeled, trained dataset and the name of a table column containing ground truth values, this method returns the newly trained explainer.

This method serves as a wrapper for the MySQL HeatWave AutoML `sys.ML_EXPLAIN` routine; see the description of that routine for further information.

**Signature**

* ``` explain( Table data, String targetColumnName[, Object options] )
  ```

**Arguments**

* *`data`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): A table
  containing trained data.
* *`targetColumnName`*
  (`String`): The name of the column
  containing ground truth values.
* *`options`*
  (`Object`)
  (*optional*): A set of optional
  parameters, in JSON format.

**Return type**

* *None*. Adds a model explainer to the
  model catalog; see [ML_EXPLAIN](/doc/heatwave/en/mys-hwaml-ml-explain.html),
  for more information.

##### Classifier.getExplainer()

Returns an explainer for this classifier, if one exists.

**Signature**

* ```
  Object Classifier.getExplainer()
  ```

**Arguments**

* *None*.

**Return type**

* `Object`

##### Classifier.unload()

Unloads the model. This method is a wrapper for `sys.ML_MODEL_UNLOAD`.

**Signature**

* ``` Classifier.unload()
  ```

**Arguments**

* *None*.

**Return type**

* `undefined`


#### 27.3.10.3 Explainer Class

This class is an abstraction of the AutoML explainer model as described in Generate Model Explanations. It has no explicit constructor, but rather is obtained by invoking `Classifier.getExplainer()`") or `Regressor.getExplainer()`").

`Explainer` exposes a single method, `explain()`, in two variants, both of which are described in this section.

##### Explainer.explain()

###### Version 1

This form of `explain()` is a JavaScript wrapper for `ML_EXPLAIN_TABLE`, and explains the training data from a given table using any supplied options, and placing the results in an output table.

**Signature**

* ``` Explainer.explain( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing data to be explained.
* *`outputTable`*
  (`Table`): Table used for storing
  results.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when explaining. For more information, see
  [Generate Prediction Explanations for a Table](/doc/heatwave/en/mys-hwaml-explanations-ml-explain-table.html).

**Return type**

* *None*. (Inserts into a table.)

###### Version 2

Explains a sample containing training data, which must contain
members used in training; extra members are ignored. This form
of `explain()` is a wrapper for
[`ML_EXPLAIN_ROW`](/doc/heatwave/en/mys-hwaml-ml-explain-row.html).

**Signature**

* ```
  explain(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): A sample containing training data.

* *`options`* (`Object`) (*optional*): Options to be used; see Generate Prediction Explanations for a Row of Data, for more information.

**Return type**

* *None*.


#### 27.3.10.4 Forecaster Class

* Forecaster Constructor
* Forecaster.train()")
* Forecaster.fit()")
* Forecaster.predict()")
* Forecaster.score()")
* Forecaster.unload()")

This class encapsulates the forecasting task as described in Generate Forecasts. `Forecaster` supports methods for loading, training, and unloading models, predicting labels, and related tasks.

Each instance of `Forecaster` has three accessible properties, listed here:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata stored in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options that were specified in the constructor when creating this instance.

##### Forecaster Constructor

You can obtain an instance of `Forecaster` by invoking its constructor, shown here:

**Signature**

* ``` new ml.Forecaster( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  `Forecaster`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options; these
  are the same as the training options used with
  [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html).

**Return type**

* An instance of `Forecaster`.

##### Forecaster.train()

Trains and loads a new forecast. This method acts as a wrapper
for both [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html) and
[`sys.ML_MODEL_LOAD`](/doc/heatwave/en/mys-hwaml-ml-model-load.html), but is
specific to MySQL HeatWave AutoML forecasting.

**Signature**

* ```
  Forecaster.train(
    Table trainData,
    String index,
    Array[String] endogenousVariables[,
    Array[String] exogenousVariables]
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` containing a training dataset. The table must not take up more than 10 GB space, or hold more than 100 million rows or more than 1017 columns.

* *`index`* (`String`): Name of the target column containing ground truth values. This must not be a `TEXT` column.

* *`endogenousVariables`* (`Array[String]`): The name or names of the column or columns to be forecast.

* *`exogenousVariables`* (`Array[String]`): The name or names of the column or columns of independent, predictive variables, and have not been forecast.

**Return type**

* Does not return a value. After invoking this method, you can observe its effects by selecting from the `MODEL_CATALOG` and `model_object_catalog` tables, as described in [the examples provided in the MySQL HeatWave documentation](/doc/heatwave/en/mys-hwaml-ml-train.html#mys-hwaml-ml-train-examples).

##### Forecaster.fit()

An alias for `train()`"), and identical to it in all respects save the method name. See Forecaster.train()"), for more information.

##### Forecaster.predict()

This method predicts labels, and has two variants, one of which predicts labels from data found in the indicated table and stores them in an output table; this variant of `predict()` acts as a JavaScript wrapper for `sys.ML_PREDICT_TABLE`. The other variant of this method is a wrapper for `sys.ML_PREDICT_ROW`, and predicts a label for a single set of sample data and returns it to the caller. Both versions are shown here.

###### Version 1

Predicts labels, saving them in the output table specified by the user.

**Signature**

* ``` Forecaster.predict( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing test data.
* *`outputTable`*
  (`Table`): Table in which to store
  labels. The output written to the table uses the same
  content and format as that generated by the AutoML
  `ML_PREDICT_TABLE` routine.
* *`options`*
  (`Object`)
  (*optional*): Set of options in JSON
  format. For more information, see
  [ML_PREDICT_TABLE](/doc/heatwave/en/mys-hwaml-ml-predict-table.html).

**Return type**

* *None*. (Inserts into a target table.)

###### Version 2

Predicts a label for a single sample of data, and returns it.
See [ML_PREDICT_ROW](/doc/heatwave/en/mys-hwaml-ml-predict-row.html), for more
information about type and format of the value returned.

**Signature**

* ```
  String Forecaster.predict(
    Object sample
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample data containing members that were used for training; extra members may be included but are ignored during prediction.

**Return type**

* `String`. See the documentation for `ML_PREDICT_ROW` for details.

##### Forecaster.score()

Returns the score for the test data in the indicated table and column, using the specified metric. For possible metric values and their effects, see Optimization and Scoring Metrics.

`score()` is a JavaScript wrapper for `sys.ML_SCORE`.

**Signature**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table which
  contains the test data. The table must contain the same
  columns as the training dataset.
* *`targetColumnName`*
  (`String`): Name of the target column
  containing ground truth values.
* *`metric`*
  (`String`): Name of the scoring metric.
  See [Optimization and Scoring Metrics](/doc/heatwave/en/mys-hwaml-ml-metrics.html), for
  information about metrics which can be used for MySQL HeatWave AutoML
  forecasting.
* *`options`*
  (`Object`)
  (*optional*): A set of options in JSON
  key-value format. For more information, see
  [ML_SCORE](/doc/heatwave/en/mys-hwaml-ml-score.html).

**Return type**

* `Number`.

##### Forecaster.unload()

Unloads the model. This method is a wrapper for
[`sys.ML_MODEL_UNLOAD`](/doc/heatwave/en/mys-hwaml-ml-model-unload.html); see the
description of this routine in the MySQL HeatWave AutoML documentation
for more information.

**Signature**

* ```
  Forecaster.unload()
  ```

**Arguments**

* *None*.

**Return type**

* *None*.


#### 27.3.10.5 LLM Class

* LLM Constructor
* LLM.unload()")
* LLM.generate()")
* LLM.embed()")
* LLM.rag()")

This class represents a large language model. Members accessible from instances of this class are listed here:

* `name` (`String`): The name of the model

* `options` (`Object`): The model's configuration options

* `isLoaded` (`Boolean`): `true` if the model is loaded, `false` if it is not

##### LLM Constructor

The LLM class has the constructor shown here:

**LLM class constructor**

* ``` LLM( String name, Object options )
  ```

**Arguments**

* *`name`*
  (`String`): the name of the model
* *`options`*
  (`Object`) (default
  `{}`): an object containing the options
  used by this instance

**Return type**

* An instance of [`LLM`](srjsapi-llm.html "27.3.10.5 LLM Class")

**Usage**

* ```
  let model = LLM("llama3.2-3b-instruct-v1", {max_tokens: 10})
  ```

`LLM` provides methods for creating embeddings, generating responses, and performing Retrieval Augmented Generation. The API also provides convenience methods; see Section 27.3.10.8, “Convenience Methods”. Both versions of these methods support variants of the methods for performing single jobs and batch processing.

##### LLM.unload()

Unloads the model that was loaded in the constructor. This is optional, but recommended, since doing so can reduce memory usage; after unloading, any subsequent attempt to use the instance raises an error.

**Signature**

* ``` undefined LLM.unload()
  ```

**Arguments**

* *None*

**Return type**

* `undefined`

**Usage**

* ```
  model.unload()
  ```

##### LLM.generate()

This method acts as a wrapper for `ML_GENERATE`, and generates a response using the prompt and options provided for the loaded model. It supports two variants, one for a single invocation, and one for batch processing; both of these are described in the next few paragraphs.

**Signature (single job)**

* ``` Object LLM.generate( String prompt, Object options )
  ```

**Arguments**

* *`prompt`*
  (`String`): prompt to be used for text
  generation
* *`options`*
  (`Object`) (default
  `{}`): an object containing the options
  used by this instance; see the description of
  [`ML_GENERATE`](/doc/heatwave/en/mys-hwgenai-ml-generate.html) for available
  options

**Return type**

* `Object`: The structure is similar to
  that of [`ML_GENERATE`](/doc/heatwave/en/mys-hwgenai-ml-generate.html).

**Usage**

* ```
  let response = model.generate("What is MySql?", {"top_k": 2})
  ```

**Signature (batch processing)**

* ``` undefined LLM.generate( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  [`ML_EMBED_ROW`](/doc/heatwave/en/mys-hwgenai-ml-embed-row.html) for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  model.generate(table, "input", "mlcorpus.predictions.response")
  ```

##### LLM.embed()

This method is a wrapper for `ML_EMBED_ROW`, and generates an embedding whose type corresponds to the MySQL `VECTOR` type. It supports two variants, one for a single invocation, and one for batch processing; both of these are described in the next few paragraphs.

**Signature (single job)**

* ``` Float32Array LLM.embed( String query, Object options )
  ```

**Arguments**

* *`query`*
  (`String`): The text to be embedded
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  [`ML_EMBED_ROW`](/doc/heatwave/en/mys-hwgenai-ml-embed-row.html) for available
  options

**Return type**

* `Float32Array` (MySQL
  [`VECTOR`](vector.html "13.3.5 The VECTOR Type")): The embedding

**Usage**

* ```
  let embedding = model.embed("What is MySql?")
  ```

**Signature (batch processing)**

* ``` undefined LLM.embed( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  [`ML_EMBED_ROW`](/doc/heatwave/en/mys-hwgenai-ml-embed-row.html) for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  // Using fully-qualified output column name

  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")
  model.embed(table, "input", "mlcorpus.predictions.response")

  // Using output column name only; constructs the fully-qualfied name
  // "mlcorpus.genai_table.response"

  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")
  model.embed(table, "input", "response")
  ```

##### LLM.rag()

This method performs Retrieval Augmented Generation for a given query using the loaded genAI model, acting as a wrapper for `ML_RAG`. It supports two variants, one for a single invocation, and one for batch processing; both of these are described in the next few paragraphs.

**Signature (single job)**

* ``` Object LLM.rag( String query, Object options )
  ```

**Arguments**

* *`query`*
  (`String`): The text to be used for
  content retrieval and generation
* *`options`* (Object) (default
  `{}`): The options employed for
  generation; these follow the same rules as the options
  used with [`LLM.generate()`](srjsapi-llm.html#srjsapi-llm-generate "LLM.generate()")

**Return type**

* `Object`: The structure is similar to
  that of the object returned by
  [`ML_RAG`](/doc/heatwave/en/mys-hwgenai-ml-rag.html).

**Usage**

* ```
  let result = model.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1})
  ```

**Signature (batch processing)**

* ``` undefined LLM.rag( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  [`ML_EMBED_ROW`](/doc/heatwave/en/mys-hwgenai-ml-embed-row.html) for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  model.rag(table, "input", "mlcorpus.predictions.response",
    {schema: ["vector_store"], n_citations: 1})
  ```


#### 27.3.10.6 Recommender Class

* Recommender Constructor
* Recommender.train()")
* Recommender.fit()")
* Recommender.predictRatings()")
* Recommender.predictItems()")
* Recommender.predictUsers()")
* Recommender.predictSimilarItems()")
* Recommender.predictSimilarUsers()")
* Recommender.score()")
* Recommender.unload()")

This class encapsulates the recommendation task as described in Generate Recommendations. `Recommender` supports methods for loading, training, and unloading models, predicting labels, calculating probabilities, producing explainers, and related tasks.

An instance of `Recommender` has three accessible properties, listed here:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata stored in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options specified in the constructor.

##### Recommender Constructor

You can obtain an instance of `Recommender` by invoking its constructor, shown here:

**Signature**

* ``` new ml.Recommender( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  `Recommender`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options; same as
  training options permitted for
  [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html).

**Return type**

* An instance of `Recommender`.

##### Recommender.train()

Trains and loads a new recommender. This method acts as a
wrapper for both [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html)
and [`sys.ML_MODEL_LOAD`](/doc/heatwave/en/mys-hwaml-ml-model-load.html), but is
specific to the AutoML recommendation task.

**Signature**

* ```
  Recommender.train(
    Table trainData,
    String users,
    String items,
    String ratings
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` containing a training dataset. The maximum size of the table must not exceed 10 GB space, 100 million rows, or 1017 columns.

* *`users`* (`String`): List of one or more users.

* *`items`* (*`String`*): List of one or more items being rated.

* *`ratings`* (*`String`*): List of ratings.

**Return type**

* *None*.

##### Recommender.fit()

This is an alias for `train()`"), to which it is identical in all respects other than the method name. See Recommender.train()"), for more information.

##### Recommender.predictRatings()

This method predicts ratings for one or more samples, and provides two variants. The first of these predicts ratings over a table and stores them in an output table, while the second predicts the rating of a single sample of data and returns the rating to the caller. Both versions are covered in this section.

See also Generate Predictions for a Recommendation Model.

###### Version 1

Predicts ratings over an entire table and stores them in the specified output table. A wrapper for the MySQL HeatWave AutoML `ML_PREDICT_TABLE` routine.

**Signature**

* ``` Recommender.predictRatings( Table testData, Table outputTable[, Object options])
  ```

**Arguments**

* *`testData`*
  (`Table`): Table containing sample data.
* *`outputTable`*
  (`Table`): Table in which to store
  predicted ratings.
* *`options`*
  (`Object`)
  (*optional*): Options used for
  prediction.

**Return type**

* *None*.

###### Version 2

Returns the rating predicted for a single sample of data. This
is a wrapper for
[`ML_PREDICT_ROW`](/doc/heatwave/en/mys-hwaml-ml-predict-row.html).

**Signature**

* ```
  Object Recommender.predictRatings(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Data sample. Refer to Generate Predictions for a Recommendation Model, for format and other information.

* *`options`* (`Object`) (*optional*): One or more options, as described under Options for Generating Predictions, in the MySQL HeatWave AutoML documentation.

**Return type**

* `Object`. See Generate Predictions for Ratings and Rankings, for details.

##### Recommender.predictItems()

This method predicts items for users, as described in Generate Predictions for a Recommendation Model. Like other Recommender prediction methods, predictItems() exists in two versions. The first predicts items over an entire table of users and stores the predictions in an output table, while the second predicts items for a single sample of data. Both versions are described in this section.

###### Version 1

Predicts items over a table of users and stores the predictions in an output table; JavaScript wrapper for `ML_PREDICT_TABLE`.

**Signature**

* ``` Recommender.predictItems( Table testData, Table outputTable[, Object options])
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing data.
* *`outputTable`*
  (`Table`): Table for storing predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions; see
  [Options for Generating Predictions](/doc/heatwave/en/mys-hwaml-using-a-recommendation-model.html#mys-hwaml-using-a-recommendation-model-options),
  for more information about possible options.

**Return type**

* *None*.

###### Version 2

Predicts items for a single sample of user data. This form of
the method is a wrapper for
[`ML_PREDICT_ROW`](/doc/heatwave/en/mys-hwaml-ml-predict-row.html).

**Signature**

* ```
  Object Recommender.predictItems(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; a set of predictions.

##### Recommender.predictUsers()

Depending on which version of the method is called, `predictUsers()` either predicts users over an entire table of items and stores them in an output table, or predicts users for a single set of sample item data and returns the result as an object. (See Generate Predictions for a Recommendation Model.) Both versions are described in the following paragraphs.

###### Version 1

Predicts users over a table of items and stores them in an output table. A wrapper for `ML_PREDICT_TABLE` specific to AutoML user prediction.

**Signature**

* ``` Recommender.predictUsers( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing item data.
* *`outputTable`*
  (`Table`): Table for storing user
  predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions; see
  [Options for Generating Predictions](/doc/heatwave/en/mys-hwaml-using-a-recommendation-model.html#mys-hwaml-using-a-recommendation-model-options),
  for information about possible options.

**Return type**

* *None*.

###### Version 2

Predicts users for a single sample of item data and returns
the result; a JavaScript wrapper for the MySQL HeatWave AutoML
[`ML_PREDICT_ROW`](/doc/heatwave/en/mys-hwaml-ml-predict-row.html) routine,
intended for user prediction.

**Signature**

* ```
  Object Recommender.predictUsers(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample item data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; this is a set of user predictions in JavaScript object format.

##### Recommender.predictSimilarItems()

From items given, predict similar items. Two variants of this method are supported, as described in the rest of this section: the first predicts similar items for an entire table containing items, and stores the predictions in an output table; the other returns a set of predicted similar items for a single set of items.

predictSimilarItems(Table testData, Table outputTable[, Object options]) predicts similar items over the whole table of items and stores them in outputTable. Refer to docs for more information.

predictSimilarItems(Object sample[, Object options]) -> Object predicts similar items from the single item. Refer to docs for more information.

###### Version 1

Predicts similar items over a table of items and stores the predicted items in an output table. A wrapper for `ML_PREDICT_TABLE` specific to AutoML the recommendation task for user prediction.

**Signature**

* ``` Recommender.predictSimilarItems( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table which
  contains item data.
* *`outputTable`*
  (`Table`): Table used for storing user
  predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions. For information about the options
  available, see
  [Options for Generating Predictions](/doc/heatwave/en/mys-hwaml-using-a-recommendation-model.html#mys-hwaml-using-a-recommendation-model-options).

**Return type**

* *None*.

###### Version 2

This version of `predictSimilarUsers()`
predicts similar items for a single sample of item data and
returns the result; a JavaScript wrapper for the MySQL HeatWave AutoML
[`ML_PREDICT_ROW`](/doc/heatwave/en/mys-hwaml-ml-predict-row.html) routine,
intended for recommendation for similar item prediction.

**Signature**

* ```
  Object Recommender.predictSimilarItems(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample item data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; a set of predicted similar items.

##### Recommender.predictSimilarUsers()

Predicts similar users from a given set of users (see Generate Predictions for a Recommendation Model). Two versions of this method are supported; both are described in this section.

###### Version 1

Options for Generating Predictions

**Signature**

* ``` predictSimilarUsers( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table which
  contains item data.
* *`outputTable`*
  (`Table`): Table used for storing user
  predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions. For information about the options
  available, see
  [Options for Generating Predictions](/doc/heatwave/en/mys-hwaml-using-a-recommendation-model.html#mys-hwaml-using-a-recommendation-model-options).

**Return type**

* *None*.

###### Version 2

Predicts similar users from a sample and returns the
predictions to the caller.

**Signature**

* ```
  Object predictSimilarUsers(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample item data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; this is a set of predicted similar users.

##### Recommender.score()

Returns the score for the test data in the indicated table and column. For possible metrics and their effects, see Optimization and Scoring Metrics.

This method serves as a JavaScript wrapper for the MySQL HeatWave AutoML `sys.ML_SCORE` routine.

**Signature**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing test data to be scored; this table must contain
  the same columns as the training dataset.
* *`targetColumnName`*
  (`String`): Name of the target column
  containing ground truth values.
* *`metric`*
  (`String`): Name of the scoring metric.
  See [Optimization and Scoring Metrics](/doc/heatwave/en/mys-hwaml-ml-metrics.html), for
  information about the metrics compatible with AutoML
  recommendation.
* *`options`*
  (`Object`)
  (*optional*): A set of options in JSON
  format. See the description of
  [`ML_SCORE`](/doc/heatwave/en/mys-hwaml-ml-score.html) for more
  information.

**Return type**

* `Number`.

##### Recommender.unload()

Unloads the model. This method is a JavaScript wrapper for
[`sys.ML_MODEL_UNLOAD`](/doc/heatwave/en/mys-hwaml-ml-model-unload.html); see the
description of this function in the MySQL HeatWave AutoML documentation
for related information.

**Signature**

* ```
  Recommender.unload()
  ```

**Arguments**

* *None*.

**Return type**

* *None*.


#### 27.3.10.7 Regressor Class

* Regressor Constructor
* Regressor.train()")
* Regressor.fit()")
* Regressor.predict()")
* Regressor.score()")
* Regressor.explain()")
* Regressor.getExplainer()")
* Regressor.unload()")

This class is similar to `Classifier` and `Forecaster` in that it represents an AutoML training model, but encapsulates the regression task as described in the MySQL HeatWave documentation (see Train a Model).

`Regressor` supports methods for loading, training, and unloading models, predicting labels, calculating probabilities, producing explainers, and related tasks; it also has three accessible instance properties, listed here:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata stored in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options specified in the constructor (shown following).

##### Regressor Constructor

To obtain an instance of `Regressor`, simply invoke its constructor, shown here:

**Signature**

* ``` new ml.Regressor( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  instance of `Regressor`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options. These
  are the same as those used with
  [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html).

**Return type**

* An instance of `Regressor`.

##### Regressor.train()

Trains and loads a new regressor, acting as a wrapper for
[`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html) and
[`sys.ML_MODEL_LOAD`](/doc/heatwave/en/mys-hwaml-ml-model-load.html), specific to
the AutoML regression task.

**Signature**

* ```
  Regressor.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` which contains a training dataset. The table must not exceed 10 GB in size, or contain more than 100 million rows or more than 1017 columns.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values; `TEXT` columns are not supported for this purpose.

**Return type**

* `undefined`.

##### Regressor.fit()

This is merely an alias for `train()`"). In all respects except for their names, the two methods are identical. See Regressor.train()"), for more information.

##### Regressor.predict()

This method predicts labels. `predict()` has two variants, listed here:

* Stores labels predicted from data found in the indicated table and stores them in an output table; a wrapper for `sys.ML_PREDICT_TABLE`.

* A wrapper for `sys.ML_PREDICT_ROW`; predicts a label for a single set of sample data and returns it to the caller.

Both versions of `predict()` are shown in this section.

###### Version 1

This version of `predict()` predicts labels, then saves them in an output table specified when invoking the method.

**Signature**

* ``` Regressor.predict( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): A table
  containing test data.
* *`outputTable`*
  (`Table`): A table for storing the
  predicted labels. The output's content and format are
  the same as for that produced by
  `ML_PREDICT_TABLE`.
* *`options`*
  (`Object`)
  (*optional*): Set of options in JSON
  format. See [ML_PREDICT_TABLE](/doc/heatwave/en/mys-hwaml-ml-predict-table.html),
  for more information.

**Return type**

* `undefined`.

###### Version 2

Predicts a label for a single sample of data, and returns it
to the caller. See [ML_PREDICT_ROW](/doc/heatwave/en/mys-hwaml-ml-predict-row.html),
for more information.

**Signature**

* ```
  String Regressor.predict(
    Object sample
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample data. This argument *must* contain members that were used for training; while extra members may be included, these are ignored for purposes of prediction.

**Return type**

* `String`. See ML_PREDICT_ROW.

##### Regressor.score()

Returns the score for the test data in the table and column indicated by the user, using a specified metric; a JavaScript wrapper for `sys.ML_SCORE`.

**Signature**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing test data to be scored; this table must contain
  the same columns as the training dataset.
* *`targetColumnName`*
  (`String`): The name of the target column
  containing ground truth values.
* *`metric`*
  (`String`): Name of the scoring metric to
  be employed. [Optimization and Scoring Metrics](/doc/heatwave/en/mys-hwaml-ml-metrics.html),
  provides information about metrics compatible with the
  AutoML regression task.
* *`options`*
  (`Object`)
  (*optional*): A set of options, as keys
  and values, in JSON format. See the description of
  [`ML_SCORE`](/doc/heatwave/en/mys-hwaml-ml-score.html) for more
  information.

**Return type**

* `Number`.

##### Regressor.explain()

This method takes a [`Table`](srjsapi-table.html "27.3.6.5 Table Object")
containing a labeled, trained dataset and the name of a table
column containing ground truth values, and returns the newly
trained explainer; a wrapper for the MySQL HeatWave
[`sys.ML_EXPLAIN`](/doc/heatwave/en/mys-hwaml-ml-explain.html) routine.

**Signature**

* ```
  explain(
    Table data,
    String targetColumnName[,
    Object options]
  )
  ```

**Arguments**

* *`data`* (`Table`): Table containing trained data.

* *`targetColumnName`* (`String`): Name of column containing ground truth values.

* *`options`* (`Object`) (*optional*): Set of optional parameters, in JSON format.

**Return type**

* Adds a model explainer to the model catalog; does not return a value. See ML_EXPLAIN, for more information.

##### Regressor.getExplainer()

Returns an explainer for this `Regressor`.

**Signature**

* ``` Object Regressor.getExplainer()
  ```

**Arguments**

* *None*.

**Return type**

* `Object`

##### Regressor.unload()

Unloads the model. This method is a wrapper for
[`sys.ML_MODEL_UNLOAD`](/doc/heatwave/en/mys-hwaml-ml-model-unload.html).

**Signature**

* ```
  Regressor.unload()
  ```

**Arguments**

* *None*.

**Return type**

* `undefined`


#### 27.3.10.8 Convenience Methods

The GenAI API provides the convenience methods described in this section under the `ml` namespace. These methods act as wrappers for the `LLM` methods; rather than being invoked as `LLM` instance methods, they take the model ID as one of the options passed to them. `ml.generate()`") and `ml.rag()`") return only the text portions of the values returned by their LLM counterparts.

* ml.generate()")
* ml.embed()")
* ml.load()")
* ml.rag()")

##### ml.generate()

This method is a wrapper for `LLM.generate()`"). It loads the model specified by the *`model_id`* specified as one of the *`options`*, generates a response based on the prompt using this model, and returns the response. The default `model_id` (`"llama3.2-3b-instruct-v1"`) is used if one is not specified. Like the `LLM` method, `ml.generate()` supports two variants, one for a single invocation, and one for batch processing.

**Signature (single job)**

* ``` String ml.generate( String prompt, Object options )
  ```

**Arguments**

* *`prompt`*
  (`String`): The desired prompt
* *`options`*
  (`Object`) (default
  `{}`): The options employed for
  generation; these follow the same rules as the options
  used with [`LLM.generate()`](srjsapi-llm.html#srjsapi-llm-generate "LLM.generate()")

**Return type**

* `String`: The text of the response

**Usage**

* ```
  //  Both invocations use "llama3.2-3b-instruct-v1" as the model_id

  let response = ml.generate("What is Mysql?", {max_tokens: 10})

  let response = ml.generate("What is Mysql?", {model_id: "llama3.2-3b-instruct-v1", max_tokens: 10})
  ```

**Signature (batch processing)**

* ``` undefined ml.generate( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  [`ML_EMBED_ROW`](/doc/heatwave/en/mys-hwgenai-ml-embed-row.html) for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  ml.generate(table, "input", "mlcorpus.predictions.response", {max_tokens: 10})
  ```

##### ml.embed()

This method is a wrapper for `LLM.embed()`"). Like the `LLM` method, it supports two variants, one for a single invocation, and one for batch processing.

**Signature (single job)**

* ``` Float32Array ml.embed( String query, Object options )
  ```

**Arguments**

* *`query`*
  (`String`): Text of a natural-language
  query
* *`options`*
  (`Object`) (default
  `{}`): The options employed for
  generation; these follow the same rules as the options
  used with [`LLM.embed()`](srjsapi-llm.html#srjsapi-llm-embed "LLM.embed()");
  the default `model_id` is
  `"all_minilm_l12_v2"`

**Return type**

* `Float32Array` (MySQL
  [`VECTOR`](vector.html "13.3.5 The VECTOR Type")): The embedding

**Usage**

* ```
  //  These produce the same result

  let embedding = ml.embed("What is Mysql?", {model_id: "all_minilm_l12_v2"})

  let embedding = ml.embed("What is Mysql?", {})
  ```

**Signature (batch processing)**

* ``` undefined ml.embed( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  [`ML_EMBED_ROW`](/doc/heatwave/en/mys-hwgenai-ml-embed-row.html) for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  ml.embed(table, "input", "mlcorpus.predictions.response",
          {model_id: "all_minilm_l12_v2"})
  ```

##### ml.load()

This static method loads an existing (and already trained) MySQL HeatWave AutoML model having the name specified. An error is thrown if model with the given name does not exist.

**Signature**

* ``` Object ml.load( String name )
  ```

**Arguments**

* *`name`*
  (`String`): The name of the model.

**Return type**

* `Object`: Any of
  [`Classifier`](srjsapi-classifier.html "27.3.10.2 Classifier Class"),
  [`Regressor`](srjsapi-regressor.html "27.3.10.7 Regressor Class"),
  [`Forecaster`](srjsapi-forecaster.html "27.3.10.4 Forecaster Class"),
  [`AnomalyDetector`](srjsapi-anomalydetector.html "27.3.10.1 AnomalyDetector Class"), or
  [`Recommender`](srjsapi-recommender.html "27.3.10.6 Recommender Class"), depending
  on the type of model loaded.

For more information, see
[ML_MODEL_LOAD](/doc/heatwave/en/mys-hwaml-ml-model-load.html).

##### ml.rag()

This is a wrapper for
[`LLM.rag()`](srjsapi-llm.html#srjsapi-llm-rag "LLM.rag()"). Like the
`LLM` method, it supports two variants, one
for a single invocation, and one for batch processing.

**Signature (single job)**

* ```
  String ml.rag(
    String query,
    Object options
  )
  ```

**Arguments**

* *`query`* (`String`): Text of a natural-language query

* *`options`* (`Object`) (default `{}`): The options employed for generation; these follow the same rules as the options used with `LLM.rag()`"); the default `model_id` is `"llama3.2-3b-instruct-v1"`

**Return type**

* `String`: Response text

**Usage**

* ``` //  These produce the same result

  let result = ml.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1, model_options: {model_id: "llama3.2-3b-instruct-v1"}})

  let result = ml.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1})
  ```

**Signature (batch processing)**

* ```
  undefined ml.rag(
    Table inputTable,
    String inputColumn,
    String outputColumn,
    Object options
  )
  ```

**Arguments**

* *`inputTable`* (`Table`): Table to use for operations

* *`inputColumn`* (`String`): Name of column from *`inputTable`* to be embedded

* *`outputColumn`* (`String`): Name of column in which to store embeddings; this can be either a fully-qualified name of a column or the name of the column only; in the latter case, the input table and its schema are used to construct the fully-qualified name

* *`options`* (`Object`) (optional; default `{}`): An object containing the options used for embedding; see the description of `ML_EMBED_ROW` for available options

**Return type**

* `undefined`

**Usage**

* ``` let schema = session.getSchema("mlcorpus") let table = schema.getTable("genai_table")

  ml.rag(table, "input", "mlcorpus.predictions.response", {schema: ["vector_store"], n_citations: 1, model_options: {model_id: "llama3.2-3b-instruct-v1"}});
  ```


### 27.3.11 JavaScript Stored Program Limitations and Restrictions

MySQL JavaScript stored programs are subject to the limitations and restrictions described in this section.

The `Global` object and the `globalThis` object property are supported, but their scope is limited to that of the current routine. For example, if a given JavaScript program sets `globalThis.myProp = 10`, this is not available to other JavaScript programs, even within the same session, and accessing `globalThis.myProp` in subsequent invocations of the same JavaScript program does not yield the same value.

A JavaScript variable, local or global, defined in one stored program is not accessible from any other connection executing the same program.

Neither file access nor network access from JavaScript stored program code is supported. JavaScript stored programs in MySQL do not provide for the use of third-party modules; for this reason, the `import` statement is not supported. In addition, there is no support for Node.js.

The MLE component uses a single-threaded execution model (one thread per query). This means that all asynchronous features like the JavaScript `Promise` object and `async` functions are simulated and can exhibit non-deterministic behavior. Promises which are not awaited are not processed until the end of stored program execution, which means that they are not able to impact the values of return arguments in stored functions or those of output arguments in stored procedures.

As with SQL stored routines, JavaScript stored routines with a variable number of arguments are not supported; each argument and its type must be specified at creation time. JavaScript functions within routines can have a variable number of arguments.

It is possible to call other stored programs from within the body of JavaScript stored program, and to invoke a JavaScript stored program from within SQL stored programs, including stored procedures, stored functions, events, and triggers, as shown elsewhere (see Section 27.3.12, “JavaScript Stored Program Examples”). JavaScript stored programs can also call themselves recursively; it is possible to call a pure JavaScript function or method recursively within a JavaScript stored program, as shown here:

```
mysql> CREATE FUNCTION recursive_sum(my_num INT)
    ->   RETURNS INT NO SQL LANGUAGE JAVASCRIPT AS
    -> $$
    $>   function sum(n) {
    $>     if(n <= 1) return n
    $>     else return n + sum(--n)
    $>   }
    $>
    $>   let x = sum(my_num)
    $>   return x
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT recursive_sum(1), recursive_sum(2),
    ->        recursive_sum(20), recursive_sum(100)\G
*************************** 1. row ***************************
  recursive_sum(1): 1
  recursive_sum(2): 3
 recursive_sum(20): 210
recursive_sum(100): 5050
1 row in set (0.00 sec)
```

The recursion depth is limited to 1000. Excessive recursion may cause a program to fail, like this:

```
mysql> SELECT recursive_sum(1000);
ERROR 6113 (HY000): JavaScript> Maximum frame limit of 1000 exceeded. Frames on stack: 1001.
```

JavaScript stored programs are supported by MySQL Replication, subject to the condition that the MLE component is installed on every server in the topology. For more information, see Section 19.5.1.18, “Replication and JavaScript Stored Programs”.


### 27.3.12 JavaScript Stored Program Examples

This section contains examples illustrating a number of different aspects of using JavaScript programs under various circumstances.

The following example demonstrates the use of a JavaScript stored function with table column values. First we define a stored function `gcd()` which finds the greatest common denominator of two integers, shown here:

```
mysql> CREATE FUNCTION gcd(a INT, b INT)
    -> RETURNS INT NO SQL LANGUAGE JAVASCRIPT AS
    -> $mle$
    $>   let x = Math.abs(a)
    $>   let y = Math.abs(b)
    $>   while(y) {
    $>     var t = y
    $>     y = x % y
    $>     x = t
    $>   }
    $>   return x
    $> $mle$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

We can test the stored function, like this:

```
mysql> SELECT gcd(75, 220), gcd(75, 225);
+--------------+--------------+
| gcd(75, 220) | gcd(75, 225) |
+--------------+--------------+
|            5 |           75 |
+--------------+--------------+
1 row in set (0.00 sec)
```

Next we create a table `t1` with two integer columns and populate it with a few rows, like this:

```
mysql> CREATE TABLE t1 (c1 INT, c2 INT);
Query OK, 0 rows affected (0.02 sec)

mysql> INSERT INTO t1 VALUES ROW(12,70), ROW(17,3), ROW(81,9);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> TABLE t1;
+------+------+
| c1   | c2   |
+------+------+
|   12 |   70 |
|   17 |    3 |
|   81 |    9 |
+------+------+
3 rows in set (0.00 sec)
```

Now we can select from `t1`, using the `gcd()` function with the column values serving as argument values in the function call, as shown here:

```
mysql> SELECT c1, c2, gcd(c1, c2) AS G
    -> FROM t1
    -> WHERE gcd(c1, c2) > 1
    -> ORDER BY gcd(c1, c2);
+----+----+---+
| c1 | c2 | G |
+----+----+---+
| 12 | 70 | 2 |
| 81 |  9 | 9 |
+----+----+---+
8 rows in set (0.01 sec)
```

An argument value that is not of the specified type is coerced to the correct type when possible, as shown here:

```
mysql> SELECT gcd(500.3, 600), gcd(500.5, 600);
+-----------------+-----------------+
| gcd(500.3, 600) | gcd(500.5, 600) |
+-----------------+-----------------+
|             100 |               3 |
+-----------------+-----------------+
1 row in set (0.01 sec)
```

Rounding of floating point values to integers is accomplished using `Math.round()`; in this case, 500.3 is rounded down to 500, but 500.5 is rounded up to 501.

Next, we create a simple JavaScript stored procedure using a `CREATE PROCEDURE` statement that includes an `OUT` parameter for passing the current date and time in a human-readable format to a user variable. Since we are not certain how long this representation is, we use VARCHAR(25) for the parameter's type.

```
mysql> CREATE PROCEDURE d1 (OUT res VARCHAR(25))
    -> LANGUAGE JAVASCRIPT
    -> AS
    -> $$
    $>   let d = new Date().toString()
    $>   res = d
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

We can now test the stored procedure, first verifying that the user variable @today has not yet been set to any value, like this:

```
mysql> SELECT @today;
+----------------------+
| @today               |
+----------------------+
| NULL                 |
+----------------------+
1 row in set (0.01 sec)

mysql> CALL d1(@today);
ERROR 1406 (22001): Data too long for column 'res' at row 1
```

The procedure is syntactically valid, but the data type of the `INOUT` parameter (`res`) does not allow for a sufficient number of characters; rather than truncating the value, the stored program rejects it. Since it is not possible to alter procedure code in place, we must drop the procedure and re-create it; this time we try doubling the length specified for the `INOUT` parameter:

```
mysql> DROP PROCEDURE d1;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE PROCEDURE d1 (OUT res VARCHAR(50))
    -> LANGUAGE JAVASCRIPT
    -> AS
    -> $$
    $>   let d = new Date().toString()
    $>   res = d
    $> $$
    -> ;
Query OK, 0 rows affected (0.01 sec)
```

Now we can repeat the test, like this:

```
mysql> SELECT @today;
+----------------------+
| @today               |
+----------------------+
| NULL                 |
+----------------------+
1 row in set (0.01 sec)
```

Prior to invoking the updated procedure with `CALL`, the value of `@today` remains unset, since the original version of `d1()` did not execute successfully. The updated version runs successfully, and we see afterwards that, this time, the value of the user variable is set as expected:

```
mysql> CALL d1(@today);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @today;
+-----------------------------------------+
| @today                                  |
+-----------------------------------------+
| Mon Oct 30 2023 20:47:29 GMT+0000 (GMT) |
+-----------------------------------------+
1 row in set (0.00 sec)
```

Note

The value that you obtain from running this example is likely to differ to some extent from what is shown here, since the exact representation of dates is dependent upon your system locale, and possibly other settings. See the documentation for the JavaScript `Date` object for more information.

The next example demonstrates the use of a JavaScript stored function in a trigger.

First we create a table `t2` containing three integer columns, like this:

```
mysql> CREATE TABLE t2 (c1 INT, c2 INT, c3 INT);
Query OK, 0 rows affected (0.04 sec)
```

Now we can create a trigger on this table. This must be done using a `CREATE TRIGGER` statement written in the usual way using SQL (see Section 27.4, “Using Triggers”), but it can make use of stored routines written in JavaScript, such as the `js_pow()` function shown earlier in this section.

```
mysql> delimiter //
mysql> CREATE TRIGGER jst BEFORE INSERT ON t2
    -> FOR EACH ROW
    -> BEGIN
    ->   SET NEW.c2 = js_pow(NEW.c1, 2);
    ->   SET NEW.c3 = js_pow(NEW.c1, 3);
    -> END;
    -> //
Query OK, 0 rows affected (0.02 sec)

mysql> delimiter ;
mysql>
```

This trigger acts when a row is inserted into `t2`, taking the value inserted into the first column and inserting the square of this value into the second column, and its cube into the third. We test the trigger by inserting a few rows into the table; since the only value that is not thrown away is that which we supply for column `c1`, we can simply use `NULL` for each of the remaining two columns, as shown here:

```
mysql> INSERT INTO t2
    -> VALUES
    ->   ROW(1, NULL, NULL),
    ->   ROW(2.49, NULL, NULL),
    ->   ROW(-3, NULL, NULL),
    ->   ROW(4.725, NULL, NULL);
Query OK, 4 rows affected (0.01 sec)
Records: 4  Duplicates: 0  Warnings: 0
```

Since the function invoked by the trigger was written in JavaScript, JavaScript rounding rules apply, so that 2.49 is rounded down to 2, and 4.75 is rounded up to 5. We can see that this is the case when we check the result using a `TABLE` statement:

```
mysql> TABLE t2;
+------+------+------+
| c1   | c2   | c3   |
+------+------+------+
|    1 |    1 |    1 |
|    2 |    4 |    8 |
|   -3 |    9 |  -27 |
|    5 |   25 |  125 |
+------+------+------+
4 rows in set (0.00 sec)
```

The following examples demonstrate some of the basics of working with `VECTOR` values in MySQL JavaScript stored programs. We start by creating a table `v1` which contains a `VECTOR` column `c1`, like this:

```
mysql> CREATE TABLE v1 (
    ->   c1 VECTOR(3)
    -> );
Query OK, 0 rows affected (0.02 sec)
```

To insert some values into this table, we create a JavaScript stored procedure `vxin` that takes as its argument a string representation of a vector, converts it to a `VECTOR` value, and inserts it. We then call this procedure a number of times, as shown here:

```
mysql> CREATE PROCEDURE vxin (IN val VARCHAR(100))
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let q = "INSERT INTO v1 VALUES("
    $>     q += "STRING_TO_VECTOR(\"" + val + "\")"
    $>     q += ")"
    $>
    $>     let s = session.sql(q)
    $>
    $>     s.execute()
    $>   $$;
Query OK, 0 rows affected (0.00 sec)

mysql> CALL vxin("[50, 100, 50]");
Query OK, 1 row affected (0.01 sec)

mysql> CALL vxin("[100, 0, -50]");
Query OK, 1 row affected (0.00 sec)

mysql> CALL vxin("[250, 350, 450]");
Query OK, 1 row affected (0.01 sec)
```

After `v1` has been populated, the output from `TABLE v1` looks like this:

```
mysql> TABLE v1;
+----------------------------+
| c1                         |
+----------------------------+
| 0x000048420000C84200004842 |
| 0x0000C84200000000000048C2 |
| 0x00007A430000AF430000E143 |
+----------------------------+
3 rows in set (0.00 sec)
```

Next, we create a JavaScript stored procedure **`vxout1`**, which selects all of the rows in **`v1`**, retrieving the column values and writing them to `stdout`. The `CREATE PROCEDURE` statement used to create this procedure is shown here:

```
mysql> CREATE PROCEDURE vxout1 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("TABLE v1");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.00 sec)
```

We can test this procedure like this:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout1();
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): c1
50,100,50
100,0,-50
250,350,450

1 row in set (0.00 sec)
```

You might be expecting to see the same binary representations shown in the output of the `TABLE` statement. Because JavaScript treats a `VECTOR` value as an array (an instance of `Float32Array`), it is displayed using array format. You can use the SQL `HEX()` function to force such values to be displayed using binary notation, if desired, like this:

```
mysql> CREATE PROCEDURE vxout2 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("SELECT HEX(c1) FROM v1");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout2();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): HEX(c1)
000048420000C84200004842
0000C84200000000000048C2
00007A430000AF430000E143

1 row in set (0.00 sec)
```

The display format notwithstanding, `VECTOR` values are handled as vectors, and not as strings or arrays, as we can see from the following example which employs the (MySQL HeatWave-only) `DISTANCE()` function. First we create and populate a table `v2` containing two `VECTOR` columns, using the SQL statements shown here:

```
CREATE TABLE v2 (
  c1 VECTOR(3),
  c2 VECTOR(3)
);

INSERT INTO v2 VALUES
  ROW(STRING_TO_VECTOR("[50, 100, 50]"), STRING_TO_VECTOR("[0, 200, 0]")),
  ROW(STRING_TO_VECTOR("[100, 0, -50]"), STRING_TO_VECTOR("[5, 10, 5]")),
  ROW(STRING_TO_VECTOR("[250, 350, 450]"), STRING_TO_VECTOR("[-150, 1000, 50]"))
;
```

The following query shows the dot product of the two vectors in each row:

```
mysql> SELECT VECTOR_DISTANCE(c1, c2, "DOT") AS d FROM v2;
+--------+
| d      |
+--------+
|  20000 |
|    250 |
| 335000 |
+--------+
3 rows in set (0.00 sec)
```

Note

The dot product of two vectors is defined as the sum of the products of their components, in order. For example, for the vectors in the second row in table `v5` (`[100, 0, -50]` and `[5, 10, 5]`), the dot product is `(100)(5) + (0)(10) + (-50)(5) = 500 + 0 - 250 = 250`.

You can write your own JavaScript function for obtaining the dot product of two vectors, similar to this one:

```
mysql> CREATE FUNCTION dot_product (v1 VECTOR, v2 VECTOR)
    -> RETURNS FLOAT DETERMINISTIC
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     if(v1.length !== v2.length)
    $>       throw new Error('Vectors must be of the same length')
    $>
    $>     let dot = 0, i=0
    $>
    $>     for(i=0; i<v1.length; i++)
    $>       dot += v1[i]*v2[i]
    $>
    $>     return dot
    $>   $$;

mysql> SELECT dot_product(c1, c2) AS dot FROM v5\G
*************************** 1. row ***************************
dot: 20000
*************************** 2. row ***************************
dot: 250
*************************** 3. row ***************************
dot: 335000
```

Next, we create a JavaScript stored procedure `vxout5` that executes the same query, like this:

```
mysql> CREATE PROCEDURE vxout5 ()
    -> LANGUAGE JAVASCRIPT
    ->   AS $$
    $>     let s = session.sql("SELECT VECTOR_DISTANCE(c1, c2, \"DOT\") AS d FROM v5");
    $>
    $>     let res = s.execute()
    $>
    $>     console.log(res.getColumnNames())
    $>
    $>     let row = res.fetchOne()
    $>
    $>     while(row) {
    $>       console.log(row.toArray())
    $>       row = res.fetchOne()
    $>     }
    $>   $$;
Query OK, 0 rows affected (0.01 sec)
```

When we run `vxout5` (first clearing the session state using `mle_session_reset()` as before), we can see that the column values from `v5` are handled as vectors, with the same result as from running the query directly in the **mysql** client:

```
mysql> SELECT mle_session_reset();
+------------------------------------------+
| mle_session_reset()                      |
+------------------------------------------+
| The session state is successfully reset. |
+------------------------------------------+
1 row in set (0.00 sec)

mysql> CALL vxout5();
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT mle_session_state("stdout")\G
*************************** 1. row ***************************
mle_session_state("stdout"): d
20000
250
335000

1 row in set (0.00 sec)
```
