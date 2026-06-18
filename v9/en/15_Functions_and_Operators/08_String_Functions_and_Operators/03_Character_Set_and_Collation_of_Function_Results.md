### 14.8.3 Character Set and Collation of Function Results

MySQL has many operators and functions that return a string.
This section answers the question: What is the character set and
collation of such a string?

For simple functions that take string input and return a string
result as output, the output's character set and collation are
the same as those of the principal input value. For example,
[`UPPER(X)`](string-functions.html#function_upper)
returns a string with the same character string and collation as
*`X`*. The same applies for
[`INSTR()`](string-functions.html#function_instr),
[`LCASE()`](string-functions.html#function_lcase),
[`LOWER()`](string-functions.html#function_lower),
[`LTRIM()`](string-functions.html#function_ltrim),
[`MID()`](string-functions.html#function_mid),
[`REPEAT()`](string-functions.html#function_repeat),
[`REPLACE()`](string-functions.html#function_replace),
[`REVERSE()`](string-functions.html#function_reverse),
[`RIGHT()`](string-functions.html#function_right),
[`RPAD()`](string-functions.html#function_rpad),
[`RTRIM()`](string-functions.html#function_rtrim),
[`SOUNDEX()`](string-functions.html#function_soundex),
[`SUBSTRING()`](string-functions.html#function_substring),
[`TRIM()`](string-functions.html#function_trim),
[`UCASE()`](string-functions.html#function_ucase), and
[`UPPER()`](string-functions.html#function_upper).

Note

The [`REPLACE()`](string-functions.html#function_replace) function, unlike
all other functions, always ignores the collation of the
string input and performs a case-sensitive comparison.

If a string input or function result is a binary string, the
string has the `binary` character set and
collation. This can be checked by using the
[`CHARSET()`](information-functions.html#function_charset) and
[`COLLATION()`](information-functions.html#function_collation) functions, both of
which return `binary` for a binary string
argument:

```
mysql> SELECT CHARSET(BINARY 'a'), COLLATION(BINARY 'a');
+---------------------+-----------------------+
| CHARSET(BINARY 'a') | COLLATION(BINARY 'a') |
+---------------------+-----------------------+
| binary              | binary                |
+---------------------+-----------------------+
```

For operations that combine multiple string inputs and return a
single string output, the “aggregation rules” of
standard SQL apply for determining the collation of the result:

* If an explicit `COLLATE
  Y` occurs, use
  *`Y`*.

* If explicit `COLLATE
  Y` and `COLLATE
  Z` occur, raise an
  error.

* Otherwise, if all collations are
  *`Y`*, use
  *`Y`*.

* Otherwise, the result has no collation.

For example, with `CASE ... WHEN a THEN b WHEN b THEN c
COLLATE X END`, the
resulting collation is *`X`*. The same
applies for [`UNION`](union.html "15.2.18 UNION Clause"),
[`||`](logical-operators.html#operator_or),
[`CONCAT()`](string-functions.html#function_concat),
[`ELT()`](string-functions.html#function_elt),
[`GREATEST()`](comparison-operators.html#function_greatest),
[`IF()`](flow-control-functions.html#function_if), and
[`LEAST()`](comparison-operators.html#function_least).

For operations that convert to character data, the character set
and collation of the strings that result from the operations are
defined by the
[`character_set_connection`](server-system-variables.html#sysvar_character_set_connection) and
[`collation_connection`](server-system-variables.html#sysvar_collation_connection) system
variables that determine the default connection character set
and collation (see [Section 12.4, “Connection Character Sets and Collations”](charset-connection.html "12.4 Connection Character Sets and Collations")). This
applies only to [`BIN_TO_UUID()`](miscellaneous-functions.html#function_bin-to-uuid),
[`CAST()`](cast-functions.html#function_cast),
[`CONV()`](mathematical-functions.html#function_conv),
[`FORMAT()`](string-functions.html#function_format),
[`HEX()`](string-functions.html#function_hex), and
[`SPACE()`](string-functions.html#function_space).

An exception to the preceding principle occurs for expressions
for virtual generated columns. In such expressions, the table
character set is used for
[`BIN_TO_UUID()`](miscellaneous-functions.html#function_bin-to-uuid),
[`CONV()`](mathematical-functions.html#function_conv), or
[`HEX()`](string-functions.html#function_hex) results, regardless of
connection character set.

If there is any question about the character set or collation of
the result returned by a string function, use the
[`CHARSET()`](information-functions.html#function_charset) or
[`COLLATION()`](information-functions.html#function_collation) function to find out:

```
mysql> SELECT USER(), CHARSET(USER()), COLLATION(USER());
+----------------+-----------------+--------------------+
| USER()         | CHARSET(USER()) | COLLATION(USER())  |
+----------------+-----------------+--------------------+
| test@localhost | utf8mb3         | utf8mb3_general_ci |
+----------------+-----------------+--------------------+
mysql> SELECT CHARSET(COMPRESS('abc')), COLLATION(COMPRESS('abc'));
+--------------------------+----------------------------+
| CHARSET(COMPRESS('abc')) | COLLATION(COMPRESS('abc')) |
+--------------------------+----------------------------+
| binary                   | binary                     |
+--------------------------+----------------------------+
```