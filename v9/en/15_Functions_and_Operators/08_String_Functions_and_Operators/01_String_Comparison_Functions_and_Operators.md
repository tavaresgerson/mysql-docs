### 14.8.1 String Comparison Functions and Operators

**Table 14.13 String Comparison Functions and Operators**

<table frame="box" rules="all" summary="A reference that lists string comparison functions and operators."><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>LIKE</code></td> <td> Simple pattern matching </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negation of simple pattern matching </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compare two strings </td> </tr></tbody></table>

If a string function is given a binary string as an argument, the resulting string is also a binary string. A number converted to a string is treated as a binary string. This affects only comparisons.

Normally, if any expression in a string comparison is case-sensitive, the comparison is performed in case-sensitive fashion.

If a string function is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

* `expr LIKE pat [ESCAPE 'escape_char']`

  Pattern matching using an SQL pattern. Returns `1` (`TRUE`) or `0` (`FALSE`). If either *`expr`* or *`pat`* is `NULL`, the result is `NULL`.

  The pattern need not be a literal string. For example, it can be specified as a string expression or table column. In the latter case, the column must be defined as one of the MySQL string types (see Section 13.3, “String Data Types”).

  Per the SQL standard, `LIKE` performs matching on a per-character basis, thus it can produce results different from the `=` comparison operator:

  ```
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

  In particular, trailing spaces are always significant. This differs from comparisons performed with the `=` operator, for which the significance of trailing spaces in nonbinary strings (`CHAR`, `VARCHAR`, and `TEXT` values) depends on the pad attribute of the collation used for the comparison. For more information, see Trailing Space Handling in Comparisons.

  With `LIKE` you can use the following two wildcard characters in the pattern:

  + `%` matches any number of characters, even zero characters.

  + `_` matches exactly one character.

  ```
  mysql> SELECT 'David!' LIKE 'David_';
          -> 1
  mysql> SELECT 'David!' LIKE '%D%v%';
          -> 1
  ```

  To test for literal instances of a wildcard character, precede it by the escape character. If you do not specify the `ESCAPE` character, `\` is assumed, unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled. In that case, no escape character is used.

  + `\%` matches one `%` character.

  + `\_` matches one `_` character.

  ```
  mysql> SELECT 'David!' LIKE 'David\_';
          -> 0
  mysql> SELECT 'David_' LIKE 'David\_';
          -> 1
  ```

  To specify a different escape character, use the `ESCAPE` clause:

  ```
  mysql> SELECT 'David_' LIKE 'David|_' ESCAPE '|';
          -> 1
  ```

  The escape sequence should be one character long to specify the escape character, or empty to specify that no escape character is used. The expression must evaluate as a constant at execution time. If the `NO_BACKSLASH_ESCAPES` SQL mode is enabled, the sequence cannot be empty.

  The following statements illustrate that string comparisons are not case-sensitive unless one of the operands is case-sensitive (uses a case-sensitive collation or is a binary string):

  ```
  mysql> SELECT 'abc' LIKE 'ABC';
          -> 1
  mysql> SELECT 'abc' LIKE _utf8mb4 'ABC' COLLATE utf8mb4_0900_as_cs;
          -> 0
  mysql> SELECT 'abc' LIKE _utf8mb4 'ABC' COLLATE utf8mb4_bin;
          -> 0
  mysql> SELECT 'abc' LIKE BINARY 'ABC';
          -> 0
  ```

  As an extension to standard SQL, MySQL permits `LIKE` on numeric expressions.

  ```
  mysql> SELECT 10 LIKE '1%';
          -> 1
  ```

  MySQL attempts in such cases to perform implicit conversion of the expression to a string. See Section 14.3, “Type Conversion in Expression Evaluation”.

  Note

  MySQL uses C escape syntax in strings (for example, `\n` to represent the newline character). If you want a `LIKE` string to contain a literal `\`, you must double it. (Unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled, in which case no escape character is used.) For example, to search for `\n`, specify it as `\\n`. To search for `\`, specify it as `\\\\`; this is because the backslashes are stripped once by the parser and again when the pattern match is made, leaving a single backslash to be matched against.

  Exception: At the end of the pattern string, backslash can be specified as `\\`. At the end of the string, backslash stands for itself because there is nothing following to escape. Suppose that a table contains the following values:

  ```
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

  ```
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

* `expr NOT LIKE pat [ESCAPE 'escape_char']`

  This is the same as `NOT (expr LIKE pat [ESCAPE 'escape_char'])`.

  Note

  Aggregate queries involving `NOT LIKE` comparisons with columns containing `NULL` may yield unexpected results. For example, consider the following table and data:

  ```
  CREATE TABLE foo (bar VARCHAR(10));

  INSERT INTO foo VALUES (NULL), (NULL);
  ```

  The query `SELECT COUNT(*) FROM foo WHERE bar LIKE '%baz%';` returns `0`. You might assume that `SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%';` would return `2`. However, this is not the case: The second query returns `0`. This is because `NULL NOT LIKE expr` always returns `NULL`, regardless of the value of *`expr`*. The same is true for aggregate queries involving `NULL` and comparisons using `NOT RLIKE` or `NOT REGEXP`. In such cases, you must test explicitly for `NOT NULL` using `OR` (and not `AND`), as shown here:

  ```
  SELECT COUNT(*) FROM foo WHERE bar NOT LIKE '%baz%' OR bar IS NULL;
  ```

* `STRCMP(expr1,expr2)`

  `STRCMP()` returns `0` if the strings are the same, `-1` if the first argument is smaller than the second according to the current sort order, and `NULL` if either argument is `NULL`. It returns `1` otherwise.

  ```
  mysql> SELECT STRCMP('text', 'text2');
          -> -1
  mysql> SELECT STRCMP('text2', 'text');
          -> 1
  mysql> SELECT STRCMP('text', 'text');
          -> 0
  ```

  `STRCMP()` performs the comparison using the collation of the arguments.

  ```
  mysql> SET @s1 = _utf8mb4 'x' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s2 = _utf8mb4 'X' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s3 = _utf8mb4 'x' COLLATE utf8mb4_0900_as_cs;
  mysql> SET @s4 = _utf8mb4 'X' COLLATE utf8mb4_0900_as_cs;
  mysql> SELECT STRCMP(@s1, @s2), STRCMP(@s3, @s4);
  +------------------+------------------+
  | STRCMP(@s1, @s2) | STRCMP(@s3, @s4) |
  +------------------+------------------+
  |                0 |               -1 |
  +------------------+------------------+
  ```

  If the collations are incompatible, one of the arguments must be converted to be compatible with the other. See Section 12.8.4, “Collation Coercibility in Expressions”.

  ```
  mysql> SET @s1 = _utf8mb4 'x' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s2 = _utf8mb4 'X' COLLATE utf8mb4_0900_ai_ci;
  mysql> SET @s3 = _utf8mb4 'x' COLLATE utf8mb4_0900_as_cs;
  mysql> SET @s4 = _utf8mb4 'X' COLLATE utf8mb4_0900_as_cs;
  -->
  mysql> SELECT STRCMP(@s1, @s3);
  ERROR 1267 (HY000): Illegal mix of collations (utf8mb4_0900_ai_ci,IMPLICIT)
  and (utf8mb4_0900_as_cs,IMPLICIT) for operation 'strcmp'
  mysql> SELECT STRCMP(@s1, @s3 COLLATE utf8mb4_0900_ai_ci);
  +---------------------------------------------+
  | STRCMP(@s1, @s3 COLLATE utf8mb4_0900_ai_ci) |
  +---------------------------------------------+
  |                                           0 |
  +---------------------------------------------+
  ```
