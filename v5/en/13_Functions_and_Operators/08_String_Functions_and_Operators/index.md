## 12.8 String Functions and Operators

[12.8.1 String Comparison Functions and Operators](string-comparison-functions.html)

[12.8.2 Regular Expressions](regexp.html)

[12.8.3 Character Set and Collation of Function Results](string-functions-charset.html)

**Table 12.12 String Functions and Operators**

<table frame="box" rules="all" summary="A reference that lists string functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th>
<th>Description</th>
</tr></thead><tbody><tr><td><code>ASCII()</code></td>
<td>
      Return numeric value of left-most character
    </td>
</tr><tr><td><code>BIN()</code></td>
<td>
      Return a string containing binary representation of a number
    </td>
</tr><tr><td><code>BIT_LENGTH()</code></td>
<td>
      Return length of argument in bits
    </td>
</tr><tr><td><code>CHAR()</code></td>
<td>
      Return the character for each integer passed
    </td>
</tr><tr><td><code>CHAR_LENGTH()</code></td>
<td>
      Return number of characters in argument
    </td>
</tr><tr><td><code>CHARACTER_LENGTH()</code></td>
<td>
      Synonym for CHAR_LENGTH()
    </td>
</tr><tr><td><code>CONCAT()</code></td>
<td>
      Return concatenated string
    </td>
</tr><tr><td><code>CONCAT_WS()</code></td>
<td>
      Return concatenate with separator
    </td>
</tr><tr><td><code>ELT()</code></td>
<td>
      Return string at index number
    </td>
</tr><tr><td><code>EXPORT_SET()</code></td>
<td>
      Return a string such that for every bit set in the value bits, you
      get an on string and for every unset bit, you get an off string
    </td>
</tr><tr><td><code>FIELD()</code></td>
<td>
      Index (position) of first argument in subsequent arguments
    </td>
</tr><tr><td><code>FIND_IN_SET()</code></td>
<td>
      Index (position) of first argument within second argument
    </td>
</tr><tr><td><code>FORMAT()</code></td>
<td>
      Return a number formatted to specified number of decimal places
    </td>
</tr><tr><td><code>FROM_BASE64()</code></td>
<td>
      Decode base64 encoded string and return result
    </td>
</tr><tr><td><code>HEX()</code></td>
<td>
      Hexadecimal representation of decimal or string value
    </td>
</tr><tr><td><code>INSERT()</code></td>
<td>
      Insert substring at specified position up to specified number of
      characters
    </td>
</tr><tr><td><code>INSTR()</code></td>
<td>
      Return the index of the first occurrence of substring
    </td>
</tr><tr><td><code>LCASE()</code></td>
<td>
      Synonym for LOWER()
    </td>
</tr><tr><td><code>LEFT()</code></td>
<td>
      Return the leftmost number of characters as specified
    </td>
</tr><tr><td><code>LENGTH()</code></td>
<td>
      Return the length of a string in bytes
    </td>
</tr><tr><td><code>LIKE</code></td>
<td>
      Simple pattern matching
    </td>
</tr><tr><td><code>LOAD_FILE()</code></td>
<td>
      Load the named file
    </td>
</tr><tr><td><code>LOCATE()</code></td>
<td>
      Return the position of the first occurrence of substring
    </td>
</tr><tr><td><code>LOWER()</code></td>
<td>
      Return the argument in lowercase
    </td>
</tr><tr><td><code>LPAD()</code></td>
<td>
      Return the string argument, left-padded with the specified string
    </td>
</tr><tr><td><code>LTRIM()</code></td>
<td>
      Remove leading spaces
    </td>
</tr><tr><td><code>MAKE_SET()</code></td>
<td>
      Return a set of comma-separated strings that have the
      corresponding bit in bits set
    </td>
</tr><tr><td><code>MATCH()</code></td>
<td>
      Perform full-text search
    </td>
</tr><tr><td><code>MID()</code></td>
<td>
      Return a substring starting from the specified position
    </td>
</tr><tr><td><code>NOT LIKE</code></td>
<td>
      Negation of simple pattern matching
    </td>
</tr><tr><td><code>NOT REGEXP</code></td>
<td>
      Negation of REGEXP
    </td>
</tr><tr><td><code>OCT()</code></td>
<td>
      Return a string containing octal representation of a number
    </td>
</tr><tr><td><code>OCTET_LENGTH()</code></td>
<td>
      Synonym for LENGTH()
    </td>
</tr><tr><td><code>ORD()</code></td>
<td>
      Return character code for leftmost character of the argument
    </td>
</tr><tr><td><code>POSITION()</code></td>
<td>
      Synonym for LOCATE()
    </td>
</tr><tr><td><code>QUOTE()</code></td>
<td>
      Escape the argument for use in an SQL statement
    </td>
</tr><tr><td><code>REGEXP</code></td>
<td>
      Whether string matches regular expression
    </td>
</tr><tr><td><code>REPEAT()</code></td>
<td>
      Repeat a string the specified number of times
    </td>
</tr><tr><td><code>REPLACE()</code></td>
<td>
      Replace occurrences of a specified string
    </td>
</tr><tr><td><code>REVERSE()</code></td>
<td>
      Reverse the characters in a string
    </td>
</tr><tr><td><code>RIGHT()</code></td>
<td>
      Return the specified rightmost number of characters
    </td>
</tr><tr><td><code>RLIKE</code></td>
<td>
      Whether string matches regular expression
    </td>
</tr><tr><td><code>RPAD()</code></td>
<td>
      Append string the specified number of times
    </td>
</tr><tr><td><code>RTRIM()</code></td>
<td>
      Remove trailing spaces
    </td>
</tr><tr><td><code>SOUNDEX()</code></td>
<td>
      Return a soundex string
    </td>
</tr><tr><td><code>SOUNDS LIKE</code></td>
<td>
      Compare sounds
    </td>
</tr><tr><td><code>SPACE()</code></td>
<td>
      Return a string of the specified number of spaces
    </td>
</tr><tr><td><code>STRCMP()</code></td>
<td>
      Compare two strings
    </td>
</tr><tr><td><code>SUBSTR()</code></td>
<td>
      Return the substring as specified
    </td>
</tr><tr><td><code>SUBSTRING()</code></td>
<td>
      Return the substring as specified
    </td>
</tr><tr><td><code>SUBSTRING_INDEX()</code></td>
<td>
      Return a substring from a string before the specified number of
      occurrences of the delimiter
    </td>
</tr><tr><td><code>TO_BASE64()</code></td>
<td>
      Return the argument converted to a base-64 string
    </td>
</tr><tr><td><code>TRIM()</code></td>
<td>
      Remove leading and trailing spaces
    </td>
</tr><tr><td><code>UCASE()</code></td>
<td>
      Synonym for UPPER()
    </td>
</tr><tr><td><code>UNHEX()</code></td>
<td>
      Return a string containing hex representation of a number
    </td>
</tr><tr><td><code>UPPER()</code></td>
<td>
      Convert to uppercase
    </td>
</tr><tr><td><code>WEIGHT_STRING()</code></td>
<td>
      Return the weight string for a string
    </td>
</tr></tbody></table>

String-valued functions return `NULL` if the
length of the result would be greater than the value of the
[`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) system
variable. See [Section 5.1.1, “Configuring the Server”](server-configuration.html "5.1.1 Configuring the Server").

For functions that operate on string positions, the first position
is numbered 1.

For functions that take length arguments, noninteger arguments are
rounded to the nearest integer.

* [`ASCII(str)`](string-functions.html#function_ascii)

  Returns the numeric value of the leftmost character of the
  string *`str`*. Returns
  `0` if *`str`* is the
  empty string. Returns `NULL` if
  *`str`* is `NULL`.
  [`ASCII()`](string-functions.html#function_ascii) works for 8-bit
  characters.

  ```sql
  mysql> SELECT ASCII('2');
          -> 50
  mysql> SELECT ASCII(2);
          -> 50
  mysql> SELECT ASCII('dx');
          -> 100
  ```

  See also the [`ORD()`](string-functions.html#function_ord) function.

* [`BIN(N)`](string-functions.html#function_bin)

  Returns a string representation of the binary value of
  *`N`*, where
  *`N`* is a longlong
  ([`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number. This is
  equivalent to
  [`CONV(N,10,2)`](mathematical-functions.html#function_conv).
  Returns `NULL` if
  *`N`* is `NULL`.

  ```sql
  mysql> SELECT BIN(12);
          -> '1100'
  ```

* [`BIT_LENGTH(str)`](string-functions.html#function_bit-length)

  Returns the length of the string
  *`str`* in bits.

  ```sql
  mysql> SELECT BIT_LENGTH('text');
          -> 32
  ```

* [`CHAR(N,...
  [USING charset_name])`](string-functions.html#function_char)

  [`CHAR()`](string-functions.html#function_char) interprets each argument
  *`N`* as an integer and returns a
  string consisting of the characters given by the code values
  of those integers. `NULL` values are skipped.

  ```sql
  mysql> SELECT CHAR(77,121,83,81,'76');
          -> 'MySQL'
  mysql> SELECT CHAR(77,77.3,'77.3');
          -> 'MMM'
  ```

  [`CHAR()`](string-functions.html#function_char) arguments larger than
  255 are converted into multiple result bytes. For example,
  [`CHAR(256)`](string-functions.html#function_char) is equivalent to
  [`CHAR(1,0)`](string-functions.html#function_char), and
  [`CHAR(256*256)`](string-functions.html#function_char) is equivalent to
  [`CHAR(1,0,0)`](string-functions.html#function_char):

  ```sql
  mysql> SELECT HEX(CHAR(1,0)), HEX(CHAR(256));
  +----------------+----------------+
  | HEX(CHAR(1,0)) | HEX(CHAR(256)) |
  +----------------+----------------+
  | 0100           | 0100           |
  +----------------+----------------+
  mysql> SELECT HEX(CHAR(1,0,0)), HEX(CHAR(256*256));
  +------------------+--------------------+
  | HEX(CHAR(1,0,0)) | HEX(CHAR(256*256)) |
  +------------------+--------------------+
  | 010000           | 010000             |
  +------------------+--------------------+
  ```

  By default, [`CHAR()`](string-functions.html#function_char) returns a
  binary string. To produce a string in a given character set,
  use the optional `USING` clause:

  ```sql
  mysql> SELECT CHARSET(CHAR(X'65')), CHARSET(CHAR(X'65' USING utf8));
  +----------------------+---------------------------------+
  | CHARSET(CHAR(X'65')) | CHARSET(CHAR(X'65' USING utf8)) |
  +----------------------+---------------------------------+
  | binary               | utf8                            |
  +----------------------+---------------------------------+
  ```

  If `USING` is given and the result string is
  illegal for the given character set, a warning is issued.
  Also, if strict SQL mode is enabled, the result from
  [`CHAR()`](string-functions.html#function_char) becomes
  `NULL`.

  If [`CHAR()`](string-functions.html#function_char) is invoked from
  within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary strings
  display using hexadecimal notation, depending on the value of
  the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more
  information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`CHAR_LENGTH(str)`](string-functions.html#function_char-length)

  Returns the length of the string
  *`str`*, measured in code points. A
  multibyte character counts as a single code point. This means
  that, for a string containing two 3-byte characters,
  [`LENGTH()`](string-functions.html#function_length) returns
  `6`, whereas
  [`CHAR_LENGTH()`](string-functions.html#function_char-length) returns
  `2`, as shown here:

  ```sql
  mysql> SET @dolphin:='海豚';
  Query OK, 0 rows affected (0.01 sec)

  mysql> SELECT LENGTH(@dolphin), CHAR_LENGTH(@dolphin);
  +------------------+-----------------------+
  | LENGTH(@dolphin) | CHAR_LENGTH(@dolphin) |
  +------------------+-----------------------+
  |                6 |                     2 |
  +------------------+-----------------------+
  1 row in set (0.00 sec)
  ```

* [`CHARACTER_LENGTH(str)`](string-functions.html#function_character-length)

  [`CHARACTER_LENGTH()`](string-functions.html#function_character-length) is a synonym
  for [`CHAR_LENGTH()`](string-functions.html#function_char-length).

* [`CONCAT(str1,str2,...)`](string-functions.html#function_concat)

  Returns the string that results from concatenating the
  arguments. May have one or more arguments. If all arguments
  are nonbinary strings, the result is a nonbinary string. If
  the arguments include any binary strings, the result is a
  binary string. A numeric argument is converted to its
  equivalent nonbinary string form.

  [`CONCAT()`](string-functions.html#function_concat) returns
  `NULL` if any argument is
  `NULL`.

  ```sql
  mysql> SELECT CONCAT('My', 'S', 'QL');
          -> 'MySQL'
  mysql> SELECT CONCAT('My', NULL, 'QL');
          -> NULL
  mysql> SELECT CONCAT(14.3);
          -> '14.3'
  ```

  For quoted strings, concatenation can be performed by placing
  the strings next to each other:

  ```sql
  mysql> SELECT 'My' 'S' 'QL';
          -> 'MySQL'
  ```

  If [`CONCAT()`](string-functions.html#function_concat) is invoked from
  within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary string
  results display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`CONCAT_WS(separator,str1,str2,...)`](string-functions.html#function_concat-ws)

  [`CONCAT_WS()`](string-functions.html#function_concat-ws) stands for
  Concatenate With Separator and is a special form of
  [`CONCAT()`](string-functions.html#function_concat). The first argument is
  the separator for the rest of the arguments. The separator is
  added between the strings to be concatenated. The separator
  can be a string, as can the rest of the arguments. If the
  separator is `NULL`, the result is
  `NULL`.

  ```sql
  mysql> SELECT CONCAT_WS(',', 'First name', 'Second name', 'Last Name');
          -> 'First name,Second name,Last Name'
  mysql> SELECT CONCAT_WS(',', 'First name', NULL, 'Last Name');
          -> 'First name,Last Name'
  ```

  [`CONCAT_WS()`](string-functions.html#function_concat-ws) does not skip empty
  strings. However, it does skip any `NULL`
  values after the separator argument.

* [`ELT(N,str1,str2,str3,...)`](string-functions.html#function_elt)

  [`ELT()`](string-functions.html#function_elt) returns the
  *`N`*th element of the list of strings:
  *`str1`* if
  *`N`* = `1`,
  *`str2`* if
  *`N`* = `2`, and so
  on. Returns `NULL` if
  *`N`* is less than `1`
  or greater than the number of arguments.
  [`ELT()`](string-functions.html#function_elt) is the complement of
  [`FIELD()`](string-functions.html#function_field).

  ```sql
  mysql> SELECT ELT(1, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Aa'
  mysql> SELECT ELT(4, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Dd'
  ```

* [`EXPORT_SET(bits,on,off[,separator[,number_of_bits]])`](string-functions.html#function_export-set)

  Returns a string such that for every bit set in the value
  *`bits`*, you get an
  *`on`* string and for every bit not set
  in the value, you get an *`off`*
  string. Bits in *`bits`* are examined
  from right to left (from low-order to high-order bits).
  Strings are added to the result from left to right, separated
  by the *`separator`* string (the
  default being the comma character `,`). The
  number of bits examined is given by
  *`number_of_bits`*, which has a default
  of 64 if not specified.
  *`number_of_bits`* is silently clipped
  to 64 if larger than 64. It is treated as an unsigned integer,
  so a value of −1 is effectively the same as 64.

  ```sql
  mysql> SELECT EXPORT_SET(5,'Y','N',',',4);
          -> 'Y,N,Y,N'
  mysql> SELECT EXPORT_SET(6,'1','0',',',10);
          -> '0,1,1,0,0,0,0,0,0,0'
  ```

* [`FIELD(str,str1,str2,str3,...)`](string-functions.html#function_field)

  Returns the index (position) of *`str`*
  in the *`str1`*,
  *`str2`*,
  *`str3`*, `...` list.
  Returns `0` if *`str`*
  is not found.

  If all arguments to [`FIELD()`](string-functions.html#function_field) are
  strings, all arguments are compared as strings. If all
  arguments are numbers, they are compared as numbers.
  Otherwise, the arguments are compared as double.

  If *`str`* is `NULL`,
  the return value is `0` because
  `NULL` fails equality comparison with any
  value. [`FIELD()`](string-functions.html#function_field) is the
  complement of [`ELT()`](string-functions.html#function_elt).

  ```sql
  mysql> SELECT FIELD('Bb', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 2
  mysql> SELECT FIELD('Gg', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 0
  ```

* [`FIND_IN_SET(str,strlist)`](string-functions.html#function_find-in-set)

  Returns a value in the range of 1 to
  *`N`* if the string
  *`str`* is in the string list
  *`strlist`* consisting of
  *`N`* substrings. A string list is a
  string composed of substrings separated by
  `,` characters. If the first argument is a
  constant string and the second is a column of type
  [`SET`](set.html "11.3.6 The SET Type"), the
  [`FIND_IN_SET()`](string-functions.html#function_find-in-set) function is
  optimized to use bit arithmetic. Returns `0`
  if *`str`* is not in
  *`strlist`* or if
  *`strlist`* is the empty string.
  Returns `NULL` if either argument is
  `NULL`. This function does not work properly
  if the first argument contains a comma (`,`)
  character.

  ```sql
  mysql> SELECT FIND_IN_SET('b','a,b,c,d');
          -> 2
  ```

* [`FORMAT(X,D[,locale])`](string-functions.html#function_format)

  Formats the number *`X`* to a format
  like `'#,###,###.##'`, rounded to
  *`D`* decimal places, and returns the
  result as a string. If *`D`* is
  `0`, the result has no decimal point or
  fractional part.

  The optional third parameter enables a locale to be specified
  to be used for the result number's decimal point, thousands
  separator, and grouping between separators. Permissible locale
  values are the same as the legal values for the
  [`lc_time_names`](server-system-variables.html#sysvar_lc_time_names) system variable
  (see [Section 10.16, “MySQL Server Locale Support”](locale-support.html "10.16 MySQL Server Locale Support")). If no locale is
  specified, the default is `'en_US'`.

  ```sql
  mysql> SELECT FORMAT(12332.123456, 4);
          -> '12,332.1235'
  mysql> SELECT FORMAT(12332.1,4);
          -> '12,332.1000'
  mysql> SELECT FORMAT(12332.2,0);
          -> '12,332'
  mysql> SELECT FORMAT(12332.2,2,'de_DE');
          -> '12.332,20'
  ```

* [`FROM_BASE64(str)`](string-functions.html#function_from-base64)

  Takes a string encoded with the base-64 encoded rules used by
  [`TO_BASE64()`](string-functions.html#function_to-base64) and returns the
  decoded result as a binary string. The result is
  `NULL` if the argument is
  `NULL` or not a valid base-64 string. See the
  description of [`TO_BASE64()`](string-functions.html#function_to-base64) for
  details about the encoding and decoding rules.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  If [`FROM_BASE64()`](string-functions.html#function_from-base64) is invoked
  from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary
  strings display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`HEX(str)`](string-functions.html#function_hex),
  [`HEX(N)`](string-functions.html#function_hex)

  For a string argument *`str`*,
  [`HEX()`](string-functions.html#function_hex) returns a hexadecimal
  string representation of *`str`* where
  each byte of each character in *`str`*
  is converted to two hexadecimal digits. (Multibyte characters
  therefore become more than two digits.) The inverse of this
  operation is performed by the
  [`UNHEX()`](string-functions.html#function_unhex) function.

  For a numeric argument *`N`*,
  [`HEX()`](string-functions.html#function_hex) returns a hexadecimal
  string representation of the value of
  *`N`* treated as a longlong
  ([`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number. This is
  equivalent to
  [`CONV(N,10,16)`](mathematical-functions.html#function_conv).
  The inverse of this operation is performed by
  [`CONV(HEX(N),16,10)`](mathematical-functions.html#function_conv).

  ```sql
  mysql> SELECT X'616263', HEX('abc'), UNHEX(HEX('abc'));
          -> 'abc', 616263, 'abc'
  mysql> SELECT HEX(255), CONV(HEX(255),16,10);
          -> 'FF', 255
  ```

* [`INSERT(str,pos,len,newstr)`](string-functions.html#function_insert)

  Returns the string *`str`*, with the
  substring beginning at position *`pos`*
  and *`len`* characters long replaced by
  the string *`newstr`*. Returns the
  original string if *`pos`* is not
  within the length of the string. Replaces the rest of the
  string from position *`pos`* if
  *`len`* is not within the length of the
  rest of the string. Returns `NULL` if any
  argument is `NULL`.

  ```sql
  mysql> SELECT INSERT('Quadratic', 3, 4, 'What');
          -> 'QuWhattic'
  mysql> SELECT INSERT('Quadratic', -1, 4, 'What');
          -> 'Quadratic'
  mysql> SELECT INSERT('Quadratic', 3, 100, 'What');
          -> 'QuWhat'
  ```

  This function is multibyte safe.

* [`INSTR(str,substr)`](string-functions.html#function_instr)

  Returns the position of the first occurrence of substring
  *`substr`* in string
  *`str`*. This is the same as the
  two-argument form of [`LOCATE()`](string-functions.html#function_locate),
  except that the order of the arguments is reversed.

  ```sql
  mysql> SELECT INSTR('foobarbar', 'bar');
          -> 4
  mysql> SELECT INSTR('xbar', 'foobar');
          -> 0
  ```

  This function is multibyte safe, and is case-sensitive only if
  at least one argument is a binary string.

* [`LCASE(str)`](string-functions.html#function_lcase)

  [`LCASE()`](string-functions.html#function_lcase) is a synonym for
  [`LOWER()`](string-functions.html#function_lower).

  `LCASE()` used in a view is rewritten as
  `LOWER()` when storing the view's
  definition. (Bug #12844279)

* [`LEFT(str,len)`](string-functions.html#function_left)

  Returns the leftmost *`len`* characters
  from the string *`str`*, or
  `NULL` if any argument is
  `NULL`.

  ```sql
  mysql> SELECT LEFT('foobarbar', 5);
          -> 'fooba'
  ```

  This function is multibyte safe.

* [`LENGTH(str)`](string-functions.html#function_length)

  Returns the length of the string
  *`str`*, measured in bytes. A multibyte
  character counts as multiple bytes. This means that for a
  string containing five 2-byte characters,
  [`LENGTH()`](string-functions.html#function_length) returns
  `10`, whereas
  [`CHAR_LENGTH()`](string-functions.html#function_char-length) returns
  `5`.

  ```sql
  mysql> SELECT LENGTH('text');
          -> 4
  ```

  Note

  The `Length()` OpenGIS spatial function is
  named [`ST_Length()`](gis-linestring-property-functions.html#function_st-length) in MySQL.

* [`LOAD_FILE(file_name)`](string-functions.html#function_load-file)

  Reads the file and returns the file contents as a string. To
  use this function, the file must be located on the server
  host, you must specify the full path name to the file, and you
  must have the [`FILE`](privileges-provided.html#priv_file) privilege.
  The file must be readable by all and its size less than
  [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) bytes. If
  the [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) system
  variable is set to a nonempty directory name, the file to be
  loaded must be located in that directory.

  If the file does not exist or cannot be read because one of
  the preceding conditions is not satisfied, the function
  returns `NULL`.

  The [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem)
  system variable controls interpretation of file names that are
  given as literal strings.

  ```sql
  mysql> UPDATE t
              SET blob_col=LOAD_FILE('/tmp/picture')
              WHERE id=1;
  ```

* [`LOCATE(substr,str)`](string-functions.html#function_locate),
  [`LOCATE(substr,str,pos)`](string-functions.html#function_locate)

  The first syntax returns the position of the first occurrence
  of substring *`substr`* in string
  *`str`*. The second syntax returns the
  position of the first occurrence of substring
  *`substr`* in string
  *`str`*, starting at position
  *`pos`*. Returns `0`
  if *`substr`* is not in
  *`str`*. Returns
  `NULL` if *`substr`*
  or *`str`* is `NULL`.

  ```sql
  mysql> SELECT LOCATE('bar', 'foobarbar');
          -> 4
  mysql> SELECT LOCATE('xbar', 'foobar');
          -> 0
  mysql> SELECT LOCATE('bar', 'foobarbar', 5);
          -> 7
  ```

  This function is multibyte safe, and is case-sensitive only if
  at least one argument is a binary string.

* [`LOWER(str)`](string-functions.html#function_lower)

  Returns the string *`str`* with all
  characters changed to lowercase according to the current
  character set mapping. The default is
  `latin1` (cp1252 West European).

  ```sql
  mysql> SELECT LOWER('QUADRATICALLY');
          -> 'quadratically'
  ```

  [`LOWER()`](string-functions.html#function_lower) (and
  [`UPPER()`](string-functions.html#function_upper)) are ineffective when
  applied to binary strings
  ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
  [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). To perform lettercase
  conversion of a binary string, first convert it to a nonbinary
  string using a character set appropriate for the data stored
  in the string:

  ```sql
  mysql> SET @str = BINARY 'New York';
  mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
  +-------------+-----------------------------------+
  | LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
  +-------------+-----------------------------------+
  | New York    | new york                          |
  +-------------+-----------------------------------+
  ```

  For collations of Unicode character sets,
  [`LOWER()`](string-functions.html#function_lower) and
  [`UPPER()`](string-functions.html#function_upper) work according to the
  Unicode Collation Algorithm (UCA) version in the collation
  name, if there is one, and UCA 4.0.0 if no version is
  specified. For example, `utf8_unicode_520_ci`
  works according to UCA 5.2.0, whereas
  `utf8_unicode_ci` works according to UCA
  4.0.0. See [Section 10.10.1, “Unicode Character Sets”](charset-unicode-sets.html "10.10.1 Unicode Character Sets").

  This function is multibyte safe.

  In previous versions of MySQL, `LOWER()` used
  within a view was rewritten as
  [`LCASE()`](string-functions.html#function_lcase) when storing the
  view's definition. In MySQL 5.7,
  `LOWER()` is never rewritten in such cases,
  but `LCASE()` used within views is instead
  rewritten as `LOWER()`. (Bug #12844279)

* [`LPAD(str,len,padstr)`](string-functions.html#function_lpad)

  Returns the string *`str`*, left-padded
  with the string *`padstr`* to a length
  of *`len`* characters. If
  *`str`* is longer than
  *`len`*, the return value is shortened
  to *`len`* characters.

  ```sql
  mysql> SELECT LPAD('hi',4,'??');
          -> '??hi'
  mysql> SELECT LPAD('hi',1,'??');
          -> 'h'
  ```

* [`LTRIM(str)`](string-functions.html#function_ltrim)

  Returns the string *`str`* with leading
  space characters removed.

  ```sql
  mysql> SELECT LTRIM('  barbar');
          -> 'barbar'
  ```

  This function is multibyte safe.

* [`MAKE_SET(bits,str1,str2,...)`](string-functions.html#function_make-set)

  Returns a set value (a string containing substrings separated
  by `,` characters) consisting of the strings
  that have the corresponding bit in
  *`bits`* set.
  *`str1`* corresponds to bit 0,
  *`str2`* to bit 1, and so on.
  `NULL` values in
  *`str1`*,
  *`str2`*, `...` are
  not appended to the result.

  ```sql
  mysql> SELECT MAKE_SET(1,'a','b','c');
          -> 'a'
  mysql> SELECT MAKE_SET(1 | 4,'hello','nice','world');
          -> 'hello,world'
  mysql> SELECT MAKE_SET(1 | 4,'hello','nice',NULL,'world');
          -> 'hello'
  mysql> SELECT MAKE_SET(0,'a','b','c');
          -> ''
  ```

* [`MID(str,pos)`](string-functions.html#function_mid),
  [`MID(str FROM
  pos)`](string-functions.html#function_mid),
  [`MID(str,pos,len)`](string-functions.html#function_mid),
  [`MID(str FROM
  pos FOR
  len)`](string-functions.html#function_mid)

  [`MID(str,pos,len)`](string-functions.html#function_mid)
  is a synonym for
  [`SUBSTRING(str,pos,len)`](string-functions.html#function_substring).

* [`OCT(N)`](string-functions.html#function_oct)

  Returns a string representation of the octal value of
  *`N`*, where
  *`N`* is a longlong
  ([`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number. This is
  equivalent to
  [`CONV(N,10,8)`](mathematical-functions.html#function_conv).
  Returns `NULL` if
  *`N`* is `NULL`.

  ```sql
  mysql> SELECT OCT(12);
          -> '14'
  ```

* [`OCTET_LENGTH(str)`](string-functions.html#function_octet-length)

  [`OCTET_LENGTH()`](string-functions.html#function_octet-length) is a synonym for
  [`LENGTH()`](string-functions.html#function_length).

* [`ORD(str)`](string-functions.html#function_ord)

  If the leftmost character of the string
  *`str`* is a multibyte character,
  returns the code for that character, calculated from the
  numeric values of its constituent bytes using this formula:

  ```sql
    (1st byte code)
  + (2nd byte code * 256)
  + (3rd byte code * 256^2) ...
  ```

  If the leftmost character is not a multibyte character,
  [`ORD()`](string-functions.html#function_ord) returns the same value as
  the [`ASCII()`](string-functions.html#function_ascii) function.

  ```sql
  mysql> SELECT ORD('2');
          -> 50
  ```

* [`POSITION(substr
  IN str)`](string-functions.html#function_position)

  [`POSITION(substr
  IN str)`](string-functions.html#function_position) is a synonym for
  [`LOCATE(substr,str)`](string-functions.html#function_locate).

* [`QUOTE(str)`](string-functions.html#function_quote)

  Quotes a string to produce a result that can be used as a
  properly escaped data value in an SQL statement. The string is
  returned enclosed by single quotation marks and with each
  instance of backslash (`\`), single quote
  (`'`), ASCII `NUL`, and
  Control+Z preceded by a backslash. If the argument is
  `NULL`, the return value is the word
  “NULL” without enclosing single quotation marks.

  ```sql
  mysql> SELECT QUOTE('Don\'t!');
          -> 'Don\'t!'
  mysql> SELECT QUOTE(NULL);
          -> NULL
  ```

  For comparison, see the quoting rules for literal strings and
  within the C API in [Section 9.1.1, “String Literals”](string-literals.html "9.1.1 String Literals"), and
  [mysql\_real\_escape\_string\_quote()](/doc/c-api/5.7/en/mysql-real-escape-string-quote.html).

* [`REPEAT(str,count)`](string-functions.html#function_repeat)

  Returns a string consisting of the string
  *`str`* repeated
  *`count`* times. If
  *`count`* is less than 1, returns an
  empty string. Returns `NULL` if
  *`str`* or
  *`count`* are `NULL`.

  ```sql
  mysql> SELECT REPEAT('MySQL', 3);
          -> 'MySQLMySQLMySQL'
  ```

* [`REPLACE(str,from_str,to_str)`](string-functions.html#function_replace)

  Returns the string *`str`* with all
  occurrences of the string *`from_str`*
  replaced by the string *`to_str`*.
  [`REPLACE()`](string-functions.html#function_replace) performs a
  case-sensitive match when searching for
  *`from_str`*.

  ```sql
  mysql> SELECT REPLACE('www.mysql.com', 'w', 'Ww');
          -> 'WwWwWw.mysql.com'
  ```

  This function is multibyte safe.

* [`REVERSE(str)`](string-functions.html#function_reverse)

  Returns the string *`str`* with the
  order of the characters reversed.

  ```sql
  mysql> SELECT REVERSE('abc');
          -> 'cba'
  ```

  This function is multibyte safe.

* [`RIGHT(str,len)`](string-functions.html#function_right)

  Returns the rightmost *`len`*
  characters from the string *`str`*, or
  `NULL` if any argument is
  `NULL`.

  ```sql
  mysql> SELECT RIGHT('foobarbar', 4);
          -> 'rbar'
  ```

  This function is multibyte safe.

* [`RPAD(str,len,padstr)`](string-functions.html#function_rpad)

  Returns the string *`str`*,
  right-padded with the string *`padstr`*
  to a length of *`len`* characters. If
  *`str`* is longer than
  *`len`*, the return value is shortened
  to *`len`* characters.

  ```sql
  mysql> SELECT RPAD('hi',5,'?');
          -> 'hi???'
  mysql> SELECT RPAD('hi',1,'?');
          -> 'h'
  ```

  This function is multibyte safe.

* [`RTRIM(str)`](string-functions.html#function_rtrim)

  Returns the string *`str`* with
  trailing space characters removed.

  ```sql
  mysql> SELECT RTRIM('barbar   ');
          -> 'barbar'
  ```

  This function is multibyte safe.

* [`SOUNDEX(str)`](string-functions.html#function_soundex)

  Returns a soundex string from *`str`*.
  Two strings that sound almost the same should have identical
  soundex strings. A standard soundex string is four characters
  long, but the [`SOUNDEX()`](string-functions.html#function_soundex)
  function returns an arbitrarily long string. You can use
  [`SUBSTRING()`](string-functions.html#function_substring) on the result to
  get a standard soundex string. All nonalphabetic characters in
  *`str`* are ignored. All international
  alphabetic characters outside the A-Z range are treated as
  vowels.

  Important

  When using [`SOUNDEX()`](string-functions.html#function_soundex), you
  should be aware of the following limitations:

  + This function, as currently implemented, is intended to
    work well with strings that are in the English language
    only. Strings in other languages may not produce reliable
    results.

  + This function is not guaranteed to provide consistent
    results with strings that use multibyte character sets,
    including `utf-8`. See Bug #22638 for
    more information.

  ```sql
  mysql> SELECT SOUNDEX('Hello');
          -> 'H400'
  mysql> SELECT SOUNDEX('Quadratically');
          -> 'Q36324'
  ```

  Note

  This function implements the original Soundex algorithm, not
  the more popular enhanced version (also described by D.
  Knuth). The difference is that original version discards
  vowels first and duplicates second, whereas the enhanced
  version discards duplicates first and vowels second.

* [`expr1
  SOUNDS LIKE expr2`](string-functions.html#operator_sounds-like)

  This is the same as
  [`SOUNDEX(expr1)
  = SOUNDEX(expr2)`](string-functions.html#function_soundex).

* [`SPACE(N)`](string-functions.html#function_space)

  Returns a string consisting of *`N`*
  space characters.

  ```sql
  mysql> SELECT SPACE(6);
          -> '      '
  ```

* [`SUBSTR(str,pos)`](string-functions.html#function_substr),
  [`SUBSTR(str
  FROM pos)`](string-functions.html#function_substr),
  [`SUBSTR(str,pos,len)`](string-functions.html#function_substr),
  [`SUBSTR(str
  FROM pos FOR
  len)`](string-functions.html#function_substr)

  [`SUBSTR()`](string-functions.html#function_substr) is a synonym for
  [`SUBSTRING()`](string-functions.html#function_substring).

* [`SUBSTRING(str,pos)`](string-functions.html#function_substring),
  [`SUBSTRING(str
  FROM pos)`](string-functions.html#function_substring),
  [`SUBSTRING(str,pos,len)`](string-functions.html#function_substring),
  [`SUBSTRING(str
  FROM pos FOR
  len)`](string-functions.html#function_substring)

  The forms without a *`len`* argument
  return a substring from string *`str`*
  starting at position *`pos`*. The forms
  with a *`len`* argument return a
  substring *`len`* characters long from
  string *`str`*, starting at position
  *`pos`*. The forms that use
  `FROM` are standard SQL syntax. It is also
  possible to use a negative value for
  *`pos`*. In this case, the beginning of
  the substring is *`pos`* characters
  from the end of the string, rather than the beginning. A
  negative value may be used for *`pos`*
  in any of the forms of this function. A value of 0 for
  *`pos`* returns an empty string.

  For all forms of [`SUBSTRING()`](string-functions.html#function_substring),
  the position of the first character in the string from which
  the substring is to be extracted is reckoned as
  `1`.

  ```sql
  mysql> SELECT SUBSTRING('Quadratically',5);
          -> 'ratically'
  mysql> SELECT SUBSTRING('foobarbar' FROM 4);
          -> 'barbar'
  mysql> SELECT SUBSTRING('Quadratically',5,6);
          -> 'ratica'
  mysql> SELECT SUBSTRING('Sakila', -3);
          -> 'ila'
  mysql> SELECT SUBSTRING('Sakila', -5, 3);
          -> 'aki'
  mysql> SELECT SUBSTRING('Sakila' FROM -4 FOR 2);
          -> 'ki'
  ```

  This function is multibyte safe.

  If *`len`* is less than 1, the result
  is the empty string.

* [`SUBSTRING_INDEX(str,delim,count)`](string-functions.html#function_substring-index)

  Returns the substring from string
  *`str`* before
  *`count`* occurrences of the delimiter
  *`delim`*. If
  *`count`* is positive, everything to
  the left of the final delimiter (counting from the left) is
  returned. If *`count`* is negative,
  everything to the right of the final delimiter (counting from
  the right) is returned.
  [`SUBSTRING_INDEX()`](string-functions.html#function_substring-index) performs a
  case-sensitive match when searching for
  *`delim`*.

  ```sql
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
          -> 'www.mysql'
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
          -> 'mysql.com'
  ```

  This function is multibyte safe.

* [`TO_BASE64(str)`](string-functions.html#function_to-base64)

  Converts the string argument to base-64 encoded form and
  returns the result as a character string with the connection
  character set and collation. If the argument is not a string,
  it is converted to a string before conversion takes place. The
  result is `NULL` if the argument is
  `NULL`. Base-64 encoded strings can be
  decoded using the [`FROM_BASE64()`](string-functions.html#function_from-base64)
  function.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  Different base-64 encoding schemes exist. These are the
  encoding and decoding rules used by
  [`TO_BASE64()`](string-functions.html#function_to-base64) and
  [`FROM_BASE64()`](string-functions.html#function_from-base64):

  + The encoding for alphabet value 62 is
    `'+'`.

  + The encoding for alphabet value 63 is
    `'/'`.

  + Encoded output consists of groups of 4 printable
    characters. Each 3 bytes of the input data are encoded
    using 4 characters. If the last group is incomplete, it is
    padded with `'='` characters to a length
    of 4.

  + A newline is added after each 76 characters of encoded
    output to divide long output into multiple lines.

  + Decoding recognizes and ignores newline, carriage return,
    tab, and space.

* [`TRIM([{BOTH | LEADING | TRAILING}
  [remstr] FROM]
  str)`](string-functions.html#function_trim),
  [`TRIM([remstr
  FROM] str)`](string-functions.html#function_trim)

  Returns the string *`str`* with all
  *`remstr`* prefixes or suffixes
  removed. If none of the specifiers `BOTH`,
  `LEADING`, or `TRAILING` is
  given, `BOTH` is assumed.
  *`remstr`* is optional and, if not
  specified, spaces are removed.

  ```sql
  mysql> SELECT TRIM('  bar   ');
          -> 'bar'
  mysql> SELECT TRIM(LEADING 'x' FROM 'xxxbarxxx');
          -> 'barxxx'
  mysql> SELECT TRIM(BOTH 'x' FROM 'xxxbarxxx');
          -> 'bar'
  mysql> SELECT TRIM(TRAILING 'xyz' FROM 'barxxyz');
          -> 'barx'
  ```

  This function is multibyte safe.

* [`UCASE(str)`](string-functions.html#function_ucase)

  [`UCASE()`](string-functions.html#function_ucase) is a synonym for
  [`UPPER()`](string-functions.html#function_upper).

  In MySQL 5.7, `UCASE()` used in
  a view is rewritten as `UPPER()` when storing
  the view's definition. (Bug #12844279)

* [`UNHEX(str)`](string-functions.html#function_unhex)

  For a string argument *`str`*,
  [`UNHEX(str)`](string-functions.html#function_unhex)
  interprets each pair of characters in the argument as a
  hexadecimal number and converts it to the byte represented by
  the number. The return value is a binary string.

  ```sql
  mysql> SELECT UNHEX('4D7953514C');
          -> 'MySQL'
  mysql> SELECT X'4D7953514C';
          -> 'MySQL'
  mysql> SELECT UNHEX(HEX('string'));
          -> 'string'
  mysql> SELECT HEX(UNHEX('1267'));
          -> '1267'
  ```

  The characters in the argument string must be legal
  hexadecimal digits: `'0'` ..
  `'9'`, `'A'` ..
  `'F'`, `'a'` ..
  `'f'`. If the argument contains any
  nonhexadecimal digits, the result is `NULL`:

  ```sql
  mysql> SELECT UNHEX('GG');
  +-------------+
  | UNHEX('GG') |
  +-------------+
  | NULL        |
  +-------------+
  ```

  A `NULL` result can occur if the argument to
  [`UNHEX()`](string-functions.html#function_unhex) is a
  [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") column, because values
  are padded with `0x00` bytes when stored but
  those bytes are not stripped on retrieval. For example,
  `'41'` is stored into a
  `CHAR(3)` column as
  `'41 '` and retrieved as
  `'41'` (with the trailing pad space
  stripped), so [`UNHEX()`](string-functions.html#function_unhex) for the
  column value returns `X'41'`. By contrast,
  `'41'` is stored into a
  `BINARY(3)` column as
  `'41\0'` and retrieved as
  `'41\0'` (with the trailing pad
  `0x00` byte not stripped).
  `'\0'` is not a legal hexadecimal digit, so
  [`UNHEX()`](string-functions.html#function_unhex) for the column value
  returns `NULL`.

  For a numeric argument *`N`*, the
  inverse of
  [`HEX(N)`](string-functions.html#function_hex)
  is not performed by [`UNHEX()`](string-functions.html#function_unhex).
  Use
  [`CONV(HEX(N),16,10)`](mathematical-functions.html#function_conv)
  instead. See the description of
  [`HEX()`](string-functions.html#function_hex).

  If [`UNHEX()`](string-functions.html#function_unhex) is invoked from
  within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary strings
  display using hexadecimal notation, depending on the value of
  the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more
  information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

* [`UPPER(str)`](string-functions.html#function_upper)

  Returns the string *`str`* with all
  characters changed to uppercase according to the current
  character set mapping. The default is
  `latin1` (cp1252 West European).

  ```sql
  mysql> SELECT UPPER('Hej');
          -> 'HEJ'
  ```

  See the description of [`LOWER()`](string-functions.html#function_lower)
  for information that also applies to
  [`UPPER()`](string-functions.html#function_upper). This included
  information about how to perform lettercase conversion of
  binary strings ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
  [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")) for which these functions
  are ineffective, and information about case folding for
  Unicode character sets.

  This function is multibyte safe.

  In previous versions of MySQL, `UPPER()` used
  within a view was rewritten as
  [`UCASE()`](string-functions.html#function_ucase) when storing the
  view's definition. In MySQL 5.7,
  `UPPER()` is never rewritten in such cases,
  but `UCASE()` used within views is instead
  rewritten as `UPPER()`. (Bug #12844279)

* [`WEIGHT_STRING(str
  [AS {CHAR|BINARY}(N)] [LEVEL
  levels]
  [flags])`](string-functions.html#function_weight-string)

  `levels:
  N [ASC|DESC|REVERSE] [,
  N [ASC|DESC|REVERSE]] ...`

  This function returns the weight string for the input string.
  The return value is a binary string that represents the
  comparison and sorting value of the string. It has these
  properties:

  + If
    [`WEIGHT_STRING(str1)`](string-functions.html#function_weight-string)
    =
    [`WEIGHT_STRING(str2)`](string-functions.html#function_weight-string),
    then `str1 =
    str2`
    (*`str1`* and
    *`str2`* are considered equal)

  + If
    [`WEIGHT_STRING(str1)`](string-functions.html#function_weight-string)
    <
    [`WEIGHT_STRING(str2)`](string-functions.html#function_weight-string),
    then `str1 <
    str2`
    (*`str1`* sorts before
    *`str2`*)

  [`WEIGHT_STRING()`](string-functions.html#function_weight-string) is a debugging
  function intended for internal use. Its behavior can change
  without notice between MySQL versions. It can be used for
  testing and debugging of collations, especially if you are
  adding a new collation. See
  [Section 10.14, “Adding a Collation to a Character Set”](adding-collation.html "10.14 Adding a Collation to a Character Set").

  This list briefly summarizes the arguments. More details are
  given in the discussion following the list.

  + *`str`*: The input string
    expression.

  + `AS` clause: Optional; cast the input
    string to a given type and length.

  + `LEVEL` clause: Optional; specify weight
    levels for the return value.

  + *`flags`*: Optional; unused.

  The input string, *`str`*, is a string
  expression. If the input is a nonbinary (character) string
  such as a [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
  [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), or
  [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") value, the return value
  contains the collation weights for the string. If the input is
  a binary (byte) string such as a
  [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
  [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), or
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") value, the return value is
  the same as the input (the weight for each byte in a binary
  string is the byte value). If the input is
  `NULL`,
  [`WEIGHT_STRING()`](string-functions.html#function_weight-string) returns
  `NULL`.

  Examples:

  ```sql
  mysql> SET @s = _latin1 'AB' COLLATE latin1_swedish_ci;
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | AB   | 4142    | 4142                   |
  +------+---------+------------------------+
  ```

  ```sql
  mysql> SET @s = _latin1 'ab' COLLATE latin1_swedish_ci;
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | ab   | 6162    | 4142                   |
  +------+---------+------------------------+
  ```

  ```sql
  mysql> SET @s = CAST('AB' AS BINARY);
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | AB   | 4142    | 4142                   |
  +------+---------+------------------------+
  ```

  ```sql
  mysql> SET @s = CAST('ab' AS BINARY);
  mysql> SELECT @s, HEX(@s), HEX(WEIGHT_STRING(@s));
  +------+---------+------------------------+
  | @s   | HEX(@s) | HEX(WEIGHT_STRING(@s)) |
  +------+---------+------------------------+
  | ab   | 6162    | 6162                   |
  +------+---------+------------------------+
  ```

  The preceding examples use
  [`HEX()`](string-functions.html#function_hex) to display the
  [`WEIGHT_STRING()`](string-functions.html#function_weight-string) result. Because
  the result is a binary value,
  [`HEX()`](string-functions.html#function_hex) can be especially useful
  when the result contains nonprinting values, to display it in
  printable form:

  ```sql
  mysql> SET @s = CONVERT(X'C39F' USING utf8) COLLATE utf8_czech_ci;
  mysql> SELECT HEX(WEIGHT_STRING(@s));
  +------------------------+
  | HEX(WEIGHT_STRING(@s)) |
  +------------------------+
  | 0FEA0FEA               |
  +------------------------+
  ```

  For non-`NULL` return values, the data type
  of the value is [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") if
  its length is within the maximum length for
  [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), otherwise the data
  type is [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types").

  The `AS` clause may be given to cast the
  input string to a nonbinary or binary string and to force it
  to a given length:

  + `AS CHAR(N)`
    casts the string to a nonbinary string and pads it on the
    right with spaces to a length of
    *`N`* characters.
    *`N`* must be at least 1. If
    *`N`* is less than the length of
    the input string, the string is truncated to
    *`N`* characters. No warning occurs
    for truncation.

  + `AS BINARY(N)`
    is similar but casts the string to a binary string,
    *`N`* is measured in bytes (not
    characters), and padding uses `0x00`
    bytes (not spaces).

  ```sql
  mysql> SET NAMES 'latin1';
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS CHAR(4)));
  +-------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS CHAR(4))) |
  +-------------------------------------+
  | 41422020                            |
  +-------------------------------------+
  mysql> SET NAMES 'utf8';
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS CHAR(4)));
  +-------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS CHAR(4))) |
  +-------------------------------------+
  | 0041004200200020                    |
  +-------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING('ab' AS BINARY(4)));
  +---------------------------------------+
  | HEX(WEIGHT_STRING('ab' AS BINARY(4))) |
  +---------------------------------------+
  | 61620000                              |
  +---------------------------------------+
  ```

  The `LEVEL` clause may be given to specify
  that the return value should contain weights for specific
  collation levels.

  The *`levels`* specifier following the
  `LEVEL` keyword may be given either as a list
  of one or more integers separated by commas, or as a range of
  two integers separated by a dash. Whitespace around the
  punctuation characters does not matter.

  Examples:

  ```sql
  LEVEL 1
  LEVEL 2, 3, 5
  LEVEL 1-3
  ```

  Any level less than 1 is treated as 1. Any level greater than
  the maximum for the input string collation is treated as
  maximum for the collation. The maximum varies per collation,
  but is never greater than 6.

  In a list of levels, levels must be given in increasing order.
  In a range of levels, if the second number is less than the
  first, it is treated as the first number (for example, 4-2 is
  the same as 4-4).

  If the `LEVEL` clause is omitted, MySQL
  assumes `LEVEL 1 -
  max`, where
  *`max`* is the maximum level for the
  collation.

  If `LEVEL` is specified using list syntax
  (not range syntax), any level number can be followed by these
  modifiers:

  + `ASC`: Return the weights without
    modification. This is the default.

  + `DESC`: Return bitwise-inverted weights
    (for example, `0x78f0 DESC` =
    `0x870f`).

  + `REVERSE`: Return the weights in reverse
    order (that is,the weights for the reversed string, with
    the first character last and the last first).

  Examples:

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1));
  +--------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1)) |
  +--------------------------------------+
  | 007FFF                               |
  +--------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC));
  +-------------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC)) |
  +-------------------------------------------+
  | FF8000                                    |
  +-------------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1 REVERSE));
  +----------------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1 REVERSE)) |
  +----------------------------------------------+
  | FF7F00                                       |
  +----------------------------------------------+
  ```

  ```sql
  mysql> SELECT HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC REVERSE));
  +---------------------------------------------------+
  | HEX(WEIGHT_STRING(0x007fff LEVEL 1 DESC REVERSE)) |
  +---------------------------------------------------+
  | 0080FF                                            |
  +---------------------------------------------------+
  ```

  The *`flags`* clause currently is
  unused.

  If [`WEIGHT_STRING()`](string-functions.html#function_weight-string) is invoked
  from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary
  strings display using hexadecimal notation, depending on the
  value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex).
  For more information about that option, see
  [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").