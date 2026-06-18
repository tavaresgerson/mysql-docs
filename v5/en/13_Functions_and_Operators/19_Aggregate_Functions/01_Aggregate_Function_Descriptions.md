### 12.19.1 Aggregate Function Descriptions

This section describes aggregate functions that operate on sets
of values. They are often used with a `GROUP
BY` clause to group values into subsets.

**Table 12.25 Aggregate Functions**

<table frame="box" rules="all" summary="A reference that lists aggregate functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th>
<th>Description</th>
<th>Introduced</th>
</tr></thead><tbody><tr><th><code>AVG()</code></th>
<td>
      Return the average value of the argument
    </td>
<td></td>
</tr><tr><th><code>BIT_AND()</code></th>
<td>
      Return bitwise AND
    </td>
<td></td>
</tr><tr><th><code>BIT_OR()</code></th>
<td>
      Return bitwise OR
    </td>
<td></td>
</tr><tr><th><code>BIT_XOR()</code></th>
<td>
      Return bitwise XOR
    </td>
<td></td>
</tr><tr><th><code>COUNT()</code></th>
<td>
      Return a count of the number of rows returned
    </td>
<td></td>
</tr><tr><th><code>COUNT(DISTINCT)</code></th>
<td>
      Return the count of a number of different values
    </td>
<td></td>
</tr><tr><th><code>GROUP_CONCAT()</code></th>
<td>
      Return a concatenated string
    </td>
<td></td>
</tr><tr><th><code>JSON_ARRAYAGG()</code></th>
<td>
      Return result set as a single JSON array
    </td>
<td>5.7.22</td>
</tr><tr><th><code>JSON_OBJECTAGG()</code></th>
<td>
      Return result set as a single JSON object
    </td>
<td>5.7.22</td>
</tr><tr><th><code>MAX()</code></th>
<td>
      Return the maximum value
    </td>
<td></td>
</tr><tr><th><code>MIN()</code></th>
<td>
      Return the minimum value
    </td>
<td></td>
</tr><tr><th><code>STD()</code></th>
<td>
      Return the population standard deviation
    </td>
<td></td>
</tr><tr><th><code>STDDEV()</code></th>
<td>
      Return the population standard deviation
    </td>
<td></td>
</tr><tr><th><code>STDDEV_POP()</code></th>
<td>
      Return the population standard deviation
    </td>
<td></td>
</tr><tr><th><code>STDDEV_SAMP()</code></th>
<td>
      Return the sample standard deviation
    </td>
<td></td>
</tr><tr><th><code>SUM()</code></th>
<td>
      Return the sum
    </td>
<td></td>
</tr><tr><th><code>VAR_POP()</code></th>
<td>
      Return the population standard variance
    </td>
<td></td>
</tr><tr><th><code>VAR_SAMP()</code></th>
<td>
      Return the sample variance
    </td>
<td></td>
</tr><tr><th><code>VARIANCE()</code></th>
<td>
      Return the population standard variance
    </td>
<td></td>
</tr></tbody></table>

Unless otherwise stated, aggregate functions ignore
`NULL` values.

If you use an aggregate function in a statement containing no
`GROUP BY` clause, it is equivalent to grouping
on all rows. For more information, see
[Section 12.19.3, “MySQL Handling of GROUP BY”](group-by-handling.html "12.19.3 MySQL Handling of GROUP BY").

For numeric arguments, the variance and standard deviation
functions return a [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") value.
The [`SUM()`](aggregate-functions.html#function_sum) and
[`AVG()`](aggregate-functions.html#function_avg) functions return a
[`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") value for exact-value
arguments (integer or [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")),
and a [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") value for
approximate-value arguments
([`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") or
[`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")).

The [`SUM()`](aggregate-functions.html#function_sum) and
[`AVG()`](aggregate-functions.html#function_avg) aggregate functions do not
work with temporal values. (They convert the values to numbers,
losing everything after the first nonnumeric character.) To work
around this problem, convert to numeric units, perform the
aggregate operation, and convert back to a temporal value.
Examples:

```sql
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Functions such as [`SUM()`](aggregate-functions.html#function_sum) or
[`AVG()`](aggregate-functions.html#function_avg) that expect a numeric
argument cast the argument to a number if necessary. For
[`SET`](set.html "11.3.6 The SET Type") or
[`ENUM`](enum.html "11.3.5 The ENUM Type") values, the cast operation
causes the underlying numeric value to be used.

The [`BIT_AND()`](aggregate-functions.html#function_bit-and),
[`BIT_OR()`](aggregate-functions.html#function_bit-or), and
[`BIT_XOR()`](aggregate-functions.html#function_bit-xor) aggregate functions
perform bit operations. They require
[`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (64-bit integer) arguments
and return [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") values.
Arguments of other types are converted to
[`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and truncation might
occur. For information about a change in MySQL 8.0 that permits
bit operations to take binary string type arguments
([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
[`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), and the
[`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") types), see
[Section 12.12, “Bit Functions and Operators”](bit-functions.html "12.12 Bit Functions and Operators").

* [`AVG([DISTINCT]
  expr)`](aggregate-functions.html#function_avg)

  Returns the average value of
  `expr`. The
  `DISTINCT` option can be used to return the
  average of the distinct values of
  *`expr`*.

  If there are no matching rows,
  [`AVG()`](aggregate-functions.html#function_avg) returns
  `NULL`.

  ```sql
  mysql> SELECT student_name, AVG(test_score)
         FROM student
         GROUP BY student_name;
  ```

* [`BIT_AND(expr)`](aggregate-functions.html#function_bit-and)

  Returns the bitwise `AND` of all bits in
  *`expr`*. The calculation is
  performed with 64-bit
  ([`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) precision.

  If there are no matching rows,
  [`BIT_AND()`](aggregate-functions.html#function_bit-and) returns a neutral
  value (all bits set to 1).

* [`BIT_OR(expr)`](aggregate-functions.html#function_bit-or)

  Returns the bitwise `OR` of all bits in
  *`expr`*. The calculation is
  performed with 64-bit
  ([`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) precision.

  If there are no matching rows,
  [`BIT_OR()`](aggregate-functions.html#function_bit-or) returns a neutral
  value (all bits set to 0).

* [`BIT_XOR(expr)`](aggregate-functions.html#function_bit-xor)

  Returns the bitwise [`XOR`](logical-operators.html#operator_xor) of all
  bits in *`expr`*. The calculation is
  performed with 64-bit
  ([`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) precision.

  If there are no matching rows,
  [`BIT_XOR()`](aggregate-functions.html#function_bit-xor) returns a neutral
  value (all bits set to 0).

* [`COUNT(expr)`](aggregate-functions.html#function_count)

  Returns a count of the number of non-`NULL`
  values of *`expr`* in the rows
  retrieved by a [`SELECT`](select.html "13.2.9 SELECT Statement")
  statement. The result is a
  [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") value.

  If there are no matching rows,
  [`COUNT()`](aggregate-functions.html#function_count) returns
  `0`.

  ```sql
  mysql> SELECT student.student_name,COUNT(*)
         FROM student,course
         WHERE student.student_id=course.student_id
         GROUP BY student_name;
  ```

  [`COUNT(*)`](aggregate-functions.html#function_count) is somewhat
  different in that it returns a count of the number of rows
  retrieved, whether or not they contain
  `NULL` values.

  For transactional storage engines such as
  `InnoDB`, storing an exact row count is
  problematic. Multiple transactions may be occurring at the
  same time, each of which may affect the count.

  `InnoDB` does not keep an internal count of
  rows in a table because concurrent transactions might
  “see” different numbers of rows at the same
  time. Consequently, `SELECT COUNT(*)`
  statements only count rows visible to the current
  transaction.

  Prior to MySQL 5.7.18, `InnoDB` processes
  `SELECT COUNT(*)` statements by scanning
  the clustered index. As of MySQL 5.7.18,
  `InnoDB` processes `SELECT
  COUNT(*)` statements by traversing the smallest
  available secondary index unless an index or optimizer hint
  directs the optimizer to use a different index. If a
  secondary index is not present, the clustered index is
  scanned.

  Processing `SELECT COUNT(*)` statements
  takes some time if index records are not entirely in the
  buffer pool. For a faster count, create a counter table and
  let your application update it according to the inserts and
  deletes it does. However, this method may not scale well in
  situations where thousands of concurrent transactions are
  initiating updates to the same counter table. If an
  approximate row count is sufficient, use
  [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement").

  `InnoDB` handles `SELECT
  COUNT(*)` and `SELECT COUNT(1)`
  operations in the same way. There is no performance
  difference.

  For `MyISAM` tables,
  [`COUNT(*)`](aggregate-functions.html#function_count) is optimized to
  return very quickly if the
  [`SELECT`](select.html "13.2.9 SELECT Statement") retrieves from one
  table, no other columns are retrieved, and there is no
  `WHERE` clause. For example:

  ```sql
  mysql> SELECT COUNT(*) FROM student;
  ```

  This optimization only applies to `MyISAM`
  tables, because an exact row count is stored for this
  storage engine and can be accessed very quickly.
  `COUNT(1)` is only subject to the same
  optimization if the first column is defined as `NOT
  NULL`.

* [`COUNT(DISTINCT
  expr,[expr...])`](aggregate-functions.html#function_count)

  Returns a count of the number of rows with different
  non-`NULL` *`expr`*
  values.

  If there are no matching rows,
  [`COUNT(DISTINCT)`](aggregate-functions.html#function_count) returns
  `0`.

  ```sql
  mysql> SELECT COUNT(DISTINCT results) FROM student;
  ```

  In MySQL, you can obtain the number of distinct expression
  combinations that do not contain `NULL` by
  giving a list of expressions. In standard SQL, you would
  have to do a concatenation of all expressions inside
  [`COUNT(DISTINCT ...)`](aggregate-functions.html#function_count).

* [`GROUP_CONCAT(expr)`](aggregate-functions.html#function_group-concat)

  This function returns a string result with the concatenated
  non-`NULL` values from a group. It returns
  `NULL` if there are no
  non-`NULL` values. The full syntax is as
  follows:

  ```sql
  GROUP_CONCAT([DISTINCT] expr [,expr ...]
               [ORDER BY {unsigned_integer | col_name | expr}
                   [ASC | DESC] [,col_name ...]]
               [SEPARATOR str_val])
  ```

  ```sql
  mysql> SELECT student_name,
           GROUP_CONCAT(test_score)
         FROM student
         GROUP BY student_name;
  ```

  Or:

  ```sql
  mysql> SELECT student_name,
           GROUP_CONCAT(DISTINCT test_score
                        ORDER BY test_score DESC SEPARATOR ' ')
         FROM student
         GROUP BY student_name;
  ```

  In MySQL, you can get the concatenated values of expression
  combinations. To eliminate duplicate values, use the
  `DISTINCT` clause. To sort values in the
  result, use the `ORDER BY` clause. To sort
  in reverse order, add the `DESC`
  (descending) keyword to the name of the column you are
  sorting by in the `ORDER BY` clause. The
  default is ascending order; this may be specified explicitly
  using the `ASC` keyword. The default
  separator between values in a group is comma
  (`,`). To specify a separator explicitly,
  use `SEPARATOR` followed by the string
  literal value that should be inserted between group values.
  To eliminate the separator altogether, specify
  `SEPARATOR ''`.

  The result is truncated to the maximum length that is given
  by the [`group_concat_max_len`](server-system-variables.html#sysvar_group_concat_max_len)
  system variable, which has a default value of 1024. The
  value can be set higher, although the effective maximum
  length of the return value is constrained by the value of
  [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet). The
  syntax to change the value of
  [`group_concat_max_len`](server-system-variables.html#sysvar_group_concat_max_len) at
  runtime is as follows, where *`val`*
  is an unsigned integer:

  ```sql
  SET [GLOBAL | SESSION] group_concat_max_len = val;
  ```

  The return value is a nonbinary or binary string, depending
  on whether the arguments are nonbinary or binary strings.
  The result type is [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") or
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") unless
  [`group_concat_max_len`](server-system-variables.html#sysvar_group_concat_max_len) is
  less than or equal to 512, in which case the result type is
  [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or
  [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types").

  If [`GROUP_CONCAT()`](aggregate-functions.html#function_group-concat) is invoked
  from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary
  string results display using hexadecimal notation, depending
  on the value of the
  [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more
  information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

  See also [`CONCAT()`](string-functions.html#function_concat) and
  [`CONCAT_WS()`](string-functions.html#function_concat-ws):
  [Section 12.8, “String Functions and Operators”](string-functions.html "12.8 String Functions and Operators").

* [`JSON_ARRAYAGG(col_or_expr)`](aggregate-functions.html#function_json-arrayagg)

  Aggregates a result set as a single
  [`JSON`](json.html "11.5 The JSON Data Type") array whose elements
  consist of the rows. The order of elements in this array is
  undefined. The function acts on a column or an expression
  that evaluates to a single value. Returns
  `NULL` if the result contains no rows, or
  in the event of an error.

  ```sql
  mysql> SELECT o_id, attribute, value FROM t3;
  +------+-----------+-------+
  | o_id | attribute | value |
  +------+-----------+-------+
  |    2 | color     | red   |
  |    2 | fabric    | silk  |
  |    3 | color     | green |
  |    3 | shape     | square|
  +------+-----------+-------+
  4 rows in set (0.00 sec)

  mysql> SELECT o_id, JSON_ARRAYAGG(attribute) AS attributes
      -> FROM t3 GROUP BY o_id;
  +------+---------------------+
  | o_id | attributes          |
  +------+---------------------+
  |    2 | ["color", "fabric"] |
  |    3 | ["color", "shape"]  |
  +------+---------------------+
  2 rows in set (0.00 sec)
  ```

  Added in MySQL 5.7.22.

* [`JSON_OBJECTAGG(key,
  value)`](aggregate-functions.html#function_json-objectagg)

  Takes two column names or expressions as arguments, the
  first of these being used as a key and the second as a
  value, and returns a JSON object containing key-value pairs.
  Returns `NULL` if the result contains no
  rows, or in the event of an error. An error occurs if any
  key name is `NULL` or the number of
  arguments is not equal to 2.

  ```sql
  mysql> SELECT o_id, attribute, value FROM t3;
  +------+-----------+-------+
  | o_id | attribute | value |
  +------+-----------+-------+
  |    2 | color     | red   |
  |    2 | fabric    | silk  |
  |    3 | color     | green |
  |    3 | shape     | square|
  +------+-----------+-------+
  4 rows in set (0.00 sec)

  mysql> SELECT o_id, JSON_OBJECTAGG(attribute, value)
      -> FROM t3 GROUP BY o_id;
  +------+---------------------------------------+
  | o_id | JSON_OBJECTAGG(attribute, value)      |
  +------+---------------------------------------+
  |    2 | {"color": "red", "fabric": "silk"}    |
  |    3 | {"color": "green", "shape": "square"} |
  +------+---------------------------------------+
  2 rows in set (0.00 sec)
  ```

  **Duplicate key handling.**
  When the result of this function is normalized, values
  having duplicate keys are discarded. In keeping with the
  MySQL [`JSON`](json.html "11.5 The JSON Data Type") data type
  specification that does not permit duplicate keys, only
  the last value encountered is used with that key in the
  returned object (“last duplicate key wins”).
  This means that the result of using this function on
  columns from a `SELECT` can depend on the
  order in which the rows are returned, which is not
  guaranteed.

  Consider the following:

  ```sql
  mysql> CREATE TABLE t(c VARCHAR(10), i INT);
  Query OK, 0 rows affected (0.33 sec)

  mysql> INSERT INTO t VALUES ('key', 3), ('key', 4), ('key', 5);
  Query OK, 3 rows affected (0.10 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c, i FROM t;
  +------+------+
  | c    | i    |
  +------+------+
  | key  |    3 |
  | key  |    4 |
  | key  |    5 |
  +------+------+
  3 rows in set (0.00 sec)

  mysql> SELECT JSON_OBJECTAGG(c, i) FROM t;
  +----------------------+
  | JSON_OBJECTAGG(c, i) |
  +----------------------+
  | {"key": 5}           |
  +----------------------+
  1 row in set (0.00 sec)

  mysql> DELETE FROM t;
  Query OK, 3 rows affected (0.08 sec)

  mysql> INSERT INTO t VALUES ('key', 3), ('key', 5), ('key', 4);
  Query OK, 3 rows affected (0.06 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT c, i FROM t;
  +------+------+
  | c    | i    |
  +------+------+
  | key  |    3 |
  | key  |    5 |
  | key  |    4 |
  +------+------+
  3 rows in set (0.00 sec)

  mysql> SELECT JSON_OBJECTAGG(c, i) FROM t;
  +----------------------+
  | JSON_OBJECTAGG(c, i) |
  +----------------------+
  | {"key": 4}           |
  +----------------------+
  1 row in set (0.00 sec)
  ```

  See [Normalization, Merging, and Autowrapping of JSON Values](json.html#json-normalization "Normalization, Merging, and Autowrapping of JSON Values"), for additional
  information and examples.

  Added in MySQL 5.7.22.

* [`MAX([DISTINCT]
  expr)`](aggregate-functions.html#function_max)

  Returns the maximum value of
  *`expr`*.
  [`MAX()`](aggregate-functions.html#function_max) may take a string
  argument; in such cases, it returns the maximum string
  value. See [Section 8.3.1, “How MySQL Uses Indexes”](mysql-indexes.html "8.3.1 How MySQL Uses Indexes"). The
  `DISTINCT` keyword can be used to find the
  maximum of the distinct values of
  *`expr`*, however, this produces the
  same result as omitting `DISTINCT`.

  If there are no matching rows,
  [`MAX()`](aggregate-functions.html#function_max) returns
  `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  For [`MAX()`](aggregate-functions.html#function_max), MySQL currently
  compares [`ENUM`](enum.html "11.3.5 The ENUM Type") and
  [`SET`](set.html "11.3.6 The SET Type") columns by their string
  value rather than by the string's relative position in the
  set. This differs from how `ORDER BY`
  compares them.

* [`MIN([DISTINCT]
  expr)`](aggregate-functions.html#function_min)

  Returns the minimum value of
  *`expr`*.
  [`MIN()`](aggregate-functions.html#function_min) may take a string
  argument; in such cases, it returns the minimum string
  value. See [Section 8.3.1, “How MySQL Uses Indexes”](mysql-indexes.html "8.3.1 How MySQL Uses Indexes"). The
  `DISTINCT` keyword can be used to find the
  minimum of the distinct values of
  *`expr`*, however, this produces the
  same result as omitting `DISTINCT`.

  If there are no matching rows,
  [`MIN()`](aggregate-functions.html#function_min) returns
  `NULL`.

  ```sql
  mysql> SELECT student_name, MIN(test_score), MAX(test_score)
         FROM student
         GROUP BY student_name;
  ```

  For [`MIN()`](aggregate-functions.html#function_min), MySQL currently
  compares [`ENUM`](enum.html "11.3.5 The ENUM Type") and
  [`SET`](set.html "11.3.6 The SET Type") columns by their string
  value rather than by the string's relative position in the
  set. This differs from how `ORDER BY`
  compares them.

* [`STD(expr)`](aggregate-functions.html#function_std)

  Returns the population standard deviation of
  *`expr`*.
  [`STD()`](aggregate-functions.html#function_std) is a synonym for the
  standard SQL function
  [`STDDEV_POP()`](aggregate-functions.html#function_stddev-pop), provided as a
  MySQL extension.

  If there are no matching rows,
  [`STD()`](aggregate-functions.html#function_std) returns
  `NULL`.

* [`STDDEV(expr)`](aggregate-functions.html#function_stddev)

  Returns the population standard deviation of
  *`expr`*.
  [`STDDEV()`](aggregate-functions.html#function_stddev) is a synonym for the
  standard SQL function
  [`STDDEV_POP()`](aggregate-functions.html#function_stddev-pop), provided for
  compatibility with Oracle.

  If there are no matching rows,
  [`STDDEV()`](aggregate-functions.html#function_stddev) returns
  `NULL`.

* [`STDDEV_POP(expr)`](aggregate-functions.html#function_stddev-pop)

  Returns the population standard deviation of
  *`expr`* (the square root of
  [`VAR_POP()`](aggregate-functions.html#function_var-pop)). You can also use
  [`STD()`](aggregate-functions.html#function_std) or
  [`STDDEV()`](aggregate-functions.html#function_stddev), which are
  equivalent but not standard SQL.

  If there are no matching rows,
  [`STDDEV_POP()`](aggregate-functions.html#function_stddev-pop) returns
  `NULL`.

* [`STDDEV_SAMP(expr)`](aggregate-functions.html#function_stddev-samp)

  Returns the sample standard deviation of
  *`expr`* (the square root of
  [`VAR_SAMP()`](aggregate-functions.html#function_var-samp).

  If there are no matching rows,
  [`STDDEV_SAMP()`](aggregate-functions.html#function_stddev-samp) returns
  `NULL`.

* [`SUM([DISTINCT]
  expr)`](aggregate-functions.html#function_sum)

  Returns the sum of *`expr`*. If the
  return set has no rows, [`SUM()`](aggregate-functions.html#function_sum)
  returns `NULL`. The
  `DISTINCT` keyword can be used to sum only
  the distinct values of *`expr`*.

  If there are no matching rows,
  [`SUM()`](aggregate-functions.html#function_sum) returns
  `NULL`.

* [`VAR_POP(expr)`](aggregate-functions.html#function_var-pop)

  Returns the population standard variance of
  *`expr`*. It considers rows as the
  whole population, not as a sample, so it has the number of
  rows as the denominator. You can also use
  [`VARIANCE()`](aggregate-functions.html#function_variance), which is
  equivalent but is not standard SQL.

  If there are no matching rows,
  [`VAR_POP()`](aggregate-functions.html#function_var-pop) returns
  `NULL`.

* [`VAR_SAMP(expr)`](aggregate-functions.html#function_var-samp)

  Returns the sample variance of
  *`expr`*. That is, the denominator is
  the number of rows minus one.

  If there are no matching rows,
  [`VAR_SAMP()`](aggregate-functions.html#function_var-samp) returns
  `NULL`.

* [`VARIANCE(expr)`](aggregate-functions.html#function_variance)

  Returns the population standard variance of
  *`expr`*.
  [`VARIANCE()`](aggregate-functions.html#function_variance) is a synonym for
  the standard SQL function
  [`VAR_POP()`](aggregate-functions.html#function_var-pop), provided as a
  MySQL extension.

  If there are no matching rows,
  [`VARIANCE()`](aggregate-functions.html#function_variance) returns
  `NULL`.