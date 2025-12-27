### 12.6.1 Arithmetic Operators

**Table 12.9 Arithmetic Operators**

<table frame="box" rules="all" summary="A reference that lists arithmetic operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="arithmetic-functions.html#operator_mod"><code class="literal">%</code>, <code class="literal">MOD</code></a></td> <td> Modulo operator </td> </tr><tr><td><a class="link" href="arithmetic-functions.html#operator_times"><code class="literal">*</code></a></td> <td> Multiplication operator </td> </tr><tr><td><a class="link" href="arithmetic-functions.html#operator_plus"><code class="literal">+</code></a></td> <td> Addition operator </td> </tr><tr><td><a class="link" href="arithmetic-functions.html#operator_minus"><code class="literal">-</code></a></td> <td> Minus operator </td> </tr><tr><td><a class="link" href="arithmetic-functions.html#operator_unary-minus"><code class="literal">-</code></a></td> <td> Change the sign of the argument </td> </tr><tr><td><a class="link" href="arithmetic-functions.html#operator_divide"><code class="literal">/</code></a></td> <td> Division operator </td> </tr><tr><td><a class="link" href="arithmetic-functions.html#operator_div"><code class="literal">DIV</code></a></td> <td> Integer division </td> </tr></tbody></table>

The usual arithmetic operators are available. The result is determined according to the following rules:

* In the case of `-`, `+`, and `*`, the result is calculated with `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (64-bit) precision if both operands are integers.

* If both operands are integers and any of them are unsigned, the result is an unsigned integer. For subtraction, if the `NO_UNSIGNED_SUBTRACTION` SQL mode is enabled, the result is signed even if any operand is unsigned.

* If any of the operands of a `+`, `-`, `/`, `*`, `%` is a real or string value, the precision of the result is the precision of the operand with the maximum precision.

* In division performed with `/`, the scale of the result when using two exact-value operands is the scale of the first operand plus the value of the `div_precision_increment` system variable (which is 4 by default). For example, the result of the expression `5.05 / 0.014` has a scale of six decimal places (`360.714286`).

These rules are applied for each operation, such that nested calculations imply the precision of each component. Hence, `(14620 / 9432456) / (24250 / 9432456)`, resolves first to `(0.0014) / (0.0026)`, with the final result having 8 decimal places (`0.60288653`).

Because of these rules and the way they are applied, care should be taken to ensure that components and subcomponents of a calculation use the appropriate level of precision. See Section 12.10, “Cast Functions and Operators”.

For information about handling of overflow in numeric expression evaluation, see Section 11.1.7, “Out-of-Range and Overflow Handling”.

Arithmetic operators apply to numbers. For other types of values, alternative operations may be available. For example, to add date values, use `DATE_ADD()`; see Section 12.7, “Date and Time Functions”.

* `+`

  Addition:

  ```sql
  mysql> SELECT 3+5;
          -> 8
  ```

* `-`

  Subtraction:

  ```sql
  mysql> SELECT 3-5;
          -> -2
  ```

* `-`

  Unary minus. This operator changes the sign of the operand.

  ```sql
  mysql> SELECT - 2;
          -> -2
  ```

  Note

  If this operator is used with a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), the return value is also a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). This means that you should avoid using `-` on integers that may have the value of −263.

* `*`

  Multiplication:

  ```sql
  mysql> SELECT 3*5;
          -> 15
  mysql> SELECT 18014398509481984*18014398509481984.0;
          -> 324518553658426726783156020576256.0
  mysql> SELECT 18014398509481984*18014398509481984;
          -> out-of-range error
  ```

  The last expression produces an error because the result of the integer multiplication exceeds the 64-bit range of `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") calculations. (See Section 11.1, “Numeric Data Types”.)

* `/`

  Division:

  ```sql
  mysql> SELECT 3/5;
          -> 0.60
  ```

  Division by zero produces a `NULL` result:

  ```sql
  mysql> SELECT 102/(1-1);
          -> NULL
  ```

  A division is calculated with `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") arithmetic only if performed in a context where its result is converted to an integer.

* `DIV`

  Integer division. Discards from the division result any fractional part to the right of the decimal point.

  If either operand has a noninteger type, the operands are converted to `DECIMAL` - DECIMAL, NUMERIC") and divided using `DECIMAL` - DECIMAL, NUMERIC") arithmetic before converting the result to `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). If the result exceeds `BIGINT` range, an error occurs.

  ```sql
  mysql> SELECT 5 DIV 2, -5 DIV 2, 5 DIV -2, -5 DIV -2;
          -> 2, -2, -2, 2
  ```

* `N % M`, `N MOD M`

  Modulo operation. Returns the remainder of *`N`* divided by *`M`*. For more information, see the description for the `MOD()` function in Section 12.6.2, “Mathematical Functions”.
