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

<table border="1" class="informaltable" summary="Type conversion: MySQL session variables to JavaScript variables"><colgroup><col/><col/><col/></colgroup><thead><tr><th>MySQL type</th><th>JavaScript type</th><th>Comments</th></tr></thead><tbody><tr><td><code class="literal">NULL</code></td><td><code class="literal">null</code></td><td>-</td></tr><tr><td><code class="literal">BIGINT</code></td><td><code class="literal">Number</code>, <code class="literal">String</code>, or <code class="literal">BigInt</code></td><td>Depends on <code class="literal">session.sql()</code> method <code class="literal">integerType</code> option value</td></tr><tr><td><code class="literal">DECIMAL</code> or <code class="literal">NUMERIC</code></td><td><code class="literal">String</code> or <code class="literal">Number</code></td><td>Depends on <code class="literal">session.sql()</code> method <code class="literal">decimalType</code> option value</td></tr><tr><td><code class="literal">DOUBLE</code></td><td><code class="literal">Number</code></td><td>-</td></tr><tr><td>Binary string</td><td><code class="literal">Uint8Array</code></td><td>-</td></tr><tr><td>String</td><td><code class="literal">String</code></td><td>-</td></tr></tbody></table>

Rules for type conversion from JavaScript variables to MySQL session variables are shown in the following table:

<table border="1" class="informaltable" summary="Type conversion: JavaScript variables to MySQL session variables"><colgroup><col/><col/><col/></colgroup><thead><tr><th>JavaScript type</th><th>MySQL type</th><th>Comment</th></tr></thead><tbody><tr><td><code class="literal">null</code> or <code class="literal">undefined</code></td><td><code class="literal">NULL</code></td><td>-</td></tr><tr><td><code class="literal">Boolean</code></td><td><code class="literal">BIGINT</code></td><td>-</td></tr><tr><td><code class="literal">Number</code></td><td><code class="literal">BIGINT</code>, <code class="literal">DECIMAL</code>, or <code class="literal">DOUBLE</code></td><td>-</td></tr><tr><td><code class="literal">Infinity</code>, <code class="literal">NaN</code>, or <code class="literal">Symbol</code></td><td>-</td><td>Error: Type cannot be used for session variables</td></tr><tr><td><code class="literal">String</code></td><td>string</td><td>-</td></tr><tr><td><code class="literal">BigInt</code></td><td><code class="literal">BIGINT</code></td><td>-</td></tr><tr><td><code class="literal">TypedArray</code> or <code class="literal">Float32Array</code></td><td><code class="literal">BINARY</code></td><td>-</td></tr><tr><td><code class="literal">Object</code></td><td>string</td><td>-</td></tr><tr><td><code class="literal">Array</code></td><td>string</td><td>-</td></tr></tbody></table>

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
