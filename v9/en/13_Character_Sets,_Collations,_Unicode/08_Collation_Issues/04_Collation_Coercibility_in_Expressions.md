### 12.8.4 Collation Coercibility in Expressions

In the great majority of statements, it is obvious what collation MySQL uses to resolve a comparison operation. For example, in the following cases, it should be clear that the collation is the collation of column `x`:

```
SELECT x FROM T ORDER BY x;
SELECT x FROM T WHERE x = x;
SELECT DISTINCT x FROM T;
```

However, with multiple operands, there can be ambiguity. For example, this statement performs a comparison between the column `x` and the string literal `'Y'`:

```
SELECT x FROM T WHERE x = 'Y';
```

If `x` and `'Y'` have the same collation, there is no ambiguity about the collation to use for the comparison. But if they have different collations, should the comparison use the collation of `x`, or of `'Y'`? Both `x` and `'Y'` have collations, so which collation takes precedence?

A mix of collations may also occur in contexts other than comparison. For example, a multiple-argument concatenation operation such as `CONCAT(x,'Y')` combines its arguments to produce a single string. What collation should the result have?

To resolve questions like these, MySQL checks whether the collation of one item can be coerced to the collation of the other. MySQL assigns coercibility values as follows:

* An explicit `COLLATE` clause has a coercibility of 0 (not coercible at all).

* The collation of a column or a stored routine parameter or local variable has a coercibility of 2.

* A “system constant” (the string returned by functions such as `USER()` or `VERSION()`) has a coercibility of 3.

* The collation of a literal has a coercibility of 4.
* The collation of a numeric or temporal value has a coercibility of 5.

* `NULL` or an expression that is derived from `NULL` has a coercibility of 6.

* The concatenation of two strings inherits the greater strength of either of the arguments, unless both strings have the same strength and same character set, but different collations, in which case the coercibility is 7.

  An example using the `COERCIBILITY()` function is shown here:

  ```
  mysql> SET @x = 'x' COLLATE utf8mb4_0900_ai_ci;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @y = 'y' COLLATE utf8mb4_0900_as_cs;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT COERCIBILITY(CONCAT(@x, @y));
  +------------------------------+
  | COERCIBILITY(CONCAT(@x, @y)) |
  +------------------------------+
  |                            7 |
  +------------------------------+
  1 row in set (0.00 sec)
  ```

Note

`1` as a coercibility value is unused in MySQL 9.5 but is still considered valid for backwards compatibility. (Bug #37285902)

MySQL uses coercibility values with the following rules to resolve ambiguities:

* Use the collation with the lowest coercibility value.
* If both sides have the same coercibility, then:

  + If both sides are Unicode, or both sides are not Unicode, it is an error.

  + If one of the sides has a Unicode character set, and another side has a non-Unicode character set, the side with Unicode character set wins, and automatic character set conversion is applied to the non-Unicode side. For example, the following statement does not return an error:

    ```
    SELECT CONCAT(utf8mb4_column, latin1_column) FROM t1;
    ```

    It returns a result that has a character set of `utf8mb4` and the same collation as `utf8mb4_column`. Values of `latin1_column` are automatically converted to `utf8mb4` before concatenating.

  + For an operation with operands from the same character set but that mix a `_bin` collation and a `_ci` or `_cs` collation, the `_bin` collation is used. This is similar to how operations that mix nonbinary and binary strings evaluate the operands as binary strings, applied to collations rather than data types.

Although automatic conversion is not in the SQL standard, the standard does say that every character set is (in terms of supported characters) a “subset” of Unicode. Because it is a well-known principle that “what applies to a superset can apply to a subset,” we believe that a collation for Unicode can apply for comparisons with non-Unicode strings. More generally, MySQL uses the concept of character set repertoire, which can sometimes be used to determine subset relationships among character sets and enable conversion of operands in operations that would otherwise produce an error. See Section 12.2.1, “Character Set Repertoire”.

The following table illustrates some applications of the preceding rules.

<table summary="Comparisons and the collation used for each comparison."><thead><tr> <th>Comparison</th> <th>Collation Used</th> </tr></thead><tbody><tr> <td><code>column1 = 'A'</code></td> <td>Use collation of <code>column1</code></td> </tr><tr> <td><code>column1 = 'A' COLLATE x</code></td> <td>Use collation of <code>'A' COLLATE x</code></td> </tr><tr> <td><code>column1 COLLATE x = 'A' COLLATE y</code></td> <td>Error</td> </tr></tbody></table>

To determine the coercibility of a string expression, use the `COERCIBILITY()` function (see Section 14.15, “Information Functions”):

```
mysql> SELECT COERCIBILITY(_utf8mb4'A' COLLATE utf8mb4_bin);
        -> 0
mysql> SELECT COERCIBILITY(VERSION());
        -> 3
mysql> SELECT COERCIBILITY('A');
        -> 4
mysql> SELECT COERCIBILITY(1000);
        -> 5
mysql> SELECT COERCIBILITY(NULL);
        -> 6
```

For implicit conversion of a numeric or temporal value to a string, such as occurs for the argument `1` in the expression `CONCAT(1, 'abc')`, the result is a character (nonbinary) string that has a character set and collation determined by the `character_set_connection` and `collation_connection` system variables. See Section 14.3, “Type Conversion in Expression Evaluation”.
