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

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>MySQL Type</th> <th>JavaScript Type</th> </tr></thead><tbody><tr> <td><code class="literal">TINYINT</code>, <code class="literal">SMALLINT</code>, <code class="literal">MEDIUMINT</code>, <code class="literal">INT</code>, <code class="literal">BOOL</code>, <code class="literal">BIGINT</code>, or <code class="literal">SERIAL</code></td> <td>If safe: <code class="literal">Number</code>; otherwise: <code class="literal">String</code></td> </tr><tr> <td><code class="literal">FLOAT</code> or <code class="literal">DOUBLE</code></td> <td><code class="literal">Number</code></td> </tr><tr> <td><code class="literal">CHAR</code>, <code class="literal">VARCHAR</code>, <code class="literal">TINYTEXT</code>, <code class="literal">TEXT</code>, <code class="literal">MEDIUMTEXT</code>, or <code class="literal">LONGTEXT</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">TINYBLOB</code>, <code class="literal">BLOB</code>, <code class="literal">MEDIUMBLOB</code>, <code class="literal">LONGBLOB</code>, <code class="literal">BINARY</code>, or <code class="literal">VARBINARY</code></td> <td><code class="literal">Uint8Array</code></td> </tr><tr> <td><code class="literal">DATE</code>, <code class="literal">DATETIME</code>, or <code class="literal">TIMESTAMP</code></td> <td><code class="literal">Date</code></td> </tr><tr> <td><code class="literal">TIME</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">YEAR</code></td> <td><code class="literal">Number</code></td> </tr><tr> <td><code class="literal">VECTOR</code></td> <td><code class="literal">Float32Array</code></td> </tr><tr> <td><code class="literal">DECIMAL</code></td> <td><code class="literal">String</code> or <code class="literal">Number</code> depending on the value of <code class="literal">session.options.decimalType</code> (<code class="literal">STRING</code> or <code class="literal">NUMBER</code>, respectively). By default, converted to <code class="literal">String</code>.</td> </tr><tr> <td><code class="literal">BIT(<em><code>M</code></em>)</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <code class="literal">BIT(<em><code>M</code></em>)</code> &lt;= <code class="literal">JavaScript.MAX_SAFE_INTEGER</code>: <code class="literal">Number</code> </p></li><li class="listitem"><p> <code class="literal">BIT(<em><code>M</code></em>)</code> &gt; <code class="literal">JavaScript.MAX_SAFE_INTEGER</code>: <code class="literal">BigInt</code> </p></li></ul> </div> </td> </tr></tbody></table>

Conversion to or from a MySQL integer whose value lies outside the range -(253-1) (-9007199254740991) to 253-1 (9007199254740991) is lossy. How conversion from MySQL integers to JavaScript is performed can be changed for the current session using `mle_set_session_state()`; the default behavior is equivalent to calling this function using `UNSAFE_STRING` as the value for `integer_type`. See the description of that function for more information.

SQL `NULL` is supported for all the types listed, and is converted to and from JavaScript `null` as required.

JavaScript (unlike SQL) is a dynamically typed language, which means that return types are known only at execution time. JavaScript return value and output arguments (`OUT` and `INOUT` parameters) are automatically converted back into the expected MySQL type based on the mappings shown in the following table:

**Table 27.2 Type Conversion: JavaScript to MySQL**

<table border="1" class="table" summary="Conversion of JavaScript data types to MySQL types"><colgroup><col/><col/><col/><col/><col/><col/><col/><col/><col/></colgroup><thead><tr><th>From JavaScript Type</th><th>To MySQL <code class="literal">TINYINT</code>, <code class="literal">SMALLINT</code>, <code class="literal">MEDIUMINT</code>, <code class="literal">INT</code>, <code class="literal">BIGINT</code>, <code class="literal">BOOLEAN</code>, or <code class="literal">SERIAL</code></th><th>To MySQL <code class="literal">CHAR</code> or <code class="literal">VARCHAR</code></th><th>To MySQL <code class="literal">FLOAT</code> or <code class="literal">DOUBLE</code></th><th>To MySQL <code class="literal">TINYTEXT</code>, <code class="literal">TEXT</code>, <code class="literal">MEDIUMTEXT</code>, or <code class="literal">LONGTEXT</code></th><th>To MySQL <code class="literal">TINYBLOB</code>, <code class="literal">BLOB</code>, <code class="literal">MEDIUMBLOB</code>, <code class="literal">LONGBLOB</code>, <code class="literal">BINARY</code>, <code class="literal">VARBINARY</code></th><th>To MySQL <code class="literal">VECTOR</code></th><th>To MySQL <code class="literal">DECIMAL</code> (<code class="literal">NUMERIC</code>)</th><th>To MySQL <code class="literal">BIT</code></th></tr></thead><tbody><tr><td><code class="literal">Boolean</code></td><td>Cast to <code class="literal">Integer</code></td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Cast to <code class="literal">Float</code></td><td>If JavaScript <code class="literal">Boolean</code> <code class="literal">true</code>: convert to <span class="quote">“<span class="quote">true</span>”</span>; if JavaScript <code class="literal">Boolean</code> <code class="literal">false</code>: convert to <span class="quote">“<span class="quote">false</span>”</span></td><td>Error</td><td>Error</td><td>Convert to <code class="literal">Decimal</code></td><td>Convert to <code class="literal">Bit</code></td></tr><tr><td><code class="literal">Number</code></td><td>Round value to <code class="literal">Integer</code>; check whether value is out of range</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Retain value; check whether this is out of range</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Error</td><td>Error</td><td>Convert to <code class="literal">Decimal</code></td><td>Convert to <code class="literal">Bit</code></td></tr><tr><td><code class="literal">BigInteger</code></td><td>Retain value; check whether out of range</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Cast to <code class="literal">Float</code>; check whether result is out of range</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Error</td><td>Error</td><td>Convert to <code class="literal">Decimal</code></td><td>Convert to <code class="literal">Bit</code></td></tr><tr><td><code class="literal">String</code></td><td>Parse as number and round to <code class="literal">Integer</code>; check for value out of range</td><td>Retain value; check whether length is within range</td><td>Parse value to <code class="literal">Float</code>; check for value out of range values</td><td>Use existing string value; check whether length of string is within expected range</td><td>Error</td><td>Error</td><td>Convert to <code class="literal">Decimal</code></td><td>Convert to <code class="literal">Bit</code></td></tr><tr><td><code class="literal">Symbol</code> or <code class="literal">Object</code></td><td>Raise invalid type conversion error</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Raise invalid type conversion error</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Error</td><td>Error</td><td>Error</td><td>Error</td></tr><tr><td>Typed <code class="literal">Array</code></td><td>Raise invalid type conversion error</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Raise invalid type conversion error</td><td>Convert to <code class="literal">String</code>; check whether length of result is within expected range</td><td>Convert to byte array; check whether result is within expected size</td><td>Treat as <code class="literal">Float32Array</code>; convert to byte array, checking whether it is within the expected <code class="literal">VECTOR</code> field size</td><td>Error</td><td>Error</td></tr><tr><td><code class="literal">null</code> or <code class="literal">undefined</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td></tr></tbody></table>

Notes:

* JavaScript `Infinity` and `-Infinity` are treated as out-of-range values.

* JavaScript `NaN` raises an invalid type conversion error.

* All rounding is performed using `Math.round()`.

* Attempting to cast a `BigInt` or `String` having a non-numeric value to MySQL `FLOAT` raises an invalid type conversion error.

* The maximum supported length for strings is 1073741799.
* The maximum supported length for `BLOB` values is 2147483639.

* `JavaScript.MAX_SAFE_INTEGER` is equal to 9007199254740991 (253-1).

**Table 27.3 Type Conversion: JavaScript Dates to MySQL**

<table border="1" class="table" summary="Conversion of JavaScript Date values to MySQL temporal types"><colgroup><col/><col/><col/><col/></colgroup><thead><tr><th>JavaScript Type</th><th>MySQL <code class="literal">DATE</code></th><th>MySQL <code class="literal">DATETIME</code>, <code class="literal">TIMESTAMP</code></th><th>MySQL YEAR</th></tr></thead><tbody><tr><td><code class="literal">null</code> or <code class="literal">undefined</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td></tr><tr><td><code class="literal">Date</code></td><td>Retain value as is, rounding off any time part to the closest second.</td><td>Keep value as is.</td><td>Extract year from the <code class="literal">Date</code></td></tr><tr><td>Type convertible to JavaScript <code class="literal">Date</code> (formatted string)</td><td>Cast value to JavaScript <code class="literal">Date</code> and handle accordingly</td><td>Cast value to JavaScript <code class="literal">Date</code> and handle accordingly</td><td>If value contains 4-digit year, use it.</td></tr><tr><td>Type not convertible to JavaScript <code class="literal">Date</code></td><td>Invalid type conversion error</td><td>Invalid type conversion error</td><td>If value contains 4-digit year, use it.</td></tr></tbody></table>

Passing a MySQL zero date (`00-00-0000`) or zero-in-date value (such as `00-01-2023`) leads to the creation of an `Invalid Date` instance of `Date`. When passed a MySQL date which is invalid (for example, 31 February), MLE calls a JavaScript `Date` constructor with invalid individual date and time component values.

The MySQL `TIME` type is handled as a string, and is validated inside MySQL. See Section 13.2.3, “The TIME Type”, for more information.

**Table 27.4 Conversion of MySQL JSON types to JavaScript**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>MySQL JSON Type</th> <th>JavaScript Type</th> </tr></thead><tbody><tr> <td><code class="literal">NULL</code>, <code class="literal">JSON NULL</code></td> <td><code class="literal">null</code></td> </tr><tr> <td><code class="literal">JSON OBJECT</code></td> <td><code class="literal">Object</code></td> </tr><tr> <td><code class="literal">JSON ARRAY</code></td> <td><code class="literal">Array</code></td> </tr><tr> <td><code class="literal">JSON BOOLEAN</code></td> <td><code class="literal">Boolean</code></td> </tr><tr> <td><code class="literal">JSON INTEGER</code>, <code class="literal">JSON DOUBLE</code>, <code class="literal">JSON DECIMAL</code></td> <td><code class="literal">Number</code></td> </tr><tr> <td><code class="literal">JSON STRING</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">JSON DATETIME</code>, <code class="literal">JSON DATE</code>, <code class="literal">JSON TIME</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">JSON BLOB</code>, <code class="literal">JSON OPAQUE</code></td> <td><code class="literal">String</code></td> </tr></tbody></table>

Note

A MySQL JSON string, when converted to a JavaScript string, becomes unquoted.

**Table 27.5 Conversion of JavaScript types to MySQL JSON**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>JavaScript Type</th> <th>MySQL JSON Type</th> </tr></thead><tbody><tr> <td><code class="literal">null</code>, <code class="literal">undefined</code></td> <td><code class="literal">NULL</code></td> </tr><tr> <td><code class="literal">Boolean</code></td> <td>Error</td> </tr><tr> <td><code class="literal">Number</code></td> <td>Error</td> </tr><tr> <td><code class="literal">String</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Can be parsed as JSON: JSON string, JSON object, or JSON array </p></li><li class="listitem"><p> Cannot be parsed as JSON: Error </p></li><li class="listitem"><p> <code class="literal">'null'</code>: JSON <code class="literal">null</code> </p></li></ul> </div> </td> </tr><tr> <td><code class="literal">BigInt</code></td> <td>Error</td> </tr><tr> <td><code class="literal">Object</code></td> <td>JSON object or error (see text following table)</td> </tr><tr> <td><code class="literal">Array</code></td> <td>JSON array</td> </tr><tr> <td><code class="literal">Symbol</code></td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Inside an object: ignored </p></li><li class="listitem"><p> Inside an array: JSON <code class="literal">null</code> </p></li></ul> </div> Scalar value: Error</td> </tr></tbody></table>

Notes:

* A value within a container such as a JSON array or JSON object is converted (loss of precision is possible for `Number` values). A scalar value throws an error.

* JavaScript `BigInt` values cannot be converted to MySQL JSON; attempting to perform such a conversion always raises an error, regardless of whether the value is inside a container or not.

* It may or may not be possible to convert a JavaScript `Object` to MySQL JSON, depending on how `toJSON()` is implemented for the object in question. Some examples are listed here:

  + The `toJSON()` method of the JavaScript `Date` class converts a `Date` to a string having invalid JSON syntax, thus throwing a conversion error.

  + For the `Set` class, `toJSON()` returns `"{}"` which is a valid JSON string.

  + For JSON-like objects, `toJSON()` returns a valid JSON string.

**Conversion to and from MySQL ENUM and SET.** `ENUM` converts to a JavaScript `String`; `SET` converts to a JavaScript `Set` object, as shown in the following table:

**Table 27.6 Conversion of the MySQL ENUM and SET types to JavaScript**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <td>MySQL Type</td> <td>JavaScript Type</td> </tr></thead><tbody><tr> <td><code class="literal">ENUM</code></td> <td><code class="literal">String</code></td> </tr><tr> <td><code class="literal">SET</code></td> <td><code class="literal">Set</code></td> </tr></tbody></table>

The following table shows rules for converting a JavaScript type to a MySQL `ENUM` or `SET` type:

**Table 27.7 Type Conversion: JavaScript types to MySQL ENUM and SET**

<table border="1" class="table" summary="Conversion of JavaScript types to the MySQL ENUM and SET types"><colgroup><col/><col/><col/></colgroup><thead><tr><th>JavaScript Type</th><th>To MySQL <code class="literal">ENUM</code></th><th>To MySQL <code class="literal">SET</code></th></tr></thead><tbody><tr><td>String</td><td>Preserve value; check whether string is valid <code class="literal">ENUM</code> value</td><td>Preserve value; check whether string is valid <code class="literal">SET</code> value</td></tr><tr><td><code class="literal">null</code>, <code class="literal">undefined</code></td><td><code class="literal">NULL</code></td><td><code class="literal">NULL</code></td></tr><tr><td><code class="literal">Set</code></td><td>Error</td><td>Convert to comma-separated string; check whether string is valid <code class="literal">SET</code> value</td></tr><tr><td>Any other type</td><td>Error</td><td>Error</td></tr></tbody></table>

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

<table border="1" class="table" summary="Conversion of JavaScript types to the MySQL DECIMAL type"><colgroup><col/><col/></colgroup><thead><tr><th>JavaScript Type</th><th>Returns</th></tr></thead><tbody><tr><td><code class="literal">Object</code>, <code class="literal">Array</code>, or <code class="literal">Symbol</code></td><td>Error: Conversion not supported</td></tr><tr><td><code class="literal">Boolean</code>, <code class="literal">Number</code>, <code class="literal">String</code>, or <code class="literal">BigInt</code></td><td><code class="literal">DECIMAL</code> value</td></tr><tr><td><code class="literal">null</code>, <code class="literal">undefined</code></td><td>SQL <code class="literal">NULL</code></td></tr></tbody></table>

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
