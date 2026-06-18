### 12.4.1 Operator Precedence

Operator precedences are shown in the following list, from
highest precedence to the lowest. Operators that are shown
together on a line have the same precedence.

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

The precedence of `=` depends on whether it is
used as a comparison operator
([`=`](comparison-operators.html#operator_equal)) or as an
assignment operator
([`=`](assignment-operators.html#operator_assign-equal)). When
used as a comparison operator, it has the same precedence as
[`<=>`](comparison-operators.html#operator_equal-to),
[`>=`](comparison-operators.html#operator_greater-than-or-equal),
[`>`](comparison-operators.html#operator_greater-than),
[`<=`](comparison-operators.html#operator_less-than-or-equal),
[`<`](comparison-operators.html#operator_less-than),
[`<>`](comparison-operators.html#operator_not-equal),
[`!=`](comparison-operators.html#operator_not-equal),
[`IS`](comparison-operators.html#operator_is),
[`LIKE`](string-comparison-functions.html#operator_like),
[`REGEXP`](regexp.html#operator_regexp), and
[`IN()`](comparison-operators.html#operator_in). When used as an assignment
operator, it has the same precedence as
[`:=`](assignment-operators.html#operator_assign-value).
[Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), and
[Section 9.4, “User-Defined Variables”](user-variables.html "9.4 User-Defined Variables"), explain how MySQL determines
which interpretation of `=` should apply.

For operators that occur at the same precedence level within an
expression, evaluation proceeds left to right, with the
exception that assignments evaluate right to left.

The precedence and meaning of some operators depends on the SQL
mode:

* By default, [`||`](logical-operators.html#operator_or)
  is a logical [`OR`](logical-operators.html#operator_or) operator. With
  [`PIPES_AS_CONCAT`](sql-mode.html#sqlmode_pipes_as_concat) enabled,
  [`||`](logical-operators.html#operator_or) is string
  concatenation, with a precedence between
  [`^`](bit-functions.html#operator_bitwise-xor) and
  the unary operators.

* By default, [`!`](logical-operators.html#operator_not)
  has a higher precedence than `NOT`. With
  [`HIGH_NOT_PRECEDENCE`](sql-mode.html#sqlmode_high_not_precedence)
  enabled, [`!`](logical-operators.html#operator_not) and
  `NOT` have the same precedence.

See [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

The precedence of operators determines the order of evaluation
of terms in an expression. To override this order and group
terms explicitly, use parentheses. For example:

```sql
mysql> SELECT 1+2*3;
        -> 7
mysql> SELECT (1+2)*3;
        -> 9
```