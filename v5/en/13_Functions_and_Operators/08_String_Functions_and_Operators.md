## 12.8 String Functions and Operators

**Table 12.12 String Functions and Operators**

<table frame="box" rules="all" summary="A reference that lists string functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>ASCII()</code></td> <td> Return numeric value of left-most character </td> </tr><tr><td><code>BIN()</code></td> <td> Return a string containing binary representation of a number </td> </tr><tr><td><code>BIT_LENGTH()</code></td> <td> Return length of argument in bits </td> </tr><tr><td><code>CHAR()</code></td> <td> Return the character for each integer passed </td> </tr><tr><td><code>CHAR_LENGTH()</code></td> <td> Return number of characters in argument </td> </tr><tr><td><code>CHARACTER_LENGTH()</code></td> <td> Synonym for CHAR_LENGTH() </td> </tr><tr><td><code>CONCAT()</code></td> <td> Return concatenated string </td> </tr><tr><td><code>CONCAT_WS()</code></td> <td> Return concatenate with separator </td> </tr><tr><td><code>ELT()</code></td> <td> Return string at index number </td> </tr><tr><td><code>EXPORT_SET()</code></td> <td> Return a string such that for every bit set in the value bits, you get an on string and for every unset bit, you get an off string </td> </tr><tr><td><code>FIELD()</code></td> <td> Index (position) of first argument in subsequent arguments </td> </tr><tr><td><code>FIND_IN_SET()</code></td> <td> Index (position) of first argument within second argument </td> </tr><tr><td><code>FORMAT()</code></td> <td> Return a number formatted to specified number of decimal places </td> </tr><tr><td><code>FROM_BASE64()</code></td> <td> Decode base64 encoded string and return result </td> </tr><tr><td><code>HEX()</code></td> <td> Hexadecimal representation of decimal or string value </td> </tr><tr><td><code>INSERT()</code></td> <td> Insert substring at specified position up to specified number of characters </td> </tr><tr><td><code>INSTR()</code></td> <td> Return the index of the first occurrence of substring </td> </tr><tr><td><code>LCASE()</code></td> <td> Synonym for LOWER() </td> </tr><tr><td><code>LEFT()</code></td> <td> Return the leftmost number of characters as specified </td> </tr><tr><td><code>LENGTH()</code></td> <td> Return the length of a string in bytes </td> </tr><tr><td><code>LIKE</code></td> <td> Simple pattern matching </td> </tr><tr><td><code>LOAD_FILE()</code></td> <td> Load the named file </td> </tr><tr><td><code>LOCATE()</code></td> <td> Return the position of the first occurrence of substring </td> </tr><tr><td><code>LOWER()</code></td> <td> Return the argument in lowercase </td> </tr><tr><td><code>LPAD()</code></td> <td> Return the string argument, left-padded with the specified string </td> </tr><tr><td><code>LTRIM()</code></td> <td> Remove leading spaces </td> </tr><tr><td><code>MAKE_SET()</code></td> <td> Return a set of comma-separated strings that have the corresponding bit in bits set </td> </tr><tr><td><code>MATCH()</code></td> <td> Perform full-text search </td> </tr><tr><td><code>MID()</code></td> <td> Return a substring starting from the specified position </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negation of simple pattern matching </td> </tr><tr><td><code>NOT REGEXP</code></td> <td> Negation of REGEXP </td> </tr><tr><td><code>OCT()</code></td> <td> Return a string containing octal representation of a number </td> </tr><tr><td><code>OCTET_LENGTH()</code></td> <td> Synonym for LENGTH() </td> </tr><tr><td><code>ORD()</code></td> <td> Return character code for leftmost character of the argument </td> </tr><tr><td><code>POSITION()</code></td> <td> Synonym for LOCATE() </td> </tr><tr><td><code>QUOTE()</code></td> <td> Escape the argument for use in an SQL statement </td> </tr><tr><td><code>REGEXP</code></td> <td> Whether string matches regular expression </td> </tr><tr><td><code>REPEAT()</code></td> <td> Repeat a string the specified number of times </td> </tr><tr><td><code>REPLACE()</code></td> <td> Replace occurrences of a specified string </td> </tr><tr><td><code>REVERSE()</code></td> <td> Reverse the characters in a string </td> </tr><tr><td><code>RIGHT()</code></td> <td> Return the specified rightmost number of characters </td> </tr><tr><td><code>RLIKE</code></td> <td> Whether string matches regular expression </td> </tr><tr><td><code>RPAD()</code></td> <td> Append string the specified number of times </td> </tr><tr><td><code>RTRIM()</code></td> <td> Remove trailing spaces </td> </tr><tr><td><code>SOUNDEX()</code></td> <td> Return a soundex string </td> </tr><tr><td><code>SOUNDS LIKE</code></td> <td> Compare sounds </td> </tr><tr><td><code>SPACE()</code></td> <td> Return a string of the specified number of spaces </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compare two strings </td> </tr><tr><td><code>SUBSTR()</code></td> <td> Return the substring as specified </td> </tr><tr><td><code>SUBSTRING()</code></td> <td> Return the substring as specified </td> </tr><tr><td><code>SUBSTRING_INDEX()</code></td> <td> Return a substring from a string before the specified number of occurrences of the delimiter </td> </tr><tr><td><code>TO_BASE64()</code></td> <td> Return the argument converted to a base-64 string </td> </tr><tr><td><code>TRIM()</code></td> <td> Remove leading and trailing spaces </td> </tr><tr><td><code>UCASE()</code></td> <td> Synonym for UPPER() </td> </tr><tr><td><code>UNHEX()</code></td> <td> Return a string containing hex representation of a number </td> </tr><tr><td><code>UPPER()</code></td> <td> Convert to uppercase </td> </tr><tr><td><code>WEIGHT_STRING()</code></td> <td> Return the weight string for a string </td> </tr></tbody></table>

String-valued functions return `NULL` if the length of the result would be greater than the value of the `max_allowed_packet` system variable. See Section 5.1.1, “Configuring the Server”.

For functions that operate on string positions, the first position is numbered 1.

For functions that take length arguments, noninteger arguments are rounded to the nearest integer.

* `ASCII(str)`

  Returns the numeric value of the leftmost character of the string *`str`*. Returns `0` if *`str`* is the empty string. Returns `NULL` if *`str`* is `NULL`. `ASCII()` works for 8-bit characters.

  ```sql
  mysql> SELECT ASCII('2');
          -> 50
  mysql> SELECT ASCII(2);
          -> 50
  mysql> SELECT ASCII('dx');
          -> 100
  ```

  See also the `ORD()` function.

* `BIN(N)`

  Returns a string representation of the binary value of *`N`*, where *`N`* is a longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number. This is equivalent to `CONV(N,10,2)`. Returns `NULL` if *`N`* is `NULL`.

  ```sql
  mysql> SELECT BIN(12);
          -> '1100'
  ```

* `BIT_LENGTH(str)`

  Returns the length of the string *`str`* in bits.

  ```sql
  mysql> SELECT BIT_LENGTH('text');
          -> 32
  ```

* [`CHAR(N,... [USING charset_name])`](string-functions.html#function_char)

  `CHAR()` interprets each argument *`N`* as an integer and returns a string consisting of the characters given by the code values of those integers. `NULL` values are skipped.

  ```sql
  mysql> SELECT CHAR(77,121,83,81,'76');
          -> 'MySQL'
  mysql> SELECT CHAR(77,77.3,'77.3');
          -> 'MMM'
  ```

  `CHAR()` arguments larger than 255 are converted into multiple result bytes. For example, `CHAR(256)` is equivalent to `CHAR(1,0)`, and `CHAR(256*256)` is equivalent to `CHAR(1,0,0)`:

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

  By default, `CHAR()` returns a binary string. To produce a string in a given character set, use the optional `USING` clause:

  ```sql
  mysql> SELECT CHARSET(CHAR(X'65')), CHARSET(CHAR(X'65' USING utf8));
  +----------------------+---------------------------------+
  | CHARSET(CHAR(X'65')) | CHARSET(CHAR(X'65' USING utf8)) |
  +----------------------+---------------------------------+
  | binary               | utf8                            |
  +----------------------+---------------------------------+
  ```

  If `USING` is given and the result string is illegal for the given character set, a warning is issued. Also, if strict SQL mode is enabled, the result from `CHAR()` becomes `NULL`.

  If `CHAR()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* `CHAR_LENGTH(str)`

  Returns the length of the string *`str`*, measured in code points. A multibyte character counts as a single code point. This means that, for a string containing two 3-byte characters, `LENGTH()` returns `6`, whereas `CHAR_LENGTH()` returns `2`, as shown here:

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

* `CHARACTER_LENGTH(str)`

  `CHARACTER_LENGTH()` is a synonym for `CHAR_LENGTH()`.

* `CONCAT(str1,str2,...)`

  Returns the string that results from concatenating the arguments. May have one or more arguments. If all arguments are nonbinary strings, the result is a nonbinary string. If the arguments include any binary strings, the result is a binary string. A numeric argument is converted to its equivalent nonbinary string form.

  `CONCAT()` returns `NULL` if any argument is `NULL`.

  ```sql
  mysql> SELECT CONCAT('My', 'S', 'QL');
          -> 'MySQL'
  mysql> SELECT CONCAT('My', NULL, 'QL');
          -> NULL
  mysql> SELECT CONCAT(14.3);
          -> '14.3'
  ```

  For quoted strings, concatenation can be performed by placing the strings next to each other:

  ```sql
  mysql> SELECT 'My' 'S' 'QL';
          -> 'MySQL'
  ```

  If `CONCAT()` is invoked from within the **mysql** client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* `CONCAT_WS(separator,str1,str2,...)`

  `CONCAT_WS()` stands for Concatenate With Separator and is a special form of `CONCAT()`. The first argument is the separator for the rest of the arguments. The separator is added between the strings to be concatenated. The separator can be a string, as can the rest of the arguments. If the separator is `NULL`, the result is `NULL`.

  ```sql
  mysql> SELECT CONCAT_WS(',', 'First name', 'Second name', 'Last Name');
          -> 'First name,Second name,Last Name'
  mysql> SELECT CONCAT_WS(',', 'First name', NULL, 'Last Name');
          -> 'First name,Last Name'
  ```

  `CONCAT_WS()` does not skip empty strings. However, it does skip any `NULL` values after the separator argument.

* `ELT(N,str1,str2,str3,...)`

  `ELT()` returns the *`N`*th element of the list of strings: *`str1`* if *`N`* = `1`, *`str2`* if *`N`* = `2`, and so on. Returns `NULL` if *`N`* is less than `1` or greater than the number of arguments. `ELT()` is the complement of `FIELD()`.

  ```sql
  mysql> SELECT ELT(1, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Aa'
  mysql> SELECT ELT(4, 'Aa', 'Bb', 'Cc', 'Dd');
          -> 'Dd'
  ```

* [`EXPORT_SET(bits,on,off[,separator[,number_of_bits]])`](string-functions.html#function_export-set)

  Returns a string such that for every bit set in the value *`bits`*, you get an *`on`* string and for every bit not set in the value, you get an *`off`* string. Bits in *`bits`* are examined from right to left (from low-order to high-order bits). Strings are added to the result from left to right, separated by the *`separator`* string (the default being the comma character `,`). The number of bits examined is given by *`number_of_bits`*, which has a default of 64 if not specified. *`number_of_bits`* is silently clipped to 64 if larger than 64. It is treated as an unsigned integer, so a value of −1 is effectively the same as 64.

  ```sql
  mysql> SELECT EXPORT_SET(5,'Y','N',',',4);
          -> 'Y,N,Y,N'
  mysql> SELECT EXPORT_SET(6,'1','0',',',10);
          -> '0,1,1,0,0,0,0,0,0,0'
  ```

* `FIELD(str,str1,str2,str3,...)`

  Returns the index (position) of *`str`* in the *`str1`*, *`str2`*, *`str3`*, `...` list. Returns `0` if *`str`* is not found.

  If all arguments to `FIELD()` are strings, all arguments are compared as strings. If all arguments are numbers, they are compared as numbers. Otherwise, the arguments are compared as double.

  If *`str`* is `NULL`, the return value is `0` because `NULL` fails equality comparison with any value. `FIELD()` is the complement of `ELT()`.

  ```sql
  mysql> SELECT FIELD('Bb', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 2
  mysql> SELECT FIELD('Gg', 'Aa', 'Bb', 'Cc', 'Dd', 'Ff');
          -> 0
  ```

* `FIND_IN_SET(str,strlist)`

  Returns a value in the range of 1 to *`N`* if the string *`str`* is in the string list *`strlist`* consisting of *`N`* substrings. A string list is a string composed of substrings separated by `,` characters. If the first argument is a constant string and the second is a column of type `SET`, the `FIND_IN_SET()` function is optimized to use bit arithmetic. Returns `0` if *`str`* is not in *`strlist`* or if *`strlist`* is the empty string. Returns `NULL` if either argument is `NULL`. This function does not work properly if the first argument contains a comma (`,`) character.

  ```sql
  mysql> SELECT FIND_IN_SET('b','a,b,c,d');
          -> 2
  ```

* `FORMAT(X,D[,locale])`

  Formats the number *`X`* to a format like `'#,###,###.##'`, rounded to *`D`* decimal places, and returns the result as a string. If *`D`* is `0`, the result has no decimal point or fractional part.

  The optional third parameter enables a locale to be specified to be used for the result number's decimal point, thousands separator, and grouping between separators. Permissible locale values are the same as the legal values for the `lc_time_names` system variable (see Section 10.16, “MySQL Server Locale Support”). If no locale is specified, the default is `'en_US'`.

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

* `FROM_BASE64(str)`

  Takes a string encoded with the base-64 encoded rules used by `TO_BASE64()` and returns the decoded result as a binary string. The result is `NULL` if the argument is `NULL` or not a valid base-64 string. See the description of `TO_BASE64()` for details about the encoding and decoding rules.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  If `FROM_BASE64()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* `HEX(str)`, `HEX(N)`

  For a string argument *`str`*, `HEX()` returns a hexadecimal string representation of *`str`* where each byte of each character in *`str`* is converted to two hexadecimal digits. (Multibyte characters therefore become more than two digits.) The inverse of this operation is performed by the `UNHEX()` function.

  For a numeric argument *`N`*, `HEX()` returns a hexadecimal string representation of the value of *`N`* treated as a longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number. This is equivalent to `CONV(N,10,16)`. The inverse of this operation is performed by `CONV(HEX(N),16,10)`.

  ```sql
  mysql> SELECT X'616263', HEX('abc'), UNHEX(HEX('abc'));
          -> 'abc', 616263, 'abc'
  mysql> SELECT HEX(255), CONV(HEX(255),16,10);
          -> 'FF', 255
  ```

* `INSERT(str,pos,len,newstr)`

  Returns the string *`str`*, with the substring beginning at position *`pos`* and *`len`* characters long replaced by the string *`newstr`*. Returns the original string if *`pos`* is not within the length of the string. Replaces the rest of the string from position *`pos`* if *`len`* is not within the length of the rest of the string. Returns `NULL` if any argument is `NULL`.

  ```sql
  mysql> SELECT INSERT('Quadratic', 3, 4, 'What');
          -> 'QuWhattic'
  mysql> SELECT INSERT('Quadratic', -1, 4, 'What');
          -> 'Quadratic'
  mysql> SELECT INSERT('Quadratic', 3, 100, 'What');
          -> 'QuWhat'
  ```

  This function is multibyte safe.

* `INSTR(str,substr)`

  Returns the position of the first occurrence of substring *`substr`* in string *`str`*. This is the same as the two-argument form of `LOCATE()`, except that the order of the arguments is reversed.

  ```sql
  mysql> SELECT INSTR('foobarbar', 'bar');
          -> 4
  mysql> SELECT INSTR('xbar', 'foobar');
          -> 0
  ```

  This function is multibyte safe, and is case-sensitive only if at least one argument is a binary string.

* `LCASE(str)`

  `LCASE()` is a synonym for `LOWER()`.

  `LCASE()` used in a view is rewritten as `LOWER()` when storing the view's definition. (Bug #12844279)

* `LEFT(str,len)`

  Returns the leftmost *`len`* characters from the string *`str`*, or `NULL` if any argument is `NULL`.

  ```sql
  mysql> SELECT LEFT('foobarbar', 5);
          -> 'fooba'
  ```

  This function is multibyte safe.

* `LENGTH(str)`

  Returns the length of the string *`str`*, measured in bytes. A multibyte character counts as multiple bytes. This means that for a string containing five 2-byte characters, `LENGTH()` returns `10`, whereas `CHAR_LENGTH()` returns `5`.

  ```sql
  mysql> SELECT LENGTH('text');
          -> 4
  ```

  Note

  The `Length()` OpenGIS spatial function is named `ST_Length()` in MySQL.

* `LOAD_FILE(file_name)`

  Reads the file and returns the file contents as a string. To use this function, the file must be located on the server host, you must specify the full path name to the file, and you must have the `FILE` privilege. The file must be readable by all and its size less than `max_allowed_packet` bytes. If the `secure_file_priv` system variable is set to a nonempty directory name, the file to be loaded must be located in that directory.

  If the file does not exist or cannot be read because one of the preceding conditions is not satisfied, the function returns `NULL`.

  The `character_set_filesystem` system variable controls interpretation of file names that are given as literal strings.

  ```sql
  mysql> UPDATE t
              SET blob_col=LOAD_FILE('/tmp/picture')
              WHERE id=1;
  ```

* `LOCATE(substr,str)`, `LOCATE(substr,str,pos)`

  The first syntax returns the position of the first occurrence of substring *`substr`* in string *`str`*. The second syntax returns the position of the first occurrence of substring *`substr`* in string *`str`*, starting at position *`pos`*. Returns `0` if *`substr`* is not in *`str`*. Returns `NULL` if *`substr`* or *`str`* is `NULL`.

  ```sql
  mysql> SELECT LOCATE('bar', 'foobarbar');
          -> 4
  mysql> SELECT LOCATE('xbar', 'foobar');
          -> 0
  mysql> SELECT LOCATE('bar', 'foobarbar', 5);
          -> 7
  ```

  This function is multibyte safe, and is case-sensitive only if at least one argument is a binary string.

* `LOWER(str)`

  Returns the string *`str`* with all characters changed to lowercase according to the current character set mapping. The default is `latin1` (cp1252 West European).

  ```sql
  mysql> SELECT LOWER('QUADRATICALLY');
          -> 'quadratically'
  ```

  `LOWER()` (and `UPPER()`) are ineffective when applied to binary strings (`BINARY`, `VARBINARY`, `BLOB`). To perform lettercase conversion of a binary string, first convert it to a nonbinary string using a character set appropriate for the data stored in the string:

  ```sql
  mysql> SET @str = BINARY 'New York';
  mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING latin1));
  +-------------+-----------------------------------+
  | LOWER(@str) | LOWER(CONVERT(@str USING latin1)) |
  +-------------+-----------------------------------+
  | New York    | new york                          |
  +-------------+-----------------------------------+
  ```

  For collations of Unicode character sets, `LOWER()` and `UPPER()` work according to the Unicode Collation Algorithm (UCA) version in the collation name, if there is one, and UCA 4.0.0 if no version is specified. For example, `utf8_unicode_520_ci` works according to UCA 5.2.0, whereas `utf8_unicode_ci` works according to UCA 4.0.0. See Section 10.10.1, “Unicode Character Sets”.

  This function is multibyte safe.

  In previous versions of MySQL, `LOWER()` used within a view was rewritten as `LCASE()` when storing the view's definition. In MySQL 5.7, `LOWER()` is never rewritten in such cases, but `LCASE()` used within views is instead rewritten as `LOWER()`. (Bug #12844279)

* `LPAD(str,len,padstr)`

  Returns the string *`str`*, left-padded with the string *`padstr`* to a length of *`len`* characters. If *`str`* is longer than *`len`*, the return value is shortened to *`len`* characters.

  ```sql
  mysql> SELECT LPAD('hi',4,'??');
          -> '??hi'
  mysql> SELECT LPAD('hi',1,'??');
          -> 'h'
  ```

* `LTRIM(str)`

  Returns the string *`str`* with leading space characters removed.

  ```sql
  mysql> SELECT LTRIM('  barbar');
          -> 'barbar'
  ```

  This function is multibyte safe.

* `MAKE_SET(bits,str1,str2,...)`

  Returns a set value (a string containing substrings separated by `,` characters) consisting of the strings that have the corresponding bit in *`bits`* set. *`str1`* corresponds to bit 0, *`str2`* to bit 1, and so on. `NULL` values in *`str1`*, *`str2`*, `...` are not appended to the result.

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

* `MID(str,pos)`, [`MID(str FROM pos)`](string-functions.html#function_mid), `MID(str,pos,len)`, [`MID(str FROM pos FOR len)`](string-functions.html#function_mid)

  `MID(str,pos,len)` is a synonym for `SUBSTRING(str,pos,len)`.

* `OCT(N)`

  Returns a string representation of the octal value of *`N`*, where *`N`* is a longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number. This is equivalent to `CONV(N,10,8)`. Returns `NULL` if *`N`* is `NULL`.

  ```sql
  mysql> SELECT OCT(12);
          -> '14'
  ```

* `OCTET_LENGTH(str)`

  `OCTET_LENGTH()` is a synonym for `LENGTH()`.

* `ORD(str)`

  If the leftmost character of the string *`str`* is a multibyte character, returns the code for that character, calculated from the numeric values of its constituent bytes using this formula:

  ```sql
    (1st byte code)
  + (2nd byte code * 256)
  + (3rd byte code * 256^2) ...
  ```

  If the leftmost character is not a multibyte character, `ORD()` returns the same value as the `ASCII()` function.

  ```sql
  mysql> SELECT ORD('2');
          -> 50
  ```

* [`POSITION(substr IN str)`](string-functions.html#function_position)

  [`POSITION(substr IN str)`](string-functions.html#function_position) is a synonym for `LOCATE(substr,str)`.

* `QUOTE(str)`

  Quotes a string to produce a result that can be used as a properly escaped data value in an SQL statement. The string is returned enclosed by single quotation marks and with each instance of backslash (`\`), single quote (`'`), ASCII `NUL`, and Control+Z preceded by a backslash. If the argument is `NULL`, the return value is the word “NULL” without enclosing single quotation marks.

  ```sql
  mysql> SELECT QUOTE('Don\'t!');
          -> 'Don\'t!'
  mysql> SELECT QUOTE(NULL);
          -> NULL
  ```

  For comparison, see the quoting rules for literal strings and within the C API in Section 9.1.1, “String Literals”, and mysql\_real\_escape\_string\_quote().

* `REPEAT(str,count)`

  Returns a string consisting of the string *`str`* repeated *`count`* times. If *`count`* is less than 1, returns an empty string. Returns `NULL` if *`str`* or *`count`* are `NULL`.

  ```sql
  mysql> SELECT REPEAT('MySQL', 3);
          -> 'MySQLMySQLMySQL'
  ```

* `REPLACE(str,from_str,to_str)`

  Returns the string *`str`* with all occurrences of the string *`from_str`* replaced by the string *`to_str`*. `REPLACE()` performs a case-sensitive match when searching for *`from_str`*.

  ```sql
  mysql> SELECT REPLACE('www.mysql.com', 'w', 'Ww');
          -> 'WwWwWw.mysql.com'
  ```

  This function is multibyte safe.

* `REVERSE(str)`

  Returns the string *`str`* with the order of the characters reversed.

  ```sql
  mysql> SELECT REVERSE('abc');
          -> 'cba'
  ```

  This function is multibyte safe.

* `RIGHT(str,len)`

  Returns the rightmost *`len`* characters from the string *`str`*, or `NULL` if any argument is `NULL`.

  ```sql
  mysql> SELECT RIGHT('foobarbar', 4);
          -> 'rbar'
  ```

  This function is multibyte safe.

* `RPAD(str,len,padstr)`

  Returns the string *`str`*, right-padded with the string *`padstr`* to a length of *`len`* characters. If *`str`* is longer than *`len`*, the return value is shortened to *`len`* characters.

  ```sql
  mysql> SELECT RPAD('hi',5,'?');
          -> 'hi???'
  mysql> SELECT RPAD('hi',1,'?');
          -> 'h'
  ```

  This function is multibyte safe.

* `RTRIM(str)`

  Returns the string *`str`* with trailing space characters removed.

  ```sql
  mysql> SELECT RTRIM('barbar   ');
          -> 'barbar'
  ```

  This function is multibyte safe.

* `SOUNDEX(str)`

  Returns a soundex string from *`str`*. Two strings that sound almost the same should have identical soundex strings. A standard soundex string is four characters long, but the `SOUNDEX()` function returns an arbitrarily long string. You can use `SUBSTRING()` on the result to get a standard soundex string. All nonalphabetic characters in *`str`* are ignored. All international alphabetic characters outside the A-Z range are treated as vowels.

  Important

  When using `SOUNDEX()`, you should be aware of the following limitations:

  + This function, as currently implemented, is intended to work well with strings that are in the English language only. Strings in other languages may not produce reliable results.

  + This function is not guaranteed to provide consistent results with strings that use multibyte character sets, including `utf-8`. See Bug #22638 for more information.

  ```sql
  mysql> SELECT SOUNDEX('Hello');
          -> 'H400'
  mysql> SELECT SOUNDEX('Quadratically');
          -> 'Q36324'
  ```

  Note

  This function implements the original Soundex algorithm, not the more popular enhanced version (also described by D. Knuth). The difference is that original version discards vowels first and duplicates second, whereas the enhanced version discards duplicates first and vowels second.

* [`expr1 SOUNDS LIKE expr2`](string-functions.html#operator_sounds-like)

  This is the same as [`SOUNDEX(expr1) = SOUNDEX(expr2)`](string-functions.html#function_soundex).

* `SPACE(N)`

  Returns a string consisting of *`N`* space characters.

  ```sql
  mysql> SELECT SPACE(6);
          -> '      '
  ```

* `SUBSTR(str,pos)`, [`SUBSTR(str FROM pos)`](string-functions.html#function_substr), `SUBSTR(str,pos,len)`, [`SUBSTR(str FROM pos FOR len)`](string-functions.html#function_substr)

  `SUBSTR()` is a synonym for `SUBSTRING()`.

* `SUBSTRING(str,pos)`, [`SUBSTRING(str FROM pos)`](string-functions.html#function_substring), `SUBSTRING(str,pos,len)`, [`SUBSTRING(str FROM pos FOR len)`](string-functions.html#function_substring)

  The forms without a *`len`* argument return a substring from string *`str`* starting at position *`pos`*. The forms with a *`len`* argument return a substring *`len`* characters long from string *`str`*, starting at position *`pos`*. The forms that use `FROM` are standard SQL syntax. It is also possible to use a negative value for *`pos`*. In this case, the beginning of the substring is *`pos`* characters from the end of the string, rather than the beginning. A negative value may be used for *`pos`* in any of the forms of this function. A value of 0 for *`pos`* returns an empty string.

  For all forms of `SUBSTRING()`, the position of the first character in the string from which the substring is to be extracted is reckoned as `1`.

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

  If *`len`* is less than 1, the result is the empty string.

* `SUBSTRING_INDEX(str,delim,count)`

  Returns the substring from string *`str`* before *`count`* occurrences of the delimiter *`delim`*. If *`count`* is positive, everything to the left of the final delimiter (counting from the left) is returned. If *`count`* is negative, everything to the right of the final delimiter (counting from the right) is returned. `SUBSTRING_INDEX()` performs a case-sensitive match when searching for *`delim`*.

  ```sql
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', 2);
          -> 'www.mysql'
  mysql> SELECT SUBSTRING_INDEX('www.mysql.com', '.', -2);
          -> 'mysql.com'
  ```

  This function is multibyte safe.

* `TO_BASE64(str)`

  Converts the string argument to base-64 encoded form and returns the result as a character string with the connection character set and collation. If the argument is not a string, it is converted to a string before conversion takes place. The result is `NULL` if the argument is `NULL`. Base-64 encoded strings can be decoded using the `FROM_BASE64()` function.

  ```sql
  mysql> SELECT TO_BASE64('abc'), FROM_BASE64(TO_BASE64('abc'));
          -> 'JWJj', 'abc'
  ```

  Different base-64 encoding schemes exist. These are the encoding and decoding rules used by `TO_BASE64()` and `FROM_BASE64()`:

  + The encoding for alphabet value 62 is `'+'`.

  + The encoding for alphabet value 63 is `'/'`.

  + Encoded output consists of groups of 4 printable characters. Each 3 bytes of the input data are encoded using 4 characters. If the last group is incomplete, it is padded with `'='` characters to a length of 4.

  + A newline is added after each 76 characters of encoded output to divide long output into multiple lines.

  + Decoding recognizes and ignores newline, carriage return, tab, and space.

* [`TRIM([{BOTH | LEADING | TRAILING} [remstr] FROM] str)`](string-functions.html#function_trim), [`TRIM([remstr FROM] str)`](string-functions.html#function_trim)

  Returns the string *`str`* with all *`remstr`* prefixes or suffixes removed. If none of the specifiers `BOTH`, `LEADING`, or `TRAILING` is given, `BOTH` is assumed. *`remstr`* is optional and, if not specified, spaces are removed.

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

* `UCASE(str)`

  `UCASE()` is a synonym for `UPPER()`.

  In MySQL 5.7, `UCASE()` used in a view is rewritten as `UPPER()` when storing the view's definition. (Bug #12844279)

* `UNHEX(str)`

  For a string argument *`str`*, `UNHEX(str)` interprets each pair of characters in the argument as a hexadecimal number and converts it to the byte represented by the number. The return value is a binary string.

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

  The characters in the argument string must be legal hexadecimal digits: `'0'` .. `'9'`, `'A'` .. `'F'`, `'a'` .. `'f'`. If the argument contains any nonhexadecimal digits, the result is `NULL`:

  ```sql
  mysql> SELECT UNHEX('GG');
  +-------------+
  | UNHEX('GG') |
  +-------------+
  | NULL        |
  +-------------+
  ```

  A `NULL` result can occur if the argument to `UNHEX()` is a `BINARY` column, because values are padded with `0x00` bytes when stored but those bytes are not stripped on retrieval. For example, `'41'` is stored into a `CHAR(3)` column as `'41 '` and retrieved as `'41'` (with the trailing pad space stripped), so `UNHEX()` for the column value returns `X'41'`. By contrast, `'41'` is stored into a `BINARY(3)` column as `'41\0'` and retrieved as `'41\0'` (with the trailing pad `0x00` byte not stripped). `'\0'` is not a legal hexadecimal digit, so `UNHEX()` for the column value returns `NULL`.

  For a numeric argument *`N`*, the inverse of `HEX(N)` is not performed by `UNHEX()`. Use `CONV(HEX(N),16,10)` instead. See the description of `HEX()`.

  If `UNHEX()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* `UPPER(str)`

  Returns the string *`str`* with all characters changed to uppercase according to the current character set mapping. The default is `latin1` (cp1252 West European).

  ```sql
  mysql> SELECT UPPER('Hej');
          -> 'HEJ'
  ```

  See the description of `LOWER()` for information that also applies to `UPPER()`. This included information about how to perform lettercase conversion of binary strings (`BINARY`, `VARBINARY`, `BLOB`) for which these functions are ineffective, and information about case folding for Unicode character sets.

  This function is multibyte safe.

  In previous versions of MySQL, `UPPER()` used within a view was rewritten as `UCASE()` when storing the view's definition. In MySQL 5.7, `UPPER()` is never rewritten in such cases, but `UCASE()` used within views is instead rewritten as `UPPER()`. (Bug #12844279)

* [`WEIGHT_STRING(str [AS {CHAR|BINARY}(N)] [LEVEL levels] [flags])`](string-functions.html#function_weight-string)

  `levels: N [ASC|DESC|REVERSE] [, N [ASC|DESC|REVERSE]] ...`

  This function returns the weight string for the input string. The return value is a binary string that represents the comparison and sorting value of the string. It has these properties:

  + If `WEIGHT_STRING(str1)` = `WEIGHT_STRING(str2)`, then `str1 = str2` (*`str1`* and *`str2`* are considered equal)

  + If `WEIGHT_STRING(str1)` < `WEIGHT_STRING(str2)`, then `str1 < str2` (*`str1`* sorts before *`str2`*)

  `WEIGHT_STRING()` is a debugging function intended for internal use. Its behavior can change without notice between MySQL versions. It can be used for testing and debugging of collations, especially if you are adding a new collation. See Section 10.14, “Adding a Collation to a Character Set”.

  This list briefly summarizes the arguments. More details are given in the discussion following the list.

  + *`str`*: The input string expression.

  + `AS` clause: Optional; cast the input string to a given type and length.

  + `LEVEL` clause: Optional; specify weight levels for the return value.

  + *`flags`*: Optional; unused.

  The input string, *`str`*, is a string expression. If the input is a nonbinary (character) string such as a `CHAR`, `VARCHAR`, or `TEXT` value, the return value contains the collation weights for the string. If the input is a binary (byte) string such as a `BINARY`, `VARBINARY`, or `BLOB` value, the return value is the same as the input (the weight for each byte in a binary string is the byte value). If the input is `NULL`, `WEIGHT_STRING()` returns `NULL`.

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

  The preceding examples use `HEX()` to display the `WEIGHT_STRING()` result. Because the result is a binary value, `HEX()` can be especially useful when the result contains nonprinting values, to display it in printable form:

  ```sql
  mysql> SET @s = CONVERT(X'C39F' USING utf8) COLLATE utf8_czech_ci;
  mysql> SELECT HEX(WEIGHT_STRING(@s));
  +------------------------+
  | HEX(WEIGHT_STRING(@s)) |
  +------------------------+
  | 0FEA0FEA               |
  +------------------------+
  ```

  For non-`NULL` return values, the data type of the value is `VARBINARY` if its length is within the maximum length for `VARBINARY`, otherwise the data type is `BLOB`.

  The `AS` clause may be given to cast the input string to a nonbinary or binary string and to force it to a given length:

  + `AS CHAR(N)` casts the string to a nonbinary string and pads it on the right with spaces to a length of *`N`* characters. *`N`* must be at least 1. If *`N`* is less than the length of the input string, the string is truncated to *`N`* characters. No warning occurs for truncation.

  + `AS BINARY(N)` is similar but casts the string to a binary string, *`N`* is measured in bytes (not characters), and padding uses `0x00` bytes (not spaces).

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

  The `LEVEL` clause may be given to specify that the return value should contain weights for specific collation levels.

  The *`levels`* specifier following the `LEVEL` keyword may be given either as a list of one or more integers separated by commas, or as a range of two integers separated by a dash. Whitespace around the punctuation characters does not matter.

  Examples:

  ```sql
  LEVEL 1
  LEVEL 2, 3, 5
  LEVEL 1-3
  ```

  Any level less than 1 is treated as 1. Any level greater than the maximum for the input string collation is treated as maximum for the collation. The maximum varies per collation, but is never greater than 6.

  In a list of levels, levels must be given in increasing order. In a range of levels, if the second number is less than the first, it is treated as the first number (for example, 4-2 is the same as 4-4).

  If the `LEVEL` clause is omitted, MySQL assumes `LEVEL 1 - max`, where *`max`* is the maximum level for the collation.

  If `LEVEL` is specified using list syntax (not range syntax), any level number can be followed by these modifiers:

  + `ASC`: Return the weights without modification. This is the default.

  + `DESC`: Return bitwise-inverted weights (for example, `0x78f0 DESC` = `0x870f`).

  + `REVERSE`: Return the weights in reverse order (that is,the weights for the reversed string, with the first character last and the last first).

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

  The *`flags`* clause currently is unused.

  If `WEIGHT_STRING()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.


### 12.8.1 String Comparison Functions and Operators

**Table 12.13 String Comparison Functions and Operators**

<table frame="box" rules="all" summary="A reference that lists string comparison functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>LIKE</code></td> <td> Simple pattern matching </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negation of simple pattern matching </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compare two strings </td> </tr></tbody></table>

If a string function is given a binary string as an argument, the resulting string is also a binary string. A number converted to a string is treated as a binary string. This affects only comparisons.

Normally, if any expression in a string comparison is case-sensitive, the comparison is performed in case-sensitive fashion.

If a string function is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* [`expr LIKE pat [ESCAPE 'escape_char']`](string-comparison-functions.html#operator_like)

  Pattern matching using an SQL pattern. Returns `1` (`TRUE`) or `0` (`FALSE`). If either *`expr`* or *`pat`* is `NULL`, the result is `NULL`.

  The pattern need not be a literal string. For example, it can be specified as a string expression or table column. In the latter case, the column must be defined as one of the MySQL string types (see Section 11.3, “String Data Types”).

  Per the SQL standard, `LIKE` performs matching on a per-character basis, thus it can produce results different from the `=` comparison operator:

  ```sql
  mysql> SELECT 'ä' LIKE 'ae' COLLATE latin1_german2_ci;
  +-----------------------------------------+
  | 'ä' LIKE 'ae' COLLATE latin1_german2_ci |
  +-----------------------------------------+
  |                                       0 |
  +-----------------------------------------+
  mysql> SELECT 'ä' = 'ae' COLLATE latin1_german2_ci;
  +--------------------------------------+
  | 'ä' = 'ae' COLLATE latin1_german2_ci |
  +--------------------------------------+
  |                                    1 |
  +--------------------------------------+
  ```

  In particular, trailing spaces are significant, which is not true for comparisons of nonbinary strings (`CHAR`, `VARCHAR`, and `TEXT` values) performed with the `=` operator:

  ```sql
  mysql> SELECT 'a' = 'a ', 'a' LIKE 'a ';
  +------------+---------------+
  | 'a' = 'a ' | 'a' LIKE 'a ' |
  +------------+---------------+
  |          1 |             0 |
  +------------+---------------+
  1 row in set (0.00 sec)
  ```

  With `LIKE` you can use the following two wildcard characters in the pattern:

  + `%` matches any number of characters, even zero characters.

  + `_` matches exactly one character.

  ```sql
  mysql> SELECT 'David!' LIKE 'David_';
          -> 1
  mysql> SELECT 'David!' LIKE '%D%v%';
          -> 1
  ```

  To test for literal instances of a wildcard character, precede it by the escape character. If you do not specify the `ESCAPE` character, `\` is assumed, unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled. In that case, no escape character is used.

  + `\%` matches one `%` character.

  + `\_` matches one `_` character.

  ```sql
  mysql> SELECT 'David!' LIKE 'David\_';
          -> 0
  mysql> SELECT 'David_' LIKE 'David\_';
          -> 1
  ```

  To specify a different escape character, use the `ESCAPE` clause:

  ```sql
  mysql> SELECT 'David_' LIKE 'David|_' ESCAPE '|';
          -> 1
  ```

  The escape sequence should be one character long to specify the escape character, or empty to specify that no escape character is used. The expression must evaluate as a constant at execution time. If the `NO_BACKSLASH_ESCAPES` SQL mode is enabled, the sequence cannot be empty.

  The following statements illustrate that string comparisons are not case-sensitive unless one of the operands is case-sensitive (uses a case-sensitive collation or is a binary string):

  ```sql
  mysql> SELECT 'abc' LIKE 'ABC';
          -> 1
  mysql> SELECT 'abc' LIKE _latin1 'ABC' COLLATE latin1_general_cs;
          -> 0
  mysql> SELECT 'abc' LIKE _latin1 'ABC' COLLATE latin1_bin;
          -> 0
  mysql> SELECT 'abc' LIKE BINARY 'ABC';
          -> 0
  ```

  As an extension to standard SQL, MySQL permits `LIKE` on numeric expressions.

  ```sql
  mysql> SELECT 10 LIKE '1%';
          -> 1
  ```

  MySQL attempts in such cases to perform implicit conversion of the expression to a string. See Section 12.3, “Type Conversion in Expression Evaluation”.

  Note

  MySQL uses C escape syntax in strings (for example, `\n` to represent the newline character). If you want a `LIKE` string to contain a literal `\`, you must double it. (Unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled, in which case no escape character is used.) For example, to search for `\n`, specify it as `\\n`. To search for `\`, specify it as `\\\\`; this is because the backslashes are stripped once by the parser and again when the pattern match is made, leaving a single backslash to be matched against.

  Exception: At the end of the pattern string, backslash can be specified as `\\`. At the end of the string, backslash stands for itself because there is nothing following to escape. Suppose that a table contains the following values:

  ```sql
  mysql> SELECT filename FROM t1;
  +--------------+
  | filename     |
  +--------------+
  | C:           |
  | C:\          |
  | C:\Programs  |
  | C:\Programs\ |
  +--------------+
  ```

  To test for values that end with backslash, you can match the values using either of the following patterns:

  ```sql
  mysql> SELECT filename, filename LIKE '%\\' FROM t1;
  +--------------+---------------------+
  | filename     | filename LIKE '%\\' |
  +--------------+---------------------+
  | C:           |                   0 |
  | C:\          |                   1 |
  | C:\Programs  |                   0 |
  | C:\Programs\ |                   1 |
  +--------------+---------------------+

  mysql> SELECT filename, filename LIKE '%\\\\' FROM t1;
  +--------------+-----------------------+
  | filename     | filename LIKE '%\\\\' |
  +--------------+-----------------------+
  | C:           |                     0 |
  | C:\          |                     1 |
  | C:\Programs  |                     0 |
  | C:\Programs\ |                     1 |
  +--------------+-----------------------+
  ```

* [`expr NOT LIKE pat [ESCAPE 'escape_char']`](string-comparison-functions.html#operator_not-like)

  This is the same as `NOT (expr LIKE pat [ESCAPE 'escape_char'])`.

  Note

  Aggregate queries involving [`NOT LIKE`](string-comparison-functions.html#operator_not-like) comparisons with columns containing `NULL` may yield unexpected results. For example, consider the following table and data:

  ```sql
  CREATE TABLE foo (bar VARCHAR(10));

  INSERT INTO foo VALUES (NULL), (NULL);
  ```

  The query `SELECT COUNT(*) FROM foo WHERE bar LIKE '%baz%';` returns `0`. You might assume that `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` would return `2`. However, this is not the case: The second query returns `0`. This is because `NULL NOT LIKE expr` always returns `NULL`, regardless of the value of *`expr`*. The same is true for aggregate queries involving `NULL` and comparisons using [`NOT RLIKE`](regexp.html#operator_not-regexp) or [`NOT REGEXP`](regexp.html#operator_not-regexp). In such cases, you must test explicitly for `NOT NULL` using `OR` (and not `AND`), as shown here:

  ```sql
  SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%' OR bar IS NULL;
  ```

* `STRCMP(expr1,expr2)`

  `STRCMP()` returns `0` if the strings are the same, `-1` if the first argument is smaller than the second according to the current sort order, and `1` otherwise.

  ```sql
  mysql> SELECT STRCMP('text', 'text2');
          -> -1
  mysql> SELECT STRCMP('text2', 'text');
          -> 1
  mysql> SELECT STRCMP('text', 'text');
          -> 0
  ```

  `STRCMP()` performs the comparison using the collation of the arguments.

  ```sql
  mysql> SET @s1 = _latin1 'x' COLLATE latin1_general_ci;
  mysql> SET @s2 = _latin1 'X' COLLATE latin1_general_ci;
  mysql> SET @s3 = _latin1 'x' COLLATE latin1_general_cs;
  mysql> SET @s4 = _latin1 'X' COLLATE latin1_general_cs;
  mysql> SELECT STRCMP(@s1, @s2), STRCMP(@s3, @s4);
  +------------------+------------------+
  | STRCMP(@s1, @s2) | STRCMP(@s3, @s4) |
  +------------------+------------------+
  |                0 |                1 |
  +------------------+------------------+
  ```

  If the collations are incompatible, one of the arguments must be converted to be compatible with the other. See Section 10.8.4, “Collation Coercibility in Expressions”.

  ```sql
  mysql> SELECT STRCMP(@s1, @s3);
  ERROR 1267 (HY000): Illegal mix of collations (latin1_general_ci,IMPLICIT)
  and (latin1_general_cs,IMPLICIT) for operation 'strcmp'
  mysql> SELECT STRCMP(@s1, @s3 COLLATE latin1_general_ci);
  +--------------------------------------------+
  | STRCMP(@s1, @s3 COLLATE latin1_general_ci) |
  +--------------------------------------------+
  |                                          0 |
  +--------------------------------------------+
  ```


### 12.8.2 Regular Expressions

**Table 12.14 Regular Expression Functions and Operators**

<table frame="box" rules="all" summary="A reference that lists regular expression functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>NOT REGEXP</code></td> <td> Negation of REGEXP </td> </tr><tr><td><code>REGEXP</code></td> <td> Whether string matches regular expression </td> </tr><tr><td><code>RLIKE</code></td> <td> Whether string matches regular expression </td> </tr></tbody></table>

A regular expression is a powerful way of specifying a pattern for a complex search. This section discusses the operators available for regular expression matching and illustrates, with examples, some of the special characters and constructs that can be used for regular expression operations. See also Section 3.3.4.7, “Pattern Matching”.

MySQL uses Henry Spencer's implementation of regular expressions, which is aimed at conformance with POSIX 1003.2. MySQL uses the extended version to support regular expression pattern-matching operations in SQL statements. This section does not contain all the details that can be found in Henry Spencer's `regex(7)` manual page. That manual page is included in MySQL source distributions, in the `regex.7` file under the `regex` directory.

* Regular Expression Function and Operator Descriptions
* Regular Expression Syntax

#### Regular Expression Function and Operator Descriptions

* [`expr NOT REGEXP pat`](regexp.html#operator_not-regexp), [`expr NOT RLIKE pat`](regexp.html#operator_not-regexp)

  This is the same as `NOT (expr REGEXP pat)`.

* [`expr REGEXP pat`](regexp.html#operator_regexp), [`expr RLIKE pat`](regexp.html#operator_regexp)

  Returns 1 if the string *`expr`* matches the regular expression specified by the pattern *`pat`*, 0 otherwise. If either *`expr`* or *`pat`* is `NULL`, the return value is `NULL`.

  `RLIKE` is a synonym for `REGEXP`.

  The pattern can be an extended regular expression, the syntax for which is discussed in Regular Expression Syntax. The pattern need not be a literal string. For example, it can be specified as a string expression or table column.

  Note

  MySQL uses C escape syntax in strings (for example, `\n` to represent the newline character). If you want your *`expr`* or *`pat`* argument to contain a literal `\`, you must double it. (Unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled, in which case no escape character is used.)

  Regular expression operations use the character set and collation of the string expression and pattern arguments when deciding the type of a character and performing the comparison. If the arguments have different character sets or collations, coercibility rules apply as described in Section 10.8.4, “Collation Coercibility in Expressions”. If either argument is a binary string, the arguments are handled in case-sensitive fashion as binary strings.

  ```sql
  mysql> SELECT 'Michael!' REGEXP '.*';
  +------------------------+
  | 'Michael!' REGEXP '.*' |
  +------------------------+
  |                      1 |
  +------------------------+
  mysql> SELECT 'new*\n*line' REGEXP 'new\\*.\\*line';
  +---------------------------------------+
  | 'new*\n*line' REGEXP 'new\\*.\\*line' |
  +---------------------------------------+
  |                                     0 |
  +---------------------------------------+
  mysql> SELECT 'a' REGEXP '^[a-d]';
  +---------------------+
  | 'a' REGEXP '^[a-d]' |
  +---------------------+
  |                   1 |
  +---------------------+
  ```

  Warning

  The `REGEXP` and `RLIKE` operators work in byte-wise fashion, so they are not multibyte safe and may produce unexpected results with multibyte character sets. In addition, these operators compare characters by their byte values and accented characters may not compare as equal even if a given collation treats them as equal.

#### Regular Expression Syntax

A regular expression describes a set of strings. The simplest regular expression is one that has no special characters in it. For example, the regular expression `hello` matches `hello` and nothing else.

Nontrivial regular expressions use certain special constructs so that they can match more than one string. For example, the regular expression `hello|world` contains the `|` alternation operator and matches either the `hello` or `world`.

As a more complex example, the regular expression `B[an]*s` matches any of the strings `Bananas`, `Baaaaas`, `Bs`, and any other string starting with a `B`, ending with an `s`, and containing any number of `a` or `n` characters in between.

A regular expression for the `REGEXP` operator may use any of the following special characters and constructs:

* `^`

  Match the beginning of a string.

  ```sql
  mysql> SELECT 'fo\nfo' REGEXP '^fo$';                   -> 0
  mysql> SELECT 'fofo' REGEXP '^fo';                      -> 1
  ```

* `$`

  Match the end of a string.

  ```sql
  mysql> SELECT 'fo\no' REGEXP '^fo\no$';                 -> 1
  mysql> SELECT 'fo\no' REGEXP '^fo$';                    -> 0
  ```

* `.`

  Match any character (including carriage return and newline).

  ```sql
  mysql> SELECT 'fofo' REGEXP '^f.*$';                    -> 1
  mysql> SELECT 'fo\r\nfo' REGEXP '^f.*$';                -> 1
  ```

* `a*`

  Match any sequence of zero or more `a` characters.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba*n';                     -> 1
  mysql> SELECT 'Baaan' REGEXP '^Ba*n';                   -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba*n';                      -> 1
  ```

* `a+`

  Match any sequence of one or more `a` characters.

  ```sql
  mysql> SELECT 'Ban' REGEXP '^Ba+n';                     -> 1
  mysql> SELECT 'Bn' REGEXP '^Ba+n';                      -> 0
  ```

* `a?`

  Match either zero or one `a` character.

  ```sql
  mysql> SELECT 'Bn' REGEXP '^Ba?n';                      -> 1
  mysql> SELECT 'Ban' REGEXP '^Ba?n';                     -> 1
  mysql> SELECT 'Baan' REGEXP '^Ba?n';                    -> 0
  ```

* `de|abc`

  Alternation; match either of the sequences `de` or `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP 'pi|apa';                     -> 1
  mysql> SELECT 'axe' REGEXP 'pi|apa';                    -> 0
  mysql> SELECT 'apa' REGEXP 'pi|apa';                    -> 1
  mysql> SELECT 'apa' REGEXP '^(pi|apa)$';                -> 1
  mysql> SELECT 'pi' REGEXP '^(pi|apa)$';                 -> 1
  mysql> SELECT 'pix' REGEXP '^(pi|apa)$';                -> 0
  ```

* `(abc)*`

  Match zero or more instances of the sequence `abc`.

  ```sql
  mysql> SELECT 'pi' REGEXP '^(pi)*$';                    -> 1
  mysql> SELECT 'pip' REGEXP '^(pi)*$';                   -> 0
  mysql> SELECT 'pipi' REGEXP '^(pi)*$';                  -> 1
  ```

* `{1}`, `{2,3}`

  Repetition; `{n}` and `{m,n}` notation provide a more general way of writing regular expressions that match many occurrences of the previous atom (or “piece”) of the pattern. *`m`* and *`n`* are integers.

  + `a*`

    Can be written as `a{0,}`.

  + `a+`

    Can be written as `a{1,}`.

  + `a?`

    Can be written as `a{0,1}`.

  To be more precise, `a{n}` matches exactly *`n`* instances of `a`. `a{n,}` matches *`n`* or more instances of `a`. `a{m,n}` matches *`m`* through *`n`* instances of `a`, inclusive. If both *`m`* and *`n`* are given, *`m`* must be less than or equal to *`n`*.

  *`m`* and *`n`* must be in the range from `0` to `RE_DUP_MAX` (default 255), inclusive.

  ```sql
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{2}e';              -> 0
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{3}e';              -> 1
  mysql> SELECT 'abcde' REGEXP 'a[bcd]{1,10}e';           -> 1
  ```

* `[a-dX]`, `[^a-dX]`

  Matches any character that is (or is not, if `^` is used) either `a`, `b`, `c`, `d` or `X`. A `-` character between two other characters forms a range that matches all characters from the first character to the second. For example, `[0-9]` matches any decimal digit. To include a literal `]` character, it must immediately follow the opening bracket `[`. To include a literal `-` character, it must be written first or last. Any character that does not have a defined special meaning inside a `[]` pair matches only itself.

  ```sql
  mysql> SELECT 'aXbc' REGEXP '[a-dXYZ]';                 -> 1
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]$';               -> 0
  mysql> SELECT 'aXbc' REGEXP '^[a-dXYZ]+$';              -> 1
  mysql> SELECT 'aXbc' REGEXP '^[^a-dXYZ]+$';             -> 0
  mysql> SELECT 'gheis' REGEXP '^[^a-dXYZ]+$';            -> 1
  mysql> SELECT 'gheisa' REGEXP '^[^a-dXYZ]+$';           -> 0
  ```

* `[.characters.]`

  Within a bracket expression (written using `[` and `]`), matches the sequence of characters of that collating element. `characters` is either a single character or a character name like `newline`. The following table lists the permissible character names.

  The following table shows the permissible character names and the characters that they match. For characters given as numeric values, the values are represented in octal.

  <table summary="Permissible character names and characters they match. To save space, the column pairing of Name and Character are presented in a four column table format in this order: Name, Character, Name, Character. For characters given as numeric values, the values are represented in octal."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Name</th> <th>Character</th> <th>Name</th> <th>Character</th> </tr></thead><tbody><tr> <th><code>NUL</code></th> <td><code>0</code></td> <td><code>SOH</code></td> <td><code>001</code></td> </tr><tr> <th><code>STX</code></th> <td><code>002</code></td> <td><code>ETX</code></td> <td><code>003</code></td> </tr><tr> <th><code>EOT</code></th> <td><code>004</code></td> <td><code>ENQ</code></td> <td><code>005</code></td> </tr><tr> <th><code>ACK</code></th> <td><code>006</code></td> <td><code>BEL</code></td> <td><code>007</code></td> </tr><tr> <th><code>alert</code></th> <td><code>007</code></td> <td><code>BS</code></td> <td><code>010</code></td> </tr><tr> <th><code>backspace</code></th> <td><code>'\b'</code></td> <td><code>HT</code></td> <td><code>011</code></td> </tr><tr> <th><code>tab</code></th> <td><code>'\t'</code></td> <td><code>LF</code></td> <td><code>012</code></td> </tr><tr> <th><code>newline</code></th> <td><code>'\n'</code></td> <td><code>VT</code></td> <td><code>013</code></td> </tr><tr> <th><code>vertical-tab</code></th> <td><code>'\v'</code></td> <td><code>FF</code></td> <td><code>014</code></td> </tr><tr> <th><code>form-feed</code></th> <td><code>'\f'</code></td> <td><code>CR</code></td> <td><code>015</code></td> </tr><tr> <th><code>carriage-return</code></th> <td><code>'\r'</code></td> <td><code>SO</code></td> <td><code>016</code></td> </tr><tr> <th><code>SI</code></th> <td><code>017</code></td> <td><code>DLE</code></td> <td><code>020</code></td> </tr><tr> <th><code>DC1</code></th> <td><code>021</code></td> <td><code>DC2</code></td> <td><code>022</code></td> </tr><tr> <th><code>DC3</code></th> <td><code>023</code></td> <td><code>DC4</code></td> <td><code>024</code></td> </tr><tr> <th><code>NAK</code></th> <td><code>025</code></td> <td><code>SYN</code></td> <td><code>026</code></td> </tr><tr> <th><code>ETB</code></th> <td><code>027</code></td> <td><code>CAN</code></td> <td><code>030</code></td> </tr><tr> <th><code>EM</code></th> <td><code>031</code></td> <td><code>SUB</code></td> <td><code>032</code></td> </tr><tr> <th><code>ESC</code></th> <td><code>033</code></td> <td><code>IS4</code></td> <td><code>034</code></td> </tr><tr> <th><code>FS</code></th> <td><code>034</code></td> <td><code>IS3</code></td> <td><code>035</code></td> </tr><tr> <th><code>GS</code></th> <td><code>035</code></td> <td><code>IS2</code></td> <td><code>036</code></td> </tr><tr> <th><code>RS</code></th> <td><code>036</code></td> <td><code>IS1</code></td> <td><code>037</code></td> </tr><tr> <th><code>US</code></th> <td><code>037</code></td> <td><code>space</code></td> <td><code>' '</code></td> </tr><tr> <th><code>exclamation-mark</code></th> <td><code>'!'</code></td> <td><code>quotation-mark</code></td> <td><code>'"'</code></td> </tr><tr> <th><code>number-sign</code></th> <td><code>'#'</code></td> <td><code>dollar-sign</code></td> <td><code>'$'</code></td> </tr><tr> <th><code>percent-sign</code></th> <td><code>'%'</code></td> <td><code>ampersand</code></td> <td><code>'&amp;'</code></td> </tr><tr> <th><code>apostrophe</code></th> <td><code>'\''</code></td> <td><code>left-parenthesis</code></td> <td><code>'('</code></td> </tr><tr> <th><code>right-parenthesis</code></th> <td><code>')'</code></td> <td><code>asterisk</code></td> <td><code>'*'</code></td> </tr><tr> <th><code>plus-sign</code></th> <td><code>'+'</code></td> <td><code>comma</code></td> <td><code>','</code></td> </tr><tr> <th><code>hyphen</code></th> <td><code>'-'</code></td> <td><code>hyphen-minus</code></td> <td><code>'-'</code></td> </tr><tr> <th><code>period</code></th> <td><code>'.'</code></td> <td><code>full-stop</code></td> <td><code>'.'</code></td> </tr><tr> <th><code>slash</code></th> <td><code>'/'</code></td> <td><code>solidus</code></td> <td><code>'/'</code></td> </tr><tr> <th><code>zero</code></th> <td><code>'0'</code></td> <td><code>one</code></td> <td><code>'1'</code></td> </tr><tr> <th><code>two</code></th> <td><code>'2'</code></td> <td><code>three</code></td> <td><code>'3'</code></td> </tr><tr> <th><code>four</code></th> <td><code>'4'</code></td> <td><code>five</code></td> <td><code>'5'</code></td> </tr><tr> <th><code>six</code></th> <td><code>'6'</code></td> <td><code>seven</code></td> <td><code>'7'</code></td> </tr><tr> <th><code>eight</code></th> <td><code>'8'</code></td> <td><code>nine</code></td> <td><code>'9'</code></td> </tr><tr> <th><code>colon</code></th> <td><code>':'</code></td> <td><code>semicolon</code></td> <td><code>';'</code></td> </tr><tr> <th><code>less-than-sign</code></th> <td><code>'&lt;'</code></td> <td><code>equals-sign</code></td> <td><code>'='</code></td> </tr><tr> <th><code>greater-than-sign</code></th> <td><code>'&gt;'</code></td> <td><code>question-mark</code></td> <td><code>'?'</code></td> </tr><tr> <th><code>commercial-at</code></th> <td><code>'@'</code></td> <td><code>left-square-bracket</code></td> <td><code>'['</code></td> </tr><tr> <th><code>backslash</code></th> <td><code>'\\'</code></td> <td><code>reverse-solidus</code></td> <td><code>'\\'</code></td> </tr><tr> <th><code>right-square-bracket</code></th> <td><code>']'</code></td> <td><code>circumflex</code></td> <td><code>'^'</code></td> </tr><tr> <th><code>circumflex-accent</code></th> <td><code>'^'</code></td> <td><code>underscore</code></td> <td><code>'_'</code></td> </tr><tr> <th><code>low-line</code></th> <td><code>'_'</code></td> <td><code>grave-accent</code></td> <td><code>'`'</code></td> </tr><tr> <th><code>left-brace</code></th> <td><code>'{'</code></td> <td><code>left-curly-bracket</code></td> <td><code>'{'</code></td> </tr><tr> <th><code>vertical-line</code></th> <td><code>'|'</code></td> <td><code>right-brace</code></td> <td><code>'}'</code></td> </tr><tr> <th><code>right-curly-bracket</code></th> <td><code>'}'</code></td> <td><code>tilde</code></td> <td><code>'~'</code></td> </tr><tr> <th><code>DEL</code></th> <td><code>177</code></td> <td></td> <td></td> </tr></tbody></table>

  ```sql
  mysql> SELECT '~' REGEXP '[[.~.]]';                     -> 1
  mysql> SELECT '~' REGEXP '[[.tilde.]]';                 -> 1
  ```

* `[=character_class=]`

  Within a bracket expression (written using `[` and `]`), `[=character_class=]` represents an equivalence class. It matches all characters with the same collation value, including itself. For example, if `o` and `(+)` are the members of an equivalence class, `[[=o=]]`, `[[=(+)=]]`, and `[o(+)]` are all synonymous. An equivalence class may not be used as an endpoint of a range.

* `[:character_class:]`

  Within a bracket expression (written using `[` and `]`), `[:character_class:]` represents a character class that matches all characters belonging to that class. The following table lists the standard class names. These names stand for the character classes defined in the `ctype(3)` manual page. A particular locale may provide other class names. A character class may not be used as an endpoint of a range.

  <table summary="Character class names and the meaning of each class."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Character Class Name</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>alnum</code></td> <td>Alphanumeric characters</td> </tr><tr> <td><code>alpha</code></td> <td>Alphabetic characters</td> </tr><tr> <td><code>blank</code></td> <td>Whitespace characters</td> </tr><tr> <td><code>cntrl</code></td> <td>Control characters</td> </tr><tr> <td><code>digit</code></td> <td>Digit characters</td> </tr><tr> <td><code>graph</code></td> <td>Graphic characters</td> </tr><tr> <td><code>lower</code></td> <td>Lowercase alphabetic characters</td> </tr><tr> <td><code>print</code></td> <td>Graphic or space characters</td> </tr><tr> <td><code>punct</code></td> <td>Punctuation characters</td> </tr><tr> <td><code>space</code></td> <td>Space, tab, newline, and carriage return</td> </tr><tr> <td><code>upper</code></td> <td>Uppercase alphabetic characters</td> </tr><tr> <td><code>xdigit</code></td> <td>Hexadecimal digit characters</td> </tr></tbody></table>

  ```sql
  mysql> SELECT 'justalnums' REGEXP '[[:alnum:]]+';       -> 1
  mysql> SELECT '!!' REGEXP '[[:alnum:]]+';               -> 0
  ```

* `[[:<:]]`, `[[:>:]]`

  These markers stand for word boundaries. They match the beginning and end of words, respectively. A word is a sequence of word characters that is not preceded by or followed by word characters. A word character is an alphanumeric character in the `alnum` class or an underscore (`_`).

  ```sql
  mysql> SELECT 'a word a' REGEXP '[[:<:]]word[[:>:]]';   -> 1
  mysql> SELECT 'a xword a' REGEXP '[[:<:]]word[[:>:]]';  -> 0
  ```

To use a literal instance of a special character in a regular expression, precede it by two backslash (\) characters. The MySQL parser interprets one of the backslashes, and the regular expression library interprets the other. For example, to match the string `1+2` that contains the special `+` character, only the last of the following regular expressions is the correct one:

```sql
mysql> SELECT '1+2' REGEXP '1+2';                       -> 0
mysql> SELECT '1+2' REGEXP '1\+2';                      -> 0
mysql> SELECT '1+2' REGEXP '1\\+2';                     -> 1
```


### 12.8.3 Character Set and Collation of Function Results

MySQL has many operators and functions that return a string. This section answers the question: What is the character set and collation of such a string?

For simple functions that take string input and return a string result as output, the output's character set and collation are the same as those of the principal input value. For example, `UPPER(X)` returns a string with the same character string and collation as *`X`*. The same applies for `INSTR()`, `LCASE()`, `LOWER()`, `LTRIM()`, `MID()`, `REPEAT()`, `REPLACE()`, `REVERSE()`, `RIGHT()`, `RPAD()`, `RTRIM()`, `SOUNDEX()`, `SUBSTRING()`, `TRIM()`, `UCASE()`, and `UPPER()`.

Note

The `REPLACE()` function, unlike all other functions, always ignores the collation of the string input and performs a case-sensitive comparison.

If a string input or function result is a binary string, the string has the `binary` character set and collation. This can be checked by using the `CHARSET()` and `COLLATION()` functions, both of which return `binary` for a binary string argument:

```sql
mysql> SELECT CHARSET(BINARY 'a'), COLLATION(BINARY 'a');
+---------------------+-----------------------+
| CHARSET(BINARY 'a') | COLLATION(BINARY 'a') |
+---------------------+-----------------------+
| binary              | binary                |
+---------------------+-----------------------+
```

For operations that combine multiple string inputs and return a single string output, the “aggregation rules” of standard SQL apply for determining the collation of the result:

* If an explicit `COLLATE Y` occurs, use *`Y`*.

* If explicit `COLLATE Y` and `COLLATE Z` occur, raise an error.

* Otherwise, if all collations are *`Y`*, use *`Y`*.

* Otherwise, the result has no collation.

For example, with `CASE ... WHEN a THEN b WHEN b THEN c COLLATE X END`, the resulting collation is *`X`*. The same applies for `UNION`, `||`, `CONCAT()`, `ELT()`, `GREATEST()`, `IF()`, and `LEAST()`.

For operations that convert to character data, the character set and collation of the strings that result from the operations are defined by the `character_set_connection` and `collation_connection` system variables that determine the default connection character set and collation (see Section 10.4, “Connection Character Sets and Collations”). This applies only to `CAST()`, `CONV()`, `FORMAT()`, `HEX()`, and `SPACE()`.

As of MySQL 5.7.19, an exception to the preceding principle occurs for expressions for virtual generated columns. In such expressions, the table character set is used for `CONV()` or `HEX()` results, regardless of connection character set.

If there is any question about the character set or collation of the result returned by a string function, use the `CHARSET()` or `COLLATION()` function to find out:

```sql
mysql> SELECT USER(), CHARSET(USER()), COLLATION(USER());
+----------------+-----------------+-------------------+
| USER()         | CHARSET(USER()) | COLLATION(USER()) |
+----------------+-----------------+-------------------+
| test@localhost | utf8            | utf8_general_ci   |
+----------------+-----------------+-------------------+
mysql> SELECT CHARSET(COMPRESS('abc')), COLLATION(COMPRESS('abc'));
+--------------------------+----------------------------+
| CHARSET(COMPRESS('abc')) | COLLATION(COMPRESS('abc')) |
+--------------------------+----------------------------+
| binary                   | binary                     |
+--------------------------+----------------------------+
```
