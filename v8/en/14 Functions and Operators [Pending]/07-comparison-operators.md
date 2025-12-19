--- title: MySQL 8.4 Reference Manual :: 14.4.2 Comparison Functions and Operators url: https://dev.mysql.com/doc/refman/8.4/en/comparison-operators.html order: 7 ---



### 14.4.2 Comparison Functions and Operators

**Table 14.4 Comparison Operators**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>&gt;</code></td> <td> Greater than operator </td> </tr><tr><td><code>&gt;=</code></td> <td> Greater than or equal operator </td> </tr><tr><td><code>&lt;</code></td> <td> Less than operator </td> </tr><tr><td><code>&lt;&gt;</code>, <code>!=</code></td> <td> Not equal operator </td> </tr><tr><td><code>&lt;=</code></td> <td> Less than or equal operator </td> </tr><tr><td><code>&lt;=&gt;</code></td> <td> NULL-safe equal to operator </td> </tr><tr><td><code>=</code></td> <td> Equal operator </td> </tr><tr><td><code>BETWEEN ... AND ...</code></td> <td> Whether a value is within a range of values </td> </tr><tr><td><code>COALESCE()</code></td> <td> Return the first non-NULL argument </td> </tr><tr><td><code>EXISTS()</code></td> <td> Whether the result of a query contains any rows </td> </tr><tr><td><code>GREATEST()</code></td> <td> Return the largest argument </td> </tr><tr><td><code>IN()</code></td> <td> Whether a value is within a set of values </td> </tr><tr><td><code>INTERVAL()</code></td> <td> Return the index of the argument that is less than the first argument </td> </tr><tr><td><code>IS</code></td> <td> Test a value against a boolean </td> </tr><tr><td><code>IS NOT</code></td> <td> Test a value against a boolean </td> </tr><tr><td><code>IS NOT NULL</code></td> <td> NOT NULL value test </td> </tr><tr><td><code>IS NULL</code></td> <td> NULL value test </td> </tr><tr><td><code>ISNULL()</code></td> <td> Test whether the argument is NULL </td> </tr><tr><td><code>LEAST()</code></td> <td> Return the smallest argument </td> </tr><tr><td><code>LIKE</code></td> <td> Simple pattern matching </td> </tr><tr><td><code>NOT BETWEEN ... AND ...</code></td> <td> Whether a value is not within a range of values </td> </tr><tr><td><code>NOT EXISTS()</code></td> <td> Whether the result of a query contains no rows </td> </tr><tr><td><code>NOT IN()</code></td> <td> Whether a value is not within a set of values </td> </tr><tr><td><code>NOT LIKE</code></td> <td> Negation of simple pattern matching </td> </tr><tr><td><code>STRCMP()</code></td> <td> Compare two strings </td> </tr></tbody></table>

Comparison operations result in a value of `1` (`TRUE`), `0` (`FALSE`), or `NULL`. These operations work for both numbers and strings. Strings are automatically converted to numbers and numbers to strings as necessary.

The following relational comparison operators can be used to compare not only scalar operands, but row operands:

```
=  >  <  >=  <=  <>  !=
```

The descriptions for those operators later in this section detail how they work with row operands. For additional examples of row comparisons in the context of row subqueries, see Section 15.2.15.5, “Row Subqueries”.

Some of the functions in this section return values other than `1` (`TRUE`), `0` (`FALSE`), or `NULL`.  `LEAST()` and  `GREATEST()` are examples of such functions;  Section 14.3, “Type Conversion in Expression Evaluation”, describes the rules for comparison operations performed by these and similar functions for determining their return values.

::: info Note

In previous versions of MySQL, when evaluating an expression containing `LEAST()` or `GREATEST()`, the server attempted to guess the context in which the function was used, and to coerce the function's arguments to the data type of the expression as a whole. For example, the arguments to `LEAST("11", "45", "2")` are evaluated and sorted as strings, so that this expression returns `"11"`.

The function is executed using the arguments as provided, performing data type conversions to one or more of the arguments if and only if they are not all of the same type. Any type coercion mandated by an expression that makes use of the return value is now performed following function execution. This means that `LEAST("11", "45", "2") + 0` evaluates to `"11" + 0` and thus to integer 11.


:::

To convert a value to a specific type for comparison purposes, you can use the  `CAST()` function. String values can be converted to a different character set using  `CONVERT()`. See Section 14.10, “Cast Functions and Operators”.

By default, string comparisons are not case-sensitive and use the current character set. The default is `utf8mb4`.

*  `=`

  Equal:

  ```
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

  ```
  (a = x) AND (b = y)
  ```
*  `<=>`

  `NULL`-safe equal. This operator performs an equality comparison like the `=` operator, but returns `1` rather than `NULL` if both operands are `NULL`, and `0` rather than `NULL` if one operand is `NULL`.

  The `<=>` operator is equivalent to the standard SQL `IS NOT DISTINCT FROM` operator.

  ```
  mysql> SELECT 1 <=> 1, NULL <=> NULL, 1 <=> NULL;
          -> 1, 1, 0
  mysql> SELECT 1 = 1, NULL = NULL, 1 = NULL;
          -> 1, NULL, NULL
  ```

  For row comparisons, `(a, b) <=> (x, y)` is equivalent to:

  ```
  (a <=> x) AND (b <=> y)
  ```
*  `<>`, `!=`

  Not equal:

  ```
  mysql> SELECT '.01' <> '0.01';
          -> 1
  mysql> SELECT .01 <> '0.01';
          -> 0
  mysql> SELECT 'zapp' <> 'zappp';
          -> 1
  ```

  For row comparisons, `(a, b) <> (x, y)` and `(a, b) != (x, y)` are equivalent to:

  ```
  (a <> x) OR (b <> y)
  ```
*  `<=`

  Less than or equal:

  ```
  mysql> SELECT 0.1 <= 2;
          -> 1
  ```

  For row comparisons, `(a, b) <= (x, y)` is equivalent to:

  ```
  (a < x) OR ((a = x) AND (b <= y))
  ```
*  `<`

  Less than:

  ```
  mysql> SELECT 2 < 2;
          -> 0
  ```

  For row comparisons, `(a, b) < (x, y)` is equivalent to:

  ```
  (a < x) OR ((a = x) AND (b < y))
  ```
*  `>=`

  Greater than or equal:

  ```
  mysql> SELECT 2 >= 2;
          -> 1
  ```

  For row comparisons, `(a, b) >= (x, y)` is equivalent to:

  ```
  (a > x) OR ((a = x) AND (b >= y))
  ```
*  `>`

  Greater than:

  ```
  mysql> SELECT 2 > 2;
          -> 0
  ```

  For row comparisons, `(a, b) > (x, y)` is equivalent to:

  ```
  (a > x) OR ((a = x) AND (b > y))
  ```
* [`expr BETWEEN min AND max`](comparison-operators.html#operator_between)

  If *`expr`* is greater than or equal to *`min`* and *`expr`* is less than or equal to *`max`*, `BETWEEN` returns `1`, otherwise it returns `0`. This is equivalent to the expression `(min <= expr AND expr <= max)` if all the arguments are of the same type. Otherwise type conversion takes place according to the rules described in Section 14.3, “Type Conversion in Expression Evaluation”, but applied to all the three arguments.

  ```
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

  For best results when using `BETWEEN` with date or time values, use  `CAST()` to explicitly convert the values to the desired data type. Examples: If you compare a `DATETIME` to two `DATE` values, convert the `DATE` values to `DATETIME` values. If you use a string constant such as `'2001-1-1'` in a comparison to a  `DATE`, cast the string to a  `DATE`.
* [`expr NOT BETWEEN min AND max`](comparison-operators.html#operator_not-between)

  This is the same as `NOT (expr BETWEEN min AND max)`.
*  `COALESCE(value,...)`

  Returns the first non-`NULL` value in the list, or `NULL` if there are no non-`NULL` values.

  The return type of  `COALESCE()` is the aggregated type of the argument types.

  ```
  mysql> SELECT COALESCE(NULL,1);
          -> 1
  mysql> SELECT COALESCE(NULL,NULL,NULL);
          -> NULL
  ```
*  `EXISTS(query)`

  Whether the result of a query contains any rows.

  ```
  CREATE TABLE t (col VARCHAR(3));
  INSERT INTO t VALUES ('aaa', 'bbb', 'ccc', 'eee');

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 1

  SELECT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 0
  ```
* [`NOT EXISTS(query)`](comparison-operators.html#operator_not-exists)

  Whether the result of a query contains no rows:

  ```
  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'c%');
          -> 0

  SELECT NOT EXISTS (SELECT * FROM t WHERE col LIKE 'd%');
          -> 1
  ```
*  `GREATEST(value1,value2,...)`

  With two or more arguments, returns the largest (maximum-valued) argument. The arguments are compared using the same rules as for `LEAST()`.

  ```
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

  Type conversion takes place according to the rules described in  Section 14.3, “Type Conversion in Expression Evaluation”, applied to all the arguments. If no type conversion is needed for the values in the `IN()` list, they are all non-`JSON` constants of the same type, and *`expr`* can be compared to each of them as a value of the same type (possibly after type conversion), an optimization takes place. The values the list are sorted and the search for *`expr`* is done using a binary search, which makes the `IN()` operation very quick.

  ```
  mysql> SELECT 2 IN (0,3,5,7);
          -> 0
  mysql> SELECT 'wefwf' IN ('wee','wefwf','weg');
          -> 1
  ```

  `IN()` can be used to compare row constructors:

  ```
  mysql> SELECT (3,4) IN ((1,2), (3,4));
          -> 1
  mysql> SELECT (3,4) IN ((1,2), (3,5));
          -> 0
  ```

  You should never mix quoted and unquoted values in an `IN()` list because the comparison rules for quoted values (such as strings) and unquoted values (such as numbers) differ. Mixing types may therefore lead to inconsistent results. For example, do not write an `IN()` expression like this:

  ```
  SELECT val1 FROM tbl1 WHERE val1 IN (1,2,'a');
  ```

  Instead, write it like this:

  ```
  SELECT val1 FROM tbl1 WHERE val1 IN ('1','2','a');
  ```

  Implicit type conversion may produce nonintuitive results:

  ```
  mysql> SELECT 'a' IN (0), 0 IN ('b');
          -> 1, 1
  ```

  In both cases, the comparison values are converted to floating-point values, yielding 0.0 in each case, and a comparison result of 1 (true).

  The number of values in the `IN()` list is only limited by the `max_allowed_packet` value.

  To comply with the SQL standard, `IN()` returns `NULL` not only if the expression on the left hand side is `NULL`, but also if no match is found in the list and one of the expressions in the list is `NULL`.

  `IN()` syntax can also be used to write certain types of subqueries. See Section 15.2.15.3, “Subqueries with ANY, IN, or SOME”.
* [`expr NOT IN (value,...)`](comparison-operators.html#operator_not-in)

  This is the same as `NOT (expr IN (value,...))`.
*  `INTERVAL(N,N1,N2,N3,...)`

  Returns `0` if *`N`* ≤ *`N1`*, `1` if *`N`* ≤ *`N2`* and so on, or `-1` if *`N`* is `NULL`. All arguments are treated as integers. It is required that *`N1`* ≤ *`N2`* ≤ *`N3`* ≤ `...` ≤ *`Nn`* for this function to work correctly. This is because a binary search is used (very fast).

  ```
  mysql> SELECT INTERVAL(23, 1, 15, 17, 30, 44, 200);
          -> 3
  mysql> SELECT INTERVAL(10, 1, 10, 100, 1000);
          -> 2
  mysql> SELECT INTERVAL(22, 23, 30, 44, 200);
          -> 0
  ```
* [`IS boolean_value`](comparison-operators.html#operator_is)

  Tests a value against a boolean value, where *`boolean_value`* can be `TRUE`, `FALSE`, or `UNKNOWN`.

  ```
  mysql> SELECT 1 IS TRUE, 0 IS FALSE, NULL IS UNKNOWN;
          -> 1, 1, 1
  ```
* [`IS NOT boolean_value`](comparison-operators.html#operator_is-not)

  Tests a value against a boolean value, where *`boolean_value`* can be `TRUE`, `FALSE`, or `UNKNOWN`.

  ```
  mysql> SELECT 1 IS NOT UNKNOWN, 0 IS NOT UNKNOWN, NULL IS NOT UNKNOWN;
          -> 1, 1, 0
  ```
*  `IS NULL`

  Tests whether a value is `NULL`.

  ```
  mysql> SELECT 1 IS NULL, 0 IS NULL, NULL IS NULL;
          -> 0, 0, 1
  ```

  To work well with ODBC programs, MySQL supports the following extra features when using [`IS NULL`](comparison-operators.html#operator_is-null):

  + If  `sql_auto_is_null` variable is set to 1, then after a statement that successfully inserts an automatically generated `AUTO_INCREMENT` value, you can find that value by issuing a statement of the following form:

    ```
    SELECT * FROM tbl_name WHERE auto_col IS NULL
    ```

    If the statement returns a row, the value returned is the same as if you invoked the `LAST_INSERT_ID()` function. For details, including the return value after a multiple-row insert, see Section 14.15, “Information Functions”. If no `AUTO_INCREMENT` value was successfully inserted, the  `SELECT` statement returns no row.

    The behavior of retrieving an `AUTO_INCREMENT` value by using an `IS NULL` comparison can be disabled by setting `sql_auto_is_null = 0`. See  Section 7.1.8, “Server System Variables”.

    The default value of `sql_auto_is_null` is 0.
  + For  `DATE` and `DATETIME` columns that are declared as `NOT NULL`, you can find the special date `'0000-00-00'` by using a statement like this:

    ```
    SELECT * FROM tbl_name WHERE date_column IS NULL
    ```

    This is needed to get some ODBC applications to work because ODBC does not support a `'0000-00-00'` date value.

    See Obtaining Auto-Increment Values, and the description for the `FLAG_AUTO_IS_NULL` option at Connector/ODBC Connection Parameters.
*  `IS NOT NULL`

  Tests whether a value is not `NULL`.

  ```
  mysql> SELECT 1 IS NOT NULL, 0 IS NOT NULL, NULL IS NOT NULL;
          -> 1, 1, 0
  ```
*  `ISNULL(expr)`

  If *`expr`* is `NULL`, `ISNULL()` returns `1`, otherwise it returns `0`.

  ```
  mysql> SELECT ISNULL(1+1);
          -> 0
  mysql> SELECT ISNULL(1/0);
          -> 1
  ```

   `ISNULL()` can be used instead of  `=` to test whether a value is `NULL`. (Comparing a value to `NULL` using `=` always yields `NULL`.)

  The  `ISNULL()` function shares some special behaviors with the `IS NULL` comparison operator. See the description of `IS NULL`.
*  `LEAST(value1,value2,...)`

  With two or more arguments, returns the smallest (minimum-valued) argument. The arguments are compared using the following rules:

  + If any argument is `NULL`, the result is `NULL`. No comparison is needed.
  + If all arguments are integer-valued, they are compared as integers.
  + If at least one argument is double precision, they are compared as double-precision values. Otherwise, if at least one argument is a `DECIMAL` - DECIMAL, NUMERIC") value, they are compared as  `DECIMAL` - DECIMAL, NUMERIC") values.
  + If the arguments comprise a mix of numbers and strings, they are compared as strings.
  + If any argument is a nonbinary (character) string, the arguments are compared as nonbinary strings.
  + In all other cases, the arguments are compared as binary strings.

  The return type of  `LEAST()` is the aggregated type of the comparison argument types.

  ```
  mysql> SELECT LEAST(2,0);
          -> 0
  mysql> SELECT LEAST(34.0,3.0,5.0,767.0);
          -> 3.0
  mysql> SELECT LEAST('B','A','C');
          -> 'A'
  ```

