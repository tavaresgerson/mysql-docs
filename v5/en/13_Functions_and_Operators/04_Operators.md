## 12.4 Operators

**Table 12.3 Operators**

<table frame="box" rules="all" summary="A reference that lists all operators."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th><code>&amp;</code></th> <td> Bitwise AND </td> <td></td> </tr><tr><th><code>&gt;</code></th> <td> Greater than operator </td> <td></td> </tr><tr><th><code>&gt;&gt;</code></th> <td> Right shift </td> <td></td> </tr><tr><th><code>&gt;=</code></th> <td> Greater than or equal operator </td> <td></td> </tr><tr><th><code>&lt;</code></th> <td> Less than operator </td> <td></td> </tr><tr><th><code>&lt;&gt;</code>, <code>!=</code></th> <td> Not equal operator </td> <td></td> </tr><tr><th><code>&lt;&lt;</code></th> <td> Left shift </td> <td></td> </tr><tr><th><code>&lt;=</code></th> <td> Less than or equal operator </td> <td></td> </tr><tr><th><code>&lt;=&gt;</code></th> <td> NULL-safe equal to operator </td> <td></td> </tr><tr><th><code>%</code>, <code>MOD</code></th> <td> Modulo operator </td> <td></td> </tr><tr><th><code>*</code></th> <td> Multiplication operator </td> <td></td> </tr><tr><th><code>+</code></th> <td> Addition operator </td> <td></td> </tr><tr><th><code>-</code></th> <td> Minus operator </td> <td></td> </tr><tr><th><code>-</code></th> <td> Change the sign of the argument </td> <td></td> </tr><tr><th><code>-&gt;</code></th> <td> Return value from JSON column after evaluating path; equivalent to JSON_EXTRACT(). </td> <td></td> </tr><tr><th><code>-&gt;&gt;</code></th> <td> Return value from JSON column after evaluating path and unquoting the result; equivalent to JSON_UNQUOTE(JSON_EXTRACT()). </td> <td>5.7.13</td> </tr><tr><th><code>/</code></th> <td> Division operator </td> <td></td> </tr><tr><th><code>:=</code></th> <td> Assign a value </td> <td></td> </tr><tr><th><code>=</code></th> <td> Assign a value (as part of a <code>SET</code> statement, or as part of the <code>SET</code> clause in an <code>UPDATE</code> statement) </td> <td></td> </tr><tr><th><code>=</code></th> <td> Equal operator </td> <td></td> </tr><tr><th><code>^</code></th> <td> Bitwise XOR </td> <td></td> </tr><tr><th><code>AND</code>, <code>&amp;&amp;</code></th> <td> Logical AND </td> <td></td> </tr><tr><th><code>BETWEEN ... AND ...</code></th> <td> Whether a value is within a range of values </td> <td></td> </tr><tr><th><code>BINARY</code></th> <td> Cast a string to a binary string </td> <td></td> </tr><tr><th><code>CASE</code></th> <td> Case operator </td> <td></td> </tr><tr><th><code>DIV</code></th> <td> Integer division </td> <td></td> </tr><tr><th><code>EXISTS()</code></th> <td> Whether the result of a query contains any rows </td> <td></td> </tr><tr><th><code>IN()</code></th> <td> Whether a value is within a set of values </td> <td></td> </tr><tr><th><code>IS</code></th> <td> Test a value against a boolean </td> <td></td> </tr><tr><th><code>IS NOT</code></th> <td> Test a value against a boolean </td> <td></td> </tr><tr><th><code>IS NOT NULL</code></th> <td> NOT NULL value test </td> <td></td> </tr><tr><th><code>IS NULL</code></th> <td> NULL value test </td> <td></td> </tr><tr><th><code>LIKE</code></th> <td> Simple pattern matching </td> <td></td> </tr><tr><th><code>NOT</code>, <code>!</code></th> <td> Negates value </td> <td></td> </tr><tr><th><code>NOT BETWEEN ... AND ...</code></th> <td> Whether a value is not within a range of values </td> <td></td> </tr><tr><th><code>NOT EXISTS()</code></th> <td> Whether the result of a query contains no rows </td> <td></td> </tr><tr><th><code>NOT IN()</code></th> <td> Whether a value is not within a set of values </td> <td></td> </tr><tr><th><code>NOT LIKE</code></th> <td> Negation of simple pattern matching </td> <td></td> </tr><tr><th><code>NOT REGEXP</code></th> <td> Negation of REGEXP </td> <td></td> </tr><tr><th><code>OR</code>, <code>||</code></th> <td> Logical OR </td> <td></td> </tr><tr><th><code>REGEXP</code></th> <td> Whether string matches regular expression </td> <td></td> </tr><tr><th><code>RLIKE</code></th> <td> Whether string matches regular expression </td> <td></td> </tr><tr><th><code>SOUNDS LIKE</code></th> <td> Compare sounds </td> <td></td> </tr><tr><th><code>XOR</code></th> <td> Logical XOR </td> <td></td> </tr><tr><th><code>|</code></th> <td> Bitwise OR </td> <td></td> </tr><tr><th><code>~</code></th> <td> Bitwise inversion </td> <td></td> </tr></tbody></table>


### 12.4.1 Operator Precedence

Operator precedences are shown in the following list, from highest precedence to the lowest. Operators that are shown together on a line have the same precedence.

```sql
INTERVAL
BINARY, COLLATE
!
- (unary minus), ~ (unary bit inversion)
^
*, /, DIV, %, MOD
-, +
<<, >>
&
|
= (comparison), <=>, >=, >, <=, <, <>, !=, IS, LIKE, REGEXP, IN
BETWEEN, CASE, WHEN, THEN, ELSE
NOT
AND, &&
XOR
OR, ||
= (assignment), :=
```

The precedence of `=` depends on whether it is used as a comparison operator (`=`) or as an assignment operator (`=`). When used as a comparison operator, it has the same precedence as `<=>`, `>=`, `>`, `<=`, `<`, `<>`, `!=`, `IS`, `LIKE`, `REGEXP`, and `IN()`. When used as an assignment operator, it has the same precedence as `:=`. Section 13.7.4.1, “SET Syntax for Variable Assignment”, and Section 9.4, “User-Defined Variables”, explain how MySQL determines which interpretation of `=` should apply.

For operators that occur at the same precedence level within an expression, evaluation proceeds left to right, with the exception that assignments evaluate right to left.

The precedence and meaning of some operators depends on the SQL mode:

* By default, `||` is a logical `OR` operator. With `PIPES_AS_CONCAT` enabled, `||` is string concatenation, with a precedence between `^` and the unary operators.

* By default, `!` has a higher precedence than `NOT`. With `HIGH_NOT_PRECEDENCE` enabled, `!` and `NOT` have the same precedence.

See Section 5.1.10, “Server SQL Modes”.

The precedence of operators determines the order of evaluation of terms in an expression. To override this order and group terms explicitly, use parentheses. For example:

```sql
mysql> SELECT 1+2*3;
        -> 7
mysql> SELECT (1+2)*3;
        -> 9
```


### 12.4.2 Comparison Functions and Operators

**Table 12.4 Comparison Operators**

<table frame="box" rules="all" summary="A reference that lists comparison operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>&gt;</code></td> <td> Greater than operator </td> </tr><tr><td><code>&gt;=</code></td> <td> Greater than or equal operator </td> </tr><tr><td><code>&lt;</code></td> <td> Less than operator </td> </tr><tr><td><code>&lt;&gt;</code>, <code>!=</code></td> <td> Not equal operator </td> </tr><tr><td><code>&lt;=</code></td> <td> Less than or equal operator </td> </tr><tr><td><code>&lt;=&gt;</code></td> <td> NULL-safe equal to operator </td> </tr><tr><td><code>=</code></td> <td> Equal operator </td> </tr><tr><td><code>BETWEEN ... AND ...</code></td> <td> Whether a value is within a range of values </td> </tr><tr><td><code>COALESCE()</code></td> <td> Return the first non-NULL argument </td> </tr><tr><td><code>EXISTS()</code></td> <td> Whether the result of a query contains any rows </td> </tr><tr><td><code>GREATEST()</code></td> <td> Return the largest argument </td> </tr><tr><td><code>IN()</code></td> <td> Whether a value is within a set of values </td> </tr><tr><td><code>INTERVAL()</code></td> <td> Return the index of the argument that is less than the first argument </td> </tr><tr><td><code>IS</code></td> <td> Test a value against a boolean </td> </tr><tr><td><code>IS NOT</code></td> <td> Test a value against a boolean </td> </tr><tr><td><code>IS NOT NULL</code></td> <td> NOT NULL value test </td> </tr><tr><td><code>IS NULL</code></td> <td> NULL value test </td> </tr><tr><td><code>ISNULL()</code></td> <td> Test whether the argument is NULL </td> </tr><tr><td><code>LEAST()</code></td> <td> Return the smallest argument </td> </tr><tr><td><code>LIKE</code></td> <td> Simple pattern matching </td> </tr><tr><td><code>NOT BETWEEN ... AND ...</code></td> <td> Whether a value is not within a range of values </td> </tr><tr><td><code>NOT EXISTS()</code></td> <td> Whether the result of a query contains no rows </td> </tr><tr><td><code>NOT IN()</code></td> <td> Whether a value is not within a set of values </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negation of simple pattern matching </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compare two strings </td> </tr></tbody></table>

Comparison operations result in a value of `1` (`TRUE`), `0` (`FALSE`), or `NULL`. These operations work for both numbers and strings. Strings are automatically converted to numbers and numbers to strings as necessary.

The following relational comparison operators can be used to compare not only scalar operands, but row operands:

```sql
=  >  <  >=  <=  <>  !=
```

The descriptions for those operators later in this section detail how they work with row operands. For additional examples of row comparisons in the context of row subqueries, see Section 13.2.10.5, “Row Subqueries”.

Some of the functions in this section return values other than `1` (`TRUE`), `0` (`FALSE`), or `NULL`. `LEAST()` and `GREATEST()` are examples of such functions; Section 12.3, “Type Conversion in Expression Evaluation”, describes the rules for comparison operations performed by these and similar functions for determining their return values.

To convert a value to a specific type for comparison purposes, you can use the `CAST()` function. String values can be converted to a different character set using `CONVERT()`. See Section 12.10, “Cast Functions and Operators”.

By default, string comparisons are not case-sensitive and use the current character set. The default is `latin1` (cp1252 West European), which also works well for English.

* `=`

  Equal:

  ```sql
  mysql> SELECT 1 = 0;
          -> 0
  mysql> SELECT '0' = 0;
          -> 1
  mysql> SELECT '0.0' = 0;
          -> 1
  mysql> SELECT '0.01' = 0;
          -> 0
  mysql> SELECT '.01' = 0.01;
          -> 1
  ```

  For row comparisons, `(a, b) = (x, y)` is equivalent to:

  ```sql
  (a = x) AND (b = y)
  ```

* `<=>`

  `NULL`-safe equal. This operator performs an equality comparison like the `=` operator, but returns `1` rather than `NULL` if both operands are `NULL`, and `0` rather than `NULL` if one operand is `NULL`.

  The `<=>` operator is equivalent to the standard SQL `IS NOT DISTINCT FROM` operator.

  ```sql
  mysql> SELECT 1 <=> 1, NULL <=> NULL, 1 <=> NULL;
          -> 1, 1, 0
  mysql> SELECT 1 = 1, NULL = NULL, 1 = NULL;
          -> 1, NULL, NULL
  ```

  For row comparisons, `(a, b) <=> (x, y)` is equivalent to:

  ```sql
  (a <=> x) AND (b <=> y)
  ```

* `<>`, `!=`

  Not equal:

  ```sql
  mysql> SELECT '.01' <> '0.01';
          -> 1
  mysql> SELECT .01 <> '0.01';
          -> 0
  mysql> SELECT 'zapp' <> 'zappp';
          -> 1
  ```

  For row comparisons, `(a, b) <> (x, y)` and `(a, b) != (x, y)` are equivalent to:

  ```sql
  (a <> x) OR (b <> y)
  ```

* `<=`

  Less than or equal:

  ```sql
  mysql> SELECT 0.1 <= 2;
          -> 1
  ```

  For row comparisons, `(a, b) <= (x, y)` is equivalent to:

  ```sql
  (a < x) OR ((a = x) AND (b <= y))
  ```

* `<`

  Less than:

  ```sql
  mysql> SELECT 2 < 2;
          -> 0
  ```

  For row comparisons, `(a, b) < (x, y)` is equivalent to:

  ```sql
  (a < x) OR ((a = x) AND (b < y))
  ```

* `>=`

  Greater than or equal:

  ```sql
  mysql> SELECT 2 >= 2;
          -> 1
  ```

  For row comparisons, `(a, b) >= (x, y)` is equivalent to:

  ```sql
  (a > x) OR ((a = x) AND (b >= y))
  ```

* `>`

  Greater than:

  ```sql
  mysql> SELECT 2 > 2;
          -> 0
  ```

  For row comparisons, `(a, b) > (x, y)` is equivalent to:

  ```sql
  (a > x) OR ((a = x) AND (b > y))
  ```

* [`expr BETWEEN min AND max`](comparison-operators.html#operator_between)

  If *`expr`* is greater than or equal to *`min`* and *`expr`* is less than or equal to *`max`*, `BETWEEN` returns `1`, otherwise it returns `0`. This is equivalent to the expression `(min <= expr AND expr <= max)` if all the arguments are of the same type. Otherwise type conversion takes place according to the rules described in Section 12.3, “Type Conversion in Expression Evaluation”, but applied to all the three arguments.

  ```sql
  mysql> SELECT 2 BETWEEN 1 AND 3, 2 BETWEEN 3 and 1;
          -> 1, 0
  mysql> SELECT 1 BETWEEN 2 AND 3;
          -> 0
  mysql> SELECT 'b' BETWEEN 'a' AND 'c';
          -> 1
  mysql> SELECT 2 BETWEEN 2 AND '3';
          -> 1
  mysql> SELECT 2 BETWEEN 2 AND 'x-3';
          -> 0
  ```

  For best results when using `BETWEEN` with date or time values, use `CAST()` to explicitly convert the values to the desired data type. Examples: If you compare a `DATETIME` to two `DATE` values, convert the `DATE` values to `DATETIME` values. If you use a string constant such as `'2001-1-1'` in a comparison to a `DATE`, cast the string to a `DATE`.

* [`expr NOT BETWEEN min AND max`](comparison-operators.html#operator_not-between)

  This is the same as `NOT (expr BETWEEN min AND max)`.

* `COALESCE(value,...)`

  Returns the first non-`NULL` value in the list, or `NULL` if there are no non-`NULL` values.

  The return type of `COALESCE()` is the aggregated type of the argument types.

  ```sql
  mysql> SELECT COALESCE(NULL,1);
          -> 1
  mysql> SELECT COALESCE(NULL,NULL,NULL);
          -> NULL
  ```

* `EXISTS(query)`

  Whether the result of a query contains any rows.

  ```sql
  CREATE TABLE t (col VARCHAR(3));
  INSERT INTO t VALUES ('aaa', 'bbb', 'ccc', 'eee');

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 1

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 0
  ```

* [`NOT EXISTS(query)`](comparison-operators.html#operator_not-exists)

  Whether the result of a query contains no rows:

  ```sql
  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 0

  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 1
  ```

* `GREATEST(value1,value2,...)`

  With two or more arguments, returns the largest (maximum-valued) argument. The arguments are compared using the same rules as for `LEAST()`.

  ```sql
  mysql> SELECT GREATEST(2,0);
          -> 2
  mysql> SELECT GREATEST(34.0,3.0,5.0,767.0);
          -> 767.0
  mysql> SELECT GREATEST('B','A','C');
          -> 'C'
  ```

  `GREATEST()` returns `NULL` if any argument is `NULL`.

* [`expr IN (value,...)`](comparison-operators.html#operator_in)

  Returns `1` (true) if *`expr`* is equal to any of the values in the `IN()` list, else returns `0` (false).

  Type conversion takes place according to the rules described in Section 12.3, “Type Conversion in Expression Evaluation”, applied to all the arguments. If no type conversion is needed for the values in the `IN()` list, they are all constants of the same type, and *`expr`* can be compared to each of them as a value of the same type (possibly after type conversion), an optimization takes place. The values the list are sorted and the search for *`expr`* is done using a binary search, which makes the `IN()` operation very quick.

  ```sql
  mysql> SELECT 2 IN (0,3,5,7);
          -> 0
  mysql> SELECT 'wefwf' IN ('wee','wefwf','weg');
          -> 1
  ```

  `IN()` can be used to compare row constructors:

  ```sql
  mysql> SELECT (3,4) IN ((1,2), (3,4));
          -> 1
  mysql> SELECT (3,4) IN ((1,2), (3,5));
          -> 0
  ```

  You should never mix quoted and unquoted values in an `IN()` list because the comparison rules for quoted values (such as strings) and unquoted values (such as numbers) differ. Mixing types may therefore lead to inconsistent results. For example, do not write an `IN()` expression like this:

  ```sql
  SELECT val1 FROM tbl1 WHERE val1 IN (1,2,'a');
  ```

  Instead, write it like this:

  ```sql
  SELECT val1 FROM tbl1 WHERE val1 IN ('1','2','a');
  ```

  Implicit type conversion may produce nonintuitive results:

  ```sql
  mysql> SELECT 'a' IN (0), 0 IN ('b');
          -> 1, 1
  ```

  In both cases, the comparison values are converted to floating-point values, yielding 0.0 in each case, and a comparison result of 1 (true).

  The number of values in the `IN()` list is only limited by the `max_allowed_packet` value.

  To comply with the SQL standard, `IN()` returns `NULL` not only if the expression on the left hand side is `NULL`, but also if no match is found in the list and one of the expressions in the list is `NULL`.

  `IN()` syntax can also be used to write certain types of subqueries. See Section 13.2.10.3, “Subqueries with ANY, IN, or SOME”.

* [`expr NOT IN (value,...)`](comparison-operators.html#operator_not-in)

  This is the same as `NOT (expr IN (value,...))`.

* `INTERVAL(N,N1,N2,N3,...)`

  Returns `0` if *`N`* ≤ *`N1`*, `1` if *`N`* ≤ *`N2`* and so on, or `-1` if *`N`* is `NULL`. All arguments are treated as integers. It is required that *`N1`* ≤ *`N2`* ≤ *`N3`* ≤ `...` ≤ *`Nn`* for this function to work correctly. This is because a binary search is used (very fast).

  ```sql
  mysql> SELECT INTERVAL(23, 1, 15, 17, 30, 44, 200);
          -> 3
  mysql> SELECT INTERVAL(10, 1, 10, 100, 1000);
          -> 2
  mysql> SELECT INTERVAL(22, 23, 30, 44, 200);
          -> 0
  ```

* [`IS boolean_value`](comparison-operators.html#operator_is)

  Tests a value against a boolean value, where *`boolean_value`* can be `TRUE`, `FALSE`, or `UNKNOWN`.

  ```sql
  mysql> SELECT 1 IS TRUE, 0 IS FALSE, NULL IS UNKNOWN;
          -> 1, 1, 1
  ```

* [`IS NOT boolean_value`](comparison-operators.html#operator_is-not)

  Tests a value against a boolean value, where *`boolean_value`* can be `TRUE`, `FALSE`, or `UNKNOWN`.

  ```sql
  mysql> SELECT 1 IS NOT UNKNOWN, 0 IS NOT UNKNOWN, NULL IS NOT UNKNOWN;
          -> 1, 1, 0
  ```

* `IS NULL`

  Tests whether a value is `NULL`.

  ```sql
  mysql> SELECT 1 IS NULL, 0 IS NULL, NULL IS NULL;
          -> 0, 0, 1
  ```

  To work well with ODBC programs, MySQL supports the following extra features when using [`IS NULL`](comparison-operators.html#operator_is-null):

  + If `sql_auto_is_null` variable is set to 1, then after a statement that successfully inserts an automatically generated `AUTO_INCREMENT` value, you can find that value by issuing a statement of the following form:

    ```sql
    SELECT * FROM tbl_name WHERE auto_col IS NULL
    ```

    If the statement returns a row, the value returned is the same as if you invoked the `LAST_INSERT_ID()` function. For details, including the return value after a multiple-row insert, see Section 12.15, “Information Functions”. If no `AUTO_INCREMENT` value was successfully inserted, the `SELECT` statement returns no row.

    The behavior of retrieving an `AUTO_INCREMENT` value by using an `IS NULL` comparison can be disabled by setting `sql_auto_is_null = 0`. See Section 5.1.7, “Server System Variables”.

    The default value of `sql_auto_is_null` is 0.

  + For `DATE` and `DATETIME` columns that are declared as `NOT NULL`, you can find the special date `'0000-00-00'` by using a statement like this:

    ```sql
    SELECT * FROM tbl_name WHERE date_column IS NULL
    ```

    This is needed to get some ODBC applications to work because ODBC does not support a `'0000-00-00'` date value.

    See Obtaining Auto-Increment Values, and the description for the `FLAG_AUTO_IS_NULL` option at Connector/ODBC Connection Parameters.

* `IS NOT NULL`

  Tests whether a value is not `NULL`.

  ```sql
  mysql> SELECT 1 IS NOT NULL, 0 IS NOT NULL, NULL IS NOT NULL;
          -> 1, 1, 0
  ```

* `ISNULL(expr)`

  If *`expr`* is `NULL`, `ISNULL()` returns `1`, otherwise it returns `0`.

  ```sql
  mysql> SELECT ISNULL(1+1);
          -> 0
  mysql> SELECT ISNULL(1/0);
          -> 1
  ```

  `ISNULL()` can be used instead of `=` to test whether a value is `NULL`. (Comparing a value to `NULL` using `=` always yields `NULL`.)

  The `ISNULL()` function shares some special behaviors with the `IS NULL` comparison operator. See the description of `IS NULL`.

* `LEAST(value1,value2,...)`

  With two or more arguments, returns the smallest (minimum-valued) argument. The arguments are compared using the following rules:

  + If any argument is `NULL`, the result is `NULL`. No comparison is needed.

  + If all arguments are integer-valued, they are compared as integers.

  + If at least one argument is double precision, they are compared as double-precision values. Otherwise, if at least one argument is a `DECIMAL` - DECIMAL, NUMERIC") value, they are compared as `DECIMAL` - DECIMAL, NUMERIC") values.

  + If the arguments comprise a mix of numbers and strings, they are compared as numbers.

  + If any argument is a nonbinary (character) string, the arguments are compared as nonbinary strings.

  + In all other cases, the arguments are compared as binary strings.

  The return type of `LEAST()` is the aggregated type of the comparison argument types.

  ```sql
  mysql> SELECT LEAST(2,0);
          -> 0
  mysql> SELECT LEAST(34.0,3.0,5.0,767.0);
          -> 3.0
  mysql> SELECT LEAST('B','A','C');
          -> 'A'
  ```


### 12.4.3 Logical Operators

**Table 12.5 Logical Operators**

<table frame="box" rules="all" summary="A reference that lists logical operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>AND</code>, <code>&amp;&amp;</code></td> <td> Logical AND </td> </tr><tr><td><code>NOT</code>, <code>!</code></td> <td> Negates value </td> </tr><tr><td><code>OR</code>, <code>||</code></td> <td> Logical OR </td> </tr><tr><td><code>XOR</code></td> <td> Logical XOR </td> </tr></tbody></table>

In SQL, all logical operators evaluate to `TRUE`, `FALSE`, or `NULL` (`UNKNOWN`). In MySQL, these are implemented as 1 (`TRUE`), 0 (`FALSE`), and `NULL`. Most of this is common to different SQL database servers, although some servers may return any nonzero value for `TRUE`.

MySQL evaluates any nonzero, non-`NULL` value to `TRUE`. For example, the following statements all assess to `TRUE`:

```sql
mysql> SELECT 10 IS TRUE;
-> 1
mysql> SELECT -10 IS TRUE;
-> 1
mysql> SELECT 'string' IS NOT NULL;
-> 1
```

* `NOT`, `!`

  Logical NOT. Evaluates to `1` if the operand is `0`, to `0` if the operand is nonzero, and `NOT NULL` returns `NULL`.

  ```sql
  mysql> SELECT NOT 10;
          -> 0
  mysql> SELECT NOT 0;
          -> 1
  mysql> SELECT NOT NULL;
          -> NULL
  mysql> SELECT ! (1+1);
          -> 0
  mysql> SELECT ! 1+1;
          -> 1
  ```

  The last example produces `1` because the expression evaluates the same way as `(!1)+1`.

* `AND`, `&&`

  Logical AND. Evaluates to `1` if all operands are nonzero and not `NULL`, to `0` if one or more operands are `0`, otherwise `NULL` is returned.

  ```sql
  mysql> SELECT 1 AND 1;
          -> 1
  mysql> SELECT 1 AND 0;
          -> 0
  mysql> SELECT 1 AND NULL;
          -> NULL
  mysql> SELECT 0 AND NULL;
          -> 0
  mysql> SELECT NULL AND 0;
          -> 0
  ```

* `OR`, `||`

  Logical OR. When both operands are non-`NULL`, the result is `1` if any operand is nonzero, and `0` otherwise. With a `NULL` operand, the result is `1` if the other operand is nonzero, and `NULL` otherwise. If both operands are `NULL`, the result is `NULL`.

  ```sql
  mysql> SELECT 1 OR 1;
          -> 1
  mysql> SELECT 1 OR 0;
          -> 1
  mysql> SELECT 0 OR 0;
          -> 0
  mysql> SELECT 0 OR NULL;
          -> NULL
  mysql> SELECT 1 OR NULL;
          -> 1
  ```

  Note

  If the `PIPES_AS_CONCAT` SQL mode is enabled, `||` signifies the SQL-standard string concatenation operator (like `CONCAT()`).

* `XOR`

  Logical XOR. Returns `NULL` if either operand is `NULL`. For non-`NULL` operands, evaluates to `1` if an odd number of operands is nonzero, otherwise `0` is returned.

  ```sql
  mysql> SELECT 1 XOR 1;
          -> 0
  mysql> SELECT 1 XOR 0;
          -> 1
  mysql> SELECT 1 XOR NULL;
          -> NULL
  mysql> SELECT 1 XOR 1 XOR 1;
          -> 1
  ```

  `a XOR b` is mathematically equal to `(a AND (NOT b)) OR ((NOT a) and b)`.


### 12.4.4 Assignment Operators

**Table 12.6 Assignment Operators**

<table frame="box" rules="all" summary="A reference that lists assignment operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>:=</code></td> <td> Assign a value </td> </tr><tr><td><code>=</code></td> <td> Assign a value (as part of a <code>SET</code> statement, or as part of the <code>SET</code> clause in an <code>UPDATE</code> statement) </td> </tr></tbody></table>

* `:=`

  Assignment operator. Causes the user variable on the left hand side of the operator to take on the value to its right. The value on the right hand side may be a literal value, another variable storing a value, or any legal expression that yields a scalar value, including the result of a query (provided that this value is a scalar value). You can perform multiple assignments in the same `SET` statement. You can perform multiple assignments in the same statement.

  Unlike `=`, the `:=` operator is never interpreted as a comparison operator. This means you can use `:=` in any valid SQL statement (not just in `SET` statements) to assign a value to a variable.

  ```sql
  mysql> SELECT @var1, @var2;
          -> NULL, NULL
  mysql> SELECT @var1 := 1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2 := @var1;
          -> 1, 1
  mysql> SELECT @var1, @var2;
          -> 1, 1

  mysql> SELECT @var1:=COUNT(*) FROM t1;
          -> 4
  mysql> SELECT @var1;
          -> 4
  ```

  You can make value assignments using `:=` in other statements besides `SELECT`, such as `UPDATE`, as shown here:

  ```sql
  mysql> SELECT @var1;
          -> 4
  mysql> SELECT * FROM t1;
          -> 1, 3, 5, 7

  mysql> UPDATE t1 SET c1 = 2 WHERE c1 = @var1:= 1;
  Query OK, 1 row affected (0.00 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT @var1;
          -> 1
  mysql> SELECT * FROM t1;
          -> 2, 3, 5, 7
  ```

  While it is also possible both to set and to read the value of the same variable in a single SQL statement using the `:=` operator, this is not recommended. Section 9.4, “User-Defined Variables”, explains why you should avoid doing this.

* `=`

  This operator is used to perform value assignments in two cases, described in the next two paragraphs.

  Within a `SET` statement, `=` is treated as an assignment operator that causes the user variable on the left hand side of the operator to take on the value to its right. (In other words, when used in a `SET` statement, `=` is treated identically to `:=`.) The value on the right hand side may be a literal value, another variable storing a value, or any legal expression that yields a scalar value, including the result of a query (provided that this value is a scalar value). You can perform multiple assignments in the same `SET` statement.

  In the `SET` clause of an `UPDATE` statement, `=` also acts as an assignment operator; in this case, however, it causes the column named on the left hand side of the operator to assume the value given to the right, provided any `WHERE` conditions that are part of the `UPDATE` are met. You can make multiple assignments in the same `SET` clause of an `UPDATE` statement.

  In any other context, `=` is treated as a comparison operator.

  ```sql
  mysql> SELECT @var1, @var2;
          -> NULL, NULL
  mysql> SELECT @var1 := 1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2;
          -> 1, NULL
  mysql> SELECT @var1, @var2 := @var1;
          -> 1, 1
  mysql> SELECT @var1, @var2;
          -> 1, 1
  ```

  For more information, see Section 13.7.4.1, “SET Syntax for Variable Assignment”, Section 13.2.11, “UPDATE Statement”, and Section 13.2.10, “Subqueries”.
