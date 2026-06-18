### 12.6.2 Mathematical Functions

**Table 12.10 Mathematical Functions**

<table frame="box" rules="all" summary="A reference that lists mathematical functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th>
<th>Description</th>
</tr></thead><tbody><tr><td><code>ABS()</code></td>
<td>
      Return the absolute value
    </td>
</tr><tr><td><code>ACOS()</code></td>
<td>
      Return the arc cosine
    </td>
</tr><tr><td><code>ASIN()</code></td>
<td>
      Return the arc sine
    </td>
</tr><tr><td><code>ATAN()</code></td>
<td>
      Return the arc tangent
    </td>
</tr><tr><td><code>ATAN2()</code>, <code>ATAN()</code></td>
<td>
      Return the arc tangent of the two arguments
    </td>
</tr><tr><td><code>CEIL()</code></td>
<td>
      Return the smallest integer value not less than the argument
    </td>
</tr><tr><td><code>CEILING()</code></td>
<td>
      Return the smallest integer value not less than the argument
    </td>
</tr><tr><td><code>CONV()</code></td>
<td>
      Convert numbers between different number bases
    </td>
</tr><tr><td><code>COS()</code></td>
<td>
      Return the cosine
    </td>
</tr><tr><td><code>COT()</code></td>
<td>
      Return the cotangent
    </td>
</tr><tr><td><code>CRC32()</code></td>
<td>
      Compute a cyclic redundancy check value
    </td>
</tr><tr><td><code>DEGREES()</code></td>
<td>
      Convert radians to degrees
    </td>
</tr><tr><td><code>EXP()</code></td>
<td>
      Raise to the power of
    </td>
</tr><tr><td><code>FLOOR()</code></td>
<td>
      Return the largest integer value not greater than the argument
    </td>
</tr><tr><td><code>LN()</code></td>
<td>
      Return the natural logarithm of the argument
    </td>
</tr><tr><td><code>LOG()</code></td>
<td>
      Return the natural logarithm of the first argument
    </td>
</tr><tr><td><code>LOG10()</code></td>
<td>
      Return the base-10 logarithm of the argument
    </td>
</tr><tr><td><code>LOG2()</code></td>
<td>
      Return the base-2 logarithm of the argument
    </td>
</tr><tr><td><code>MOD()</code></td>
<td>
      Return the remainder
    </td>
</tr><tr><td><code>PI()</code></td>
<td>
      Return the value of pi
    </td>
</tr><tr><td><code>POW()</code></td>
<td>
      Return the argument raised to the specified power
    </td>
</tr><tr><td><code>POWER()</code></td>
<td>
      Return the argument raised to the specified power
    </td>
</tr><tr><td><code>RADIANS()</code></td>
<td>
      Return argument converted to radians
    </td>
</tr><tr><td><code>RAND()</code></td>
<td>
      Return a random floating-point value
    </td>
</tr><tr><td><code>ROUND()</code></td>
<td>
      Round the argument
    </td>
</tr><tr><td><code>SIGN()</code></td>
<td>
      Return the sign of the argument
    </td>
</tr><tr><td><code>SIN()</code></td>
<td>
      Return the sine of the argument
    </td>
</tr><tr><td><code>SQRT()</code></td>
<td>
      Return the square root of the argument
    </td>
</tr><tr><td><code>TAN()</code></td>
<td>
      Return the tangent of the argument
    </td>
</tr><tr><td><code>TRUNCATE()</code></td>
<td>
      Truncate to specified number of decimal places
    </td>
</tr></tbody></table>

All mathematical functions return `NULL` in the
event of an error.

* [`ABS(X)`](mathematical-functions.html#function_abs)

  Returns the absolute value of *`X`*,
  or `NULL` if *`X`*
  is `NULL`.

  The result type is derived from the argument type. An
  implication of this is that
  [`ABS(-9223372036854775808)`](mathematical-functions.html#function_abs)
  produces an error because the result cannot be stored in a
  signed `BIGINT` value.

  ```sql
  mysql> SELECT ABS(2);
          -> 2
  mysql> SELECT ABS(-32);
          -> 32
  ```

  This function is safe to use with
  [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") values.

* [`ACOS(X)`](mathematical-functions.html#function_acos)

  Returns the arc cosine of *`X`*, that
  is, the value whose cosine is *`X`*.
  Returns `NULL` if
  *`X`* is not in the range
  `-1` to `1`.

  ```sql
  mysql> SELECT ACOS(1);
          -> 0
  mysql> SELECT ACOS(1.0001);
          -> NULL
  mysql> SELECT ACOS(0);
          -> 1.5707963267949
  ```

* [`ASIN(X)`](mathematical-functions.html#function_asin)

  Returns the arc sine of *`X`*, that
  is, the value whose sine is *`X`*.
  Returns `NULL` if
  *`X`* is not in the range
  `-1` to `1`.

  ```sql
  mysql> SELECT ASIN(0.2);
          -> 0.20135792079033
  mysql> SELECT ASIN('foo');

  +-------------+
  | ASIN('foo') |
  +-------------+
  |           0 |
  +-------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS;
  +---------+------+-----------------------------------------+
  | Level   | Code | Message                                 |
  +---------+------+-----------------------------------------+
  | Warning | 1292 | Truncated incorrect DOUBLE value: 'foo' |
  +---------+------+-----------------------------------------+
  ```

* [`ATAN(X)`](mathematical-functions.html#function_atan)

  Returns the arc tangent of *`X`*,
  that is, the value whose tangent is
  *`X`*.

  ```sql
  mysql> SELECT ATAN(2);
          -> 1.1071487177941
  mysql> SELECT ATAN(-2);
          -> -1.1071487177941
  ```

* [`ATAN(Y,X)`](mathematical-functions.html#function_atan2),
  [`ATAN2(Y,X)`](mathematical-functions.html#function_atan2)

  Returns the arc tangent of the two variables
  *`X`* and
  *`Y`*. It is similar to calculating
  the arc tangent of `Y /
  X`, except that the
  signs of both arguments are used to determine the quadrant
  of the result.

  ```sql
  mysql> SELECT ATAN(-2,2);
          -> -0.78539816339745
  mysql> SELECT ATAN2(PI(),0);
          -> 1.5707963267949
  ```

* [`CEIL(X)`](mathematical-functions.html#function_ceil)

  [`CEIL()`](mathematical-functions.html#function_ceil) is a synonym for
  [`CEILING()`](mathematical-functions.html#function_ceiling).

* [`CEILING(X)`](mathematical-functions.html#function_ceiling)

  Returns the smallest integer value not less than
  *`X`*.

  ```sql
  mysql> SELECT CEILING(1.23);
          -> 2
  mysql> SELECT CEILING(-1.23);
          -> -1
  ```

  For exact-value numeric arguments, the return value has an
  exact-value numeric type. For string or floating-point
  arguments, the return value has a floating-point type.

* [`CONV(N,from_base,to_base)`](mathematical-functions.html#function_conv)

  Converts numbers between different number bases. Returns a
  string representation of the number
  *`N`*, converted from base
  *`from_base`* to base
  *`to_base`*. Returns
  `NULL` if any argument is
  `NULL`. The argument
  *`N`* is interpreted as an integer,
  but may be specified as an integer or a string. The minimum
  base is `2` and the maximum base is
  `36`. If
  *`from_base`* is a negative number,
  *`N`* is regarded as a signed number.
  Otherwise, *`N`* is treated as
  unsigned. [`CONV()`](mathematical-functions.html#function_conv) works with
  64-bit precision.

  ```sql
  mysql> SELECT CONV('a',16,2);
          -> '1010'
  mysql> SELECT CONV('6E',18,8);
          -> '172'
  mysql> SELECT CONV(-17,10,-18);
          -> '-H'
  mysql> SELECT CONV(10+'10'+'10'+X'0a',10,10);
          -> '40'
  ```

* [`COS(X)`](mathematical-functions.html#function_cos)

  Returns the cosine of *`X`*, where
  *`X`* is given in radians.

  ```sql
  mysql> SELECT COS(PI());
          -> -1
  ```

* [`COT(X)`](mathematical-functions.html#function_cot)

  Returns the cotangent of *`X`*.

  ```sql
  mysql> SELECT COT(12);
          -> -1.5726734063977
  mysql> SELECT COT(0);
          -> out-of-range error
  ```

* [`CRC32(expr)`](mathematical-functions.html#function_crc32)

  Computes a cyclic redundancy check value and returns a
  32-bit unsigned value. The result is `NULL`
  if the argument is `NULL`. The argument is
  expected to be a string and (if possible) is treated as one
  if it is not.

  ```sql
  mysql> SELECT CRC32('MySQL');
          -> 3259397556
  mysql> SELECT CRC32('mysql');
          -> 2501908538
  ```

* [`DEGREES(X)`](mathematical-functions.html#function_degrees)

  Returns the argument *`X`*, converted
  from radians to degrees.

  ```sql
  mysql> SELECT DEGREES(PI());
          -> 180
  mysql> SELECT DEGREES(PI() / 2);
          -> 90
  ```

* [`EXP(X)`](mathematical-functions.html#function_exp)

  Returns the value of *e* (the base of
  natural logarithms) raised to the power of
  *`X`*. The inverse of this function
  is [`LOG()`](mathematical-functions.html#function_log) (using a single
  argument only) or [`LN()`](mathematical-functions.html#function_ln).

  ```sql
  mysql> SELECT EXP(2);
          -> 7.3890560989307
  mysql> SELECT EXP(-2);
          -> 0.13533528323661
  mysql> SELECT EXP(0);
          -> 1
  ```

* [`FLOOR(X)`](mathematical-functions.html#function_floor)

  Returns the largest integer value not greater than
  *`X`*.

  ```sql
  mysql> SELECT FLOOR(1.23), FLOOR(-1.23);
          -> 1, -2
  ```

  For exact-value numeric arguments, the return value has an
  exact-value numeric type. For string or floating-point
  arguments, the return value has a floating-point type.

* [`FORMAT(X,D)`](string-functions.html#function_format)

  Formats the number *`X`* to a format
  like `'#,###,###.##'`, rounded to
  *`D`* decimal places, and returns the
  result as a string. For details, see
  [Section 12.8, “String Functions and Operators”](string-functions.html "12.8 String Functions and Operators").

* [`HEX(N_or_S)`](string-functions.html#function_hex)

  This function can be used to obtain a hexadecimal
  representation of a decimal number or a string; the manner
  in which it does so varies according to the argument's
  type. See this function's description in
  [Section 12.8, “String Functions and Operators”](string-functions.html "12.8 String Functions and Operators"), for details.

* [`LN(X)`](mathematical-functions.html#function_ln)

  Returns the natural logarithm of
  *`X`*; that is, the
  base-*e* logarithm of
  *`X`*. If
  *`X`* is less than or equal to 0.0E0,
  the function returns `NULL` and a warning
  “Invalid argument for logarithm” is reported.

  ```sql
  mysql> SELECT LN(2);
          -> 0.69314718055995
  mysql> SELECT LN(-2);
          -> NULL
  ```

  This function is synonymous with
  [`LOG(X)`](mathematical-functions.html#function_log).
  The inverse of this function is the
  [`EXP()`](mathematical-functions.html#function_exp) function.

* [`LOG(X)`](mathematical-functions.html#function_log),
  [`LOG(B,X)`](mathematical-functions.html#function_log)

  If called with one parameter, this function returns the
  natural logarithm of *`X`*. If
  *`X`* is less than or equal to 0.0E0,
  the function returns `NULL` and a warning
  “Invalid argument for logarithm” is reported.

  The inverse of this function (when called with a single
  argument) is the [`EXP()`](mathematical-functions.html#function_exp)
  function.

  ```sql
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

  If called with two parameters, this function returns the
  logarithm of *`X`* to the base
  *`B`*. If
  *`X`* is less than or equal to 0, or
  if *`B`* is less than or equal to 1,
  then `NULL` is returned.

  ```sql
  mysql> SELECT LOG(2,65536);
          -> 16
  mysql> SELECT LOG(10,100);
          -> 2
  mysql> SELECT LOG(1,100);
          -> NULL
  ```

  [`LOG(B,X)`](mathematical-functions.html#function_log)
  is equivalent to
  [`LOG(X) /
  LOG(B)`](mathematical-functions.html#function_log).

* [`LOG2(X)`](mathematical-functions.html#function_log2)

  Returns the base-2 logarithm of
  `X`. If
  *`X`* is less than or equal to 0.0E0,
  the function returns `NULL` and a warning
  “Invalid argument for logarithm” is reported.

  ```sql
  mysql> SELECT LOG2(65536);
          -> 16
  mysql> SELECT LOG2(-100);
          -> NULL
  ```

  [`LOG2()`](mathematical-functions.html#function_log2) is useful for finding
  out how many bits a number requires for storage. This
  function is approximately equivalent to the expression
  [`LOG(X) /
  LOG(2)`](mathematical-functions.html#function_log).

* [`LOG10(X)`](mathematical-functions.html#function_log10)

  Returns the base-10 logarithm of
  *`X`*. If
  *`X`* is less than or equal to 0.0E0,
  the function returns `NULL` and a warning
  “Invalid argument for logarithm” is reported.

  ```sql
  mysql> SELECT LOG10(2);
          -> 0.30102999566398
  mysql> SELECT LOG10(100);
          -> 2
  mysql> SELECT LOG10(-100);
          -> NULL
  ```

  [`LOG10(X)`](mathematical-functions.html#function_log10)
  is approximately equivalent to
  [`LOG(10,X)`](mathematical-functions.html#function_log).

* [`MOD(N,M)`](mathematical-functions.html#function_mod),
  [`N
  % M`](arithmetic-functions.html#operator_mod),
  [`N
  MOD M`](arithmetic-functions.html#operator_mod)

  Modulo operation. Returns the remainder of
  *`N`* divided by
  *`M`*.

  ```sql
  mysql> SELECT MOD(234, 10);
          -> 4
  mysql> SELECT 253 % 7;
          -> 1
  mysql> SELECT MOD(29,9);
          -> 2
  mysql> SELECT 29 MOD 9;
          -> 2
  ```

  This function is safe to use with
  [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") values.

  [`MOD()`](mathematical-functions.html#function_mod) also works on values
  that have a fractional part and returns the exact remainder
  after division:

  ```sql
  mysql> SELECT MOD(34.5,3);
          -> 1.5
  ```

  [`MOD(N,0)`](mathematical-functions.html#function_mod)
  returns `NULL`.

* [`PI()`](mathematical-functions.html#function_pi)

  Returns the value of π (pi). The default number of
  decimal places displayed is seven, but MySQL uses the full
  double-precision value internally.

  Because the return value of this function is a
  double-precision value, its exact representation may vary
  between platforms or implementations. This also applies to
  any expressions making use of `PI()`. See
  [Section 11.1.4, “Floating-Point Types (Approximate Value) - FLOAT, DOUBLE”](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE").

  ```sql
  mysql> SELECT PI();
          -> 3.141593
  mysql> SELECT PI()+0.000000000000000000;
          -> 3.141592653589793000
  ```

* [`POW(X,Y)`](mathematical-functions.html#function_pow)

  Returns the value of *`X`* raised to
  the power of *`Y`*.

  ```sql
  mysql> SELECT POW(2,2);
          -> 4
  mysql> SELECT POW(2,-2);
          -> 0.25
  ```

* [`POWER(X,Y)`](mathematical-functions.html#function_power)

  This is a synonym for [`POW()`](mathematical-functions.html#function_pow).

* [`RADIANS(X)`](mathematical-functions.html#function_radians)

  Returns the argument *`X`*, converted
  from degrees to radians. (Note that π radians equals 180
  degrees.)

  ```sql
  mysql> SELECT RADIANS(90);
          -> 1.5707963267949
  ```

* [`RAND([N])`](mathematical-functions.html#function_rand)

  Returns a random floating-point value
  *`v`* in the range
  `0` <= *`v`* <
  `1.0`. To obtain a random integer
  *`R`* in the range
  *`i`* <=
  *`R`* <
  *`j`*, use the expression
  [`FLOOR(i

  + RAND() * (j`](mathematical-functions.html#function_floor)
  − `i))`.
  For example, to obtain a random integer in the range the
  range `7` <=
  *`R`* < `12`, use
  the following statement:

  ```sql
  SELECT FLOOR(7 + (RAND() * 5));
  ```

  If an integer argument *`N`* is
  specified, it is used as the seed value:

  + With a constant initializer argument, the seed is
    initialized once when the statement is prepared, prior
    to execution.

  + With a nonconstant initializer argument (such as a
    column name), the seed is initialized with the value for
    each invocation of
    [`RAND()`](mathematical-functions.html#function_rand).

  One implication of this behavior is that for equal argument
  values,
  [`RAND(N)`](mathematical-functions.html#function_rand)
  returns the same value each time, and thus produces a
  repeatable sequence of column values. In the following
  example, the sequence of values produced by
  `RAND(3)` is the same both places it
  occurs.

  ```sql
  mysql> CREATE TABLE t (i INT);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO t VALUES(1),(2),(3);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT i, RAND() FROM t;
  +------+------------------+
  | i    | RAND()           |
  +------+------------------+
  |    1 | 0.61914388706828 |
  |    2 | 0.93845168309142 |
  |    3 | 0.83482678498591 |
  +------+------------------+
  3 rows in set (0.00 sec)

  mysql> SELECT i, RAND(3) FROM t;
  +------+------------------+
  | i    | RAND(3)          |
  +------+------------------+
  |    1 | 0.90576975597606 |
  |    2 | 0.37307905813035 |
  |    3 | 0.14808605345719 |
  +------+------------------+
  3 rows in set (0.00 sec)

  mysql> SELECT i, RAND() FROM t;
  +------+------------------+
  | i    | RAND()           |
  +------+------------------+
  |    1 | 0.35877890638893 |
  |    2 | 0.28941420772058 |
  |    3 | 0.37073435016976 |
  +------+------------------+
  3 rows in set (0.00 sec)

  mysql> SELECT i, RAND(3) FROM t;
  +------+------------------+
  | i    | RAND(3)          |
  +------+------------------+
  |    1 | 0.90576975597606 |
  |    2 | 0.37307905813035 |
  |    3 | 0.14808605345719 |
  +------+------------------+
  3 rows in set (0.01 sec)
  ```

  [`RAND()`](mathematical-functions.html#function_rand) in a
  `WHERE` clause is evaluated for every row
  (when selecting from one table) or combination of rows (when
  selecting from a multiple-table join). Thus, for optimizer
  purposes, [`RAND()`](mathematical-functions.html#function_rand) is not a
  constant value and cannot be used for index optimizations.
  For more information, see
  [Section 8.2.1.18, “Function Call Optimization”](function-optimization.html "8.2.1.18 Function Call Optimization").

  Use of a column with [`RAND()`](mathematical-functions.html#function_rand)
  values in an `ORDER BY` or `GROUP
  BY` clause may yield unexpected results because for
  either clause a [`RAND()`](mathematical-functions.html#function_rand)
  expression can be evaluated multiple times for the same row,
  each time returning a different result. If the goal is to
  retrieve rows in random order, you can use a statement like
  this:

  ```sql
  SELECT * FROM tbl_name ORDER BY RAND();
  ```

  To select a random sample from a set of rows, combine
  `ORDER BY RAND()` with
  `LIMIT`:

  ```sql
  SELECT * FROM table1, table2 WHERE a=b AND c<d ORDER BY RAND() LIMIT 1000;
  ```

  [`RAND()`](mathematical-functions.html#function_rand) is not meant to be a
  perfect random generator. It is a fast way to generate
  random numbers on demand that is portable between platforms
  for the same MySQL version.

  This function is unsafe for statement-based replication. A
  warning is logged if you use this function when
  [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is set to
  `STATEMENT`.

* [`ROUND(X)`](mathematical-functions.html#function_round),
  [`ROUND(X,D)`](mathematical-functions.html#function_round)

  Rounds the argument *`X`* to
  *`D`* decimal places. The rounding
  algorithm depends on the data type of
  *`X`*. *`D`*
  defaults to 0 if not specified. *`D`*
  can be negative to cause *`D`* digits
  left of the decimal point of the value
  *`X`* to become zero. The maximum
  absolute value for *`D`* is 30; any
  digits in excess of 30 (or -30) are truncated.

  ```sql
  mysql> SELECT ROUND(-1.23);
          -> -1
  mysql> SELECT ROUND(-1.58);
          -> -2
  mysql> SELECT ROUND(1.58);
          -> 2
  mysql> SELECT ROUND(1.298, 1);
          -> 1.3
  mysql> SELECT ROUND(1.298, 0);
          -> 1
  mysql> SELECT ROUND(23.298, -1);
          -> 20
  mysql> SELECT ROUND(.12345678901234567890123456789012345, 35);
          -> 0.123456789012345678901234567890
  ```

  The return value has the same type as the first argument
  (assuming that it is integer, double, or decimal). This
  means that for an integer argument, the result is an integer
  (no decimal places):

  ```sql
  mysql> SELECT ROUND(150.000,2), ROUND(150,2);
  +------------------+--------------+
  | ROUND(150.000,2) | ROUND(150,2) |
  +------------------+--------------+
  |           150.00 |          150 |
  +------------------+--------------+
  ```

  [`ROUND()`](mathematical-functions.html#function_round) uses the following
  rules depending on the type of the first argument:

  + For exact-value numbers,
    [`ROUND()`](mathematical-functions.html#function_round) uses the
    “round half away from zero” or “round
    toward nearest” rule: A value with a fractional
    part of .5 or greater is rounded up to the next integer
    if positive or down to the next integer if negative. (In
    other words, it is rounded away from zero.) A value with
    a fractional part less than .5 is rounded down to the
    next integer if positive or up to the next integer if
    negative.

  + For approximate-value numbers, the result depends on the
    C library. On many systems, this means that
    [`ROUND()`](mathematical-functions.html#function_round) uses the
    “round to nearest even” rule: A value with
    a fractional part exactly halfway between two integers
    is rounded to the nearest even integer.

  The following example shows how rounding differs for exact
  and approximate values:

  ```sql
  mysql> SELECT ROUND(2.5), ROUND(25E-1);
  +------------+--------------+
  | ROUND(2.5) | ROUND(25E-1) |
  +------------+--------------+
  | 3          |            2 |
  +------------+--------------+
  ```

  For more information, see [Section 12.21, “Precision Math”](precision-math.html "12.21 Precision Math").

* [`SIGN(X)`](mathematical-functions.html#function_sign)

  Returns the sign of the argument as `-1`,
  `0`, or `1`, depending on
  whether *`X`* is negative, zero, or
  positive.

  ```sql
  mysql> SELECT SIGN(-32);
          -> -1
  mysql> SELECT SIGN(0);
          -> 0
  mysql> SELECT SIGN(234);
          -> 1
  ```

* [`SIN(X)`](mathematical-functions.html#function_sin)

  Returns the sine of *`X`*, where
  *`X`* is given in radians.

  ```sql
  mysql> SELECT SIN(PI());
          -> 1.2246063538224e-16
  mysql> SELECT ROUND(SIN(PI()));
          -> 0
  ```

* [`SQRT(X)`](mathematical-functions.html#function_sqrt)

  Returns the square root of a nonnegative number
  *`X`*.

  ```sql
  mysql> SELECT SQRT(4);
          -> 2
  mysql> SELECT SQRT(20);
          -> 4.4721359549996
  mysql> SELECT SQRT(-16);
          -> NULL
  ```

* [`TAN(X)`](mathematical-functions.html#function_tan)

  Returns the tangent of *`X`*, where
  *`X`* is given in radians.

  ```sql
  mysql> SELECT TAN(PI());
          -> -1.2246063538224e-16
  mysql> SELECT TAN(PI()+1);
          -> 1.5574077246549
  ```

* [`TRUNCATE(X,D)`](mathematical-functions.html#function_truncate)

  Returns the number *`X`*, truncated
  to *`D`* decimal places. If
  *`D`* is `0`, the
  result has no decimal point or fractional part.
  *`D`* can be negative to cause
  *`D`* digits left of the decimal
  point of the value *`X`* to become
  zero.

  ```sql
  mysql> SELECT TRUNCATE(1.223,1);
          -> 1.2
  mysql> SELECT TRUNCATE(1.999,1);
          -> 1.9
  mysql> SELECT TRUNCATE(1.999,0);
          -> 1
  mysql> SELECT TRUNCATE(-1.999,1);
          -> -1.9
  mysql> SELECT TRUNCATE(122,-2);
         -> 100
  mysql> SELECT TRUNCATE(10.28*100,0);
         -> 1028
  ```

  All numbers are rounded toward zero.