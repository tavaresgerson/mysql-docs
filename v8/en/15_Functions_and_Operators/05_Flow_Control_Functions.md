## 14.5 Flow Control Functions

**Table 14.7 Flow Control Operators**

<table frame="box" rules="all" summary="A reference that lists flow control operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th>
<th>Description</th>
</tr></thead><tbody><tr><td><a class="link" href="flow-control-functions.html#operator_case"><code class="literal">CASE</code></a></td>
<td>
      Case operator
    </td>
</tr><tr><td><a class="link" href="flow-control-functions.html#function_if"><code class="literal">IF()</code></a></td>
<td>
      If/else construct
    </td>
</tr><tr><td><a class="link" href="flow-control-functions.html#function_ifnull"><code class="literal">IFNULL()</code></a></td>
<td>
      Null if/else construct
    </td>
</tr><tr><td><a class="link" href="flow-control-functions.html#function_nullif"><code class="literal">NULLIF()</code></a></td>
<td>
      Return NULL if expr1 = expr2
    </td>
</tr></tbody></table>

* [`CASE
  value WHEN
  compare_value THEN
  result [WHEN
  compare_value THEN
  result ...] [ELSE
  result] END`](flow-control-functions.html#operator_case)

  [`CASE WHEN
  condition THEN
  result [WHEN
  condition THEN
  result ...] [ELSE
  result] END`](flow-control-functions.html#operator_case)

  The first [`CASE`](flow-control-functions.html#operator_case) syntax returns the
  *`result`* for the first
  `value=compare_value`
  comparison that is true. The second syntax returns the result
  for the first condition that is true. If no comparison or
  condition is true, the result after `ELSE` is
  returned, or `NULL` if there is no
  `ELSE` part.

  Note

  The syntax of the [`CASE`](flow-control-functions.html#operator_case)
  *operator* described here differs
  slightly from that of the SQL
  [`CASE`](case.html "15.6.5.1 CASE Statement")
  *statement* described in
  [Section 15.6.5.1, “CASE Statement”](case.html "15.6.5.1 CASE Statement"), for use inside stored programs. The
  [`CASE`](case.html "15.6.5.1 CASE Statement") statement cannot have an
  `ELSE NULL` clause, and it is terminated
  with `END CASE` instead of
  `END`.

  The return type of a [`CASE`](flow-control-functions.html#operator_case)
  expression result is the aggregated type of all result values:

  + If all types are numeric, the aggregated type is also
    numeric:

    - If at least one argument is double precision, the
      result is double precision.

    - Otherwise, if at least one argument is
      [`DECIMAL`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), the result is
      [`DECIMAL`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC").

    - Otherwise, the result is an integer type (with one
      exception):

      * If all integer types are all signed or all
        unsigned, the result is the same sign and the
        precision is the highest of all specified integer
        types (that is,
        [`TINYINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
        [`SMALLINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
        [`MEDIUMINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
        [`INT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), or
        [`BIGINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")).

      * If there is a combination of signed and unsigned
        integer types, the result is signed and the
        precision may be higher. For example, if the types
        are signed [`INT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and
        unsigned [`INT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), the
        result is signed
        [`BIGINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

      * The exception is unsigned
        [`BIGINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") combined
        with any signed integer type. The result is
        [`DECIMAL`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") with
        sufficient precision and scale 0.

  + If all types are [`BIT`](bit-type.html "13.1.5 Bit-Value Type - BIT"), the
    result is [`BIT`](bit-type.html "13.1.5 Bit-Value Type - BIT"). Otherwise,
    [`BIT`](bit-type.html "13.1.5 Bit-Value Type - BIT") arguments are treated
    similar to [`BIGINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  + If all types are [`YEAR`](year.html "13.2.4 The YEAR Type"), the
    result is [`YEAR`](year.html "13.2.4 The YEAR Type"). Otherwise,
    `YEAR` arguments are treated similar to
    [`INT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

  + If all types are character string
    ([`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") or
    [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types")), the result is
    [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") with maximum length
    determined by the longest character length of the
    operands.

  + If all types are character or binary string, the result is
    [`VARBINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types").

  + [`SET`](set.html "13.3.6 The SET Type") and
    [`ENUM`](enum.html "13.3.5 The ENUM Type") are treated similar to
    [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"); the result is
    [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types").

  + If all types are [`JSON`](json.html "13.5 The JSON Data Type"), the
    result is [`JSON`](json.html "13.5 The JSON Data Type").

  + If all types are temporal, the result is temporal:

    - If all temporal types are
      [`DATE`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"),
      [`TIME`](time.html "13.2.3 The TIME Type"), or
      [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"), the result
      is [`DATE`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"),
      [`TIME`](time.html "13.2.3 The TIME Type"), or
      [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types"),
      respectively.

    - Otherwise, for a mix of temporal types, the result is
      [`DATETIME`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types").

  + If all types are `GEOMETRY`, the result
    is `GEOMETRY`.

  + If any type is [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types"), the
    result is [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types").

  + For all other type combinations, the result is
    [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types").

  + Literal `NULL` operands are ignored for
    type aggregation.

  ```
  mysql> SELECT CASE 1 WHEN 1 THEN 'one'
      ->     WHEN 2 THEN 'two' ELSE 'more' END;
          -> 'one'
  mysql> SELECT CASE WHEN 1>0 THEN 'true' ELSE 'false' END;
          -> 'true'
  mysql> SELECT CASE BINARY 'B'
      ->     WHEN 'a' THEN 1 WHEN 'b' THEN 2 END;
          -> NULL
  ```

* [`IF(expr1,expr2,expr3)`](flow-control-functions.html#function_if)

  If *`expr1`* is `TRUE`
  (`expr1 <>
  0` and `expr1 IS
  NOT NULL`), [`IF()`](flow-control-functions.html#function_if)
  returns *`expr2`*. Otherwise, it
  returns *`expr3`*.

  Note

  There is also an [`IF`](if.html "15.6.5.2 IF Statement")
  *statement*, which differs from the
  [`IF()`](flow-control-functions.html#function_if)
  *function* described here. See
  [Section 15.6.5.2, “IF Statement”](if.html "15.6.5.2 IF Statement").

  If only one of *`expr2`* or
  *`expr3`* is explicitly
  `NULL`, the result type of the
  [`IF()`](flow-control-functions.html#function_if) function is the type of
  the non-`NULL` expression.

  The default return type of [`IF()`](flow-control-functions.html#function_if)
  (which may matter when it is stored into a temporary table) is
  calculated as follows:

  + If *`expr2`* or
    *`expr3`* produce a string, the
    result is a string.

    If *`expr2`* and
    *`expr3`* are both strings, the
    result is case-sensitive if either string is
    case-sensitive.

  + If *`expr2`* or
    *`expr3`* produce a floating-point
    value, the result is a floating-point value.

  + If *`expr2`* or
    *`expr3`* produce an integer, the
    result is an integer.

  ```
  mysql> SELECT IF(1>2,2,3);
          -> 3
  mysql> SELECT IF(1<2,'yes','no');
          -> 'yes'
  mysql> SELECT IF(STRCMP('test','test1'),'no','yes');
          -> 'no'
  ```

* [`IFNULL(expr1,expr2)`](flow-control-functions.html#function_ifnull)

  If *`expr1`* is not
  `NULL`,
  [`IFNULL()`](flow-control-functions.html#function_ifnull) returns
  *`expr1`*; otherwise it returns
  *`expr2`*.

  ```
  mysql> SELECT IFNULL(1,0);
          -> 1
  mysql> SELECT IFNULL(NULL,10);
          -> 10
  mysql> SELECT IFNULL(1/0,10);
          -> 10
  mysql> SELECT IFNULL(1/0,'yes');
          -> 'yes'
  ```

  The default return type of
  [`IFNULL(expr1,expr2)`](flow-control-functions.html#function_ifnull)
  is the more “general” of the two expressions, in
  the order `STRING`, `REAL`,
  or `INTEGER`. Consider the case of a table
  based on expressions or where MySQL must internally store a
  value returned by [`IFNULL()`](flow-control-functions.html#function_ifnull) in a
  temporary table:

  ```
  mysql> CREATE TABLE tmp SELECT IFNULL(1,'test') AS test;
  mysql> DESCRIBE tmp;
  +-------+--------------+------+-----+---------+-------+
  | Field | Type         | Null | Key | Default | Extra |
  +-------+--------------+------+-----+---------+-------+
  | test  | varbinary(4) | NO   |     |         |       |
  +-------+--------------+------+-----+---------+-------+
  ```

  In this example, the type of the `test`
  column is [`VARBINARY(4)`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types") (a
  string type).

* [`NULLIF(expr1,expr2)`](flow-control-functions.html#function_nullif)

  Returns `NULL` if
  `expr1 =
  expr2` is true, otherwise
  returns *`expr1`*. This is the same as
  [`CASE WHEN
  expr1 =
  expr2 THEN NULL ELSE
  expr1 END`](flow-control-functions.html#operator_case).

  The return value has the same type as the first argument.

  ```
  mysql> SELECT NULLIF(1,1);
          -> NULL
  mysql> SELECT NULLIF(1,2);
          -> 1
  ```

  Note

  MySQL evaluates *`expr1`* twice if
  the arguments are not equal.

The handling of system variable values by these functions changed
in MySQL 8.0.22. For each of these functions, if the first
argument contains only characters present in the character set and
collation used by the second argument (and it is constant), the
latter character set and collation is used to make the comparison.
In MySQL 8.0.22 and later, system variable values are handled as
column values of the same character and collation. Some queries
using these functions with system variables that were previously
successful may subsequently be rejected with Illegal
mix of collations. In such cases, you should cast the
system variable to the correct character set and collation.