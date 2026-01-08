## 12.12 Bit Functions and Operators

**Table 12.17 Bit Functions and Operators**

<table frame="box" rules="all" summary="A reference that lists bit functions and operators."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="bit-functions.html#operator_bitwise-and"><code>&amp;</code></a></td> <td> Bitwise AND </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_right-shift"><code>&gt;&gt;</code></a></td> <td> Right shift </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_left-shift"><code>&lt;&lt;</code></a></td> <td> Left shift </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_bitwise-xor"><code>^</code></a></td> <td> Bitwise XOR </td> </tr><tr><td><a class="link" href="bit-functions.html#function_bit-count"><code>BIT_COUNT()</code></a></td> <td> Return the number of bits that are set </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_bitwise-or"><code>|</code></a></td> <td> Bitwise OR </td> </tr><tr><td><a class="link" href="bit-functions.html#operator_bitwise-invert"><code>~</code></a></td> <td> Bitwise inversion </td> </tr></tbody></table>

The following list describes available bit functions and operators:

* `|`

  Bitwise OR.

  The result is an unsigned 64-bit integer.

  ```sql
  mysql> SELECT 29 | 15;
          -> 31
  ```

* `&`

  Bitwise AND.

  The result is an unsigned 64-bit integer.

  ```sql
  mysql> SELECT 29 & 15;
          -> 13
  ```

* `^`

  Bitwise XOR.

  The result is an unsigned 64-bit integer.

  ```sql
  mysql> SELECT 1 ^ 1;
          -> 0
  mysql> SELECT 1 ^ 0;
          -> 1
  mysql> SELECT 11 ^ 3;
          -> 8
  ```

* `<<`

  Shifts a longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number to the left.

  The result is an unsigned 64-bit integer. The value is truncated to 64 bits. In particular, if the shift count is greater or equal to the width of an unsigned 64-bit number, the result is zero.

  ```sql
  mysql> SELECT 1 << 2;
          -> 4
  ```

* `>>`

  Shifts a longlong (`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number to the right.

  The result is an unsigned 64-bit integer. The value is truncated to 64 bits. In particular, if the shift count is greater or equal to the width of an unsigned 64-bit number, the result is zero.

  ```sql
  mysql> SELECT 4 >> 2;
          -> 1
  ```

* `~`

  Invert all bits.

  The result is an unsigned 64-bit integer.

  ```sql
  mysql> SELECT 5 & ~1;
          -> 4
  ```

* `BIT_COUNT(N)`

  Returns the number of bits that are set in the argument *`N`* as an unsigned 64-bit integer, or `NULL` if the argument is `NULL`.

  ```sql
  mysql> SELECT BIT_COUNT(29), BIT_COUNT(b'101010');
          -> 4, 3
  ```

Bit functions and operators comprise `BIT_COUNT()`, `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`, `&`, `|`, `^`, `~`, `<<`, and `>>`. (The `BIT_AND()`, `BIT_OR()`, and `BIT_XOR()` functions are aggregate functions described at Section 12.19.1, “Aggregate Function Descriptions”.) Currently, bit functions and operators require `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (64-bit integer) arguments and return `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") values, so they have a maximum range of 64 bits. Arguments of other types are converted to `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and truncation might occur.

An extension for MySQL 8.0 changes this cast-to-`BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") behavior: Bit functions and operators permit binary string type arguments (`BINARY`, `VARBINARY`, and the `BLOB` types), enabling them to take arguments and produce return values larger than 64 bits. Consequently, bit operations on binary arguments in MySQL 5.7 might produce different results in MySQL 8.0. To provide advance notice about this potential change in behavior, the server produces warnings as of MySQL 5.7.11 for bit operations for which binary arguments are not converted to integer in MySQL 8.0. These warnings afford an opportunity to rewrite affected statements. To produce MySQL 5.7 behavior explicitly in a way that does not change after an upgrade to 8.0, cast bit-operation binary arguments to convert them to integer.

The five problematic expression types to watch out for are:

```sql
nonliteral_binary { & | ^ } binary
binary  { & | ^ } nonliteral_binary
nonliteral_binary { << >> } anything
~ nonliteral_binary
AGGR_BIT_FUNC(nonliteral_binary)
```

Those expressions return `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") in MySQL 5.7, binary string in 8.0.

Explanation of notation:

* `{ op1 op2 ... }`: List of operators that apply to the given expression type.

* *`binary`*: Any kind of binary string argument, including a hexadecimal literal, bit literal, or `NULL` literal.

* *`nonliteral_binary`*: An argument that is a binary string value other than a hexadecimal literal, bit literal, or `NULL` literal.

* *`AGGR_BIT_FUNC`*: An aggregate function that takes bit-value arguments: `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`.

The server produces a single warning for each problematic expression in a statement, not a warning for each row processed. Suppose that a statement containing two problematic expressions selects three rows from a table. The number of warnings per statement execution is two, not six. The following example illustrates this.

```sql
mysql> CREATE TABLE t(vbin1 VARBINARY(32), vbin2 VARBINARY(32));
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t VALUES (3,1), (3,2), (3,3);
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> SELECT HEX(vbin1 & vbin2) AS op1,
    -> HEX(vbin1 | vbin2) AS op2
    -> FROM t;
+------+------+
| op1  | op2  |
+------+------+
| 1    | 3    |
| 2    | 3    |
| 3    | 3    |
+------+------+
3 rows in set, 2 warnings (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1287
Message: Bitwise operations on BINARY will change behavior in a future
         version, check the 'Bit functions' section in the manual.
*************************** 2. row ***************************
  Level: Warning
   Code: 1287
Message: Bitwise operations on BINARY will change behavior in a future
         version, check the 'Bit functions' section in the manual.
2 rows in set (0.00 sec)
```

To avoid having an affected statement produce a different result after an upgrade to MySQL 8.0, rewrite it so that it generates no bit-operation warnings. To do this, cast at least one binary argument to `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") with `CAST(... AS UNSIGNED)`. This makes the MySQL 5.7 implicit binary-to-integer cast explicit:

```sql
mysql> SELECT HEX(CAST(vbin1 AS UNSIGNED) & CAST(vbin2 AS UNSIGNED)) AS op1,
    -> HEX(CAST(vbin1 AS UNSIGNED) | CAST(vbin2 AS UNSIGNED)) AS op2
    -> FROM t;
+------+------+
| op1  | op2  |
+------+------+
| 1    | 3    |
| 2    | 3    |
| 3    | 3    |
+------+------+
3 rows in set (0.01 sec)

mysql> SHOW WARNINGS\G
Empty set (0.00 sec)
```

With the statement rewritten as shown, MySQL 8.0 respects the intention to treat the binary arguments as integers and produces the same result as in 5.7. Also, replicating the statement from MySQL 5.7 to 8.0 does not produce different results on different servers.

An affected statement that cannot be rewritten is subject to these potential problems with respect to upgrades and replication:

* The statement might return a different result after an upgrade to MySQL 8.0.

* Replication to MySQL 8.0 from older versions might fail for statement-based and mixed-format binary logging. This is also true for replaying older binary logs on an 8.0 server (for example, using **mysqlbinlog**). To avoid this, switch to row-based binary logging on the older source server.
