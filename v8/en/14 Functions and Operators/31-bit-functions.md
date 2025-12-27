## 14.12 Bit Functions and Operators

**Table 14.17 Bit Functions and Operators**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>&amp;</code></td> <td> Bitwise AND </td> </tr><tr><td><code>&gt;&gt;</code></td> <td> Right shift </td> </tr><tr><td><code>&lt;&lt;</code></td> <td> Left shift </td> </tr><tr><td><code>^</code></td> <td> Bitwise XOR </td> </tr><tr><td><code>BIT_COUNT()</code></td> <td> Return the number of bits that are set </td> </tr><tr><td><code>|</code></td> <td> Bitwise OR </td> </tr><tr><td><code>~</code></td> <td> Bitwise inversion </td> </tr></tbody></table>

The following list describes available bit functions and operators:

*  `|`

  Bitwise OR.

  The result type depends on whether the arguments are evaluated as binary strings or numbers:

  + Binary-string evaluation occurs when the arguments have a binary string type, and at least one of them is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to unsigned 64-bit integers as necessary.
  + Binary-string evaluation produces a binary string of the same length as the arguments. If the arguments have unequal lengths, an `ER_INVALID_BITWISE_OPERANDS_SIZE` error occurs. Numeric evaluation produces an unsigned 64-bit integer.

  For more information, see the introductory discussion in this section.

  ```
  mysql> SELECT 29 | 15;
          -> 31
  mysql> SELECT _binary X'40404040' | X'01020304';
          -> 'ABCD'
  ```

  If bitwise OR is invoked from within the `mysql` client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see  Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `&`

  Bitwise AND.

  The result type depends on whether the arguments are evaluated as binary strings or numbers:

  + Binary-string evaluation occurs when the arguments have a binary string type, and at least one of them is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to unsigned 64-bit integers as necessary.
  + Binary-string evaluation produces a binary string of the same length as the arguments. If the arguments have unequal lengths, an `ER_INVALID_BITWISE_OPERANDS_SIZE` error occurs. Numeric evaluation produces an unsigned 64-bit integer.

  For more information, see the introductory discussion in this section.

  ```
  mysql> SELECT 29 & 15;
          -> 13
  mysql> SELECT HEX(_binary X'FF' & b'11110000');
          -> 'F0'
  ```

  If bitwise AND is invoked from within the `mysql` client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see  Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `^`

  Bitwise XOR.

  The result type depends on whether the arguments are evaluated as binary strings or numbers:

  + Binary-string evaluation occurs when the arguments have a binary string type, and at least one of them is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to unsigned 64-bit integers as necessary.
  + Binary-string evaluation produces a binary string of the same length as the arguments. If the arguments have unequal lengths, an `ER_INVALID_BITWISE_OPERANDS_SIZE` error occurs. Numeric evaluation produces an unsigned 64-bit integer.

  For more information, see the introductory discussion in this section.

  ```
  mysql> SELECT 1 ^ 1;
          -> 0
  mysql> SELECT 1 ^ 0;
          -> 1
  mysql> SELECT 11 ^ 3;
          -> 8
  mysql> SELECT HEX(_binary X'FEDC' ^ X'1111');
          -> 'EFCD'
  ```

  If bitwise XOR is invoked from within the `mysql` client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see  Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `<<`

  Shifts a longlong ( `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number or binary string to the left.

  The result type depends on whether the bit argument is evaluated as a binary string or number:

  + Binary-string evaluation occurs when the bit argument has a binary string type, and is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to an unsigned 64-bit integer as necessary.
  + Binary-string evaluation produces a binary string of the same length as the bit argument. Numeric evaluation produces an unsigned 64-bit integer.

  Bits shifted off the end of the value are lost without warning, regardless of the argument type. In particular, if the shift count is greater or equal to the number of bits in the bit argument, all bits in the result are 0.

  For more information, see the introductory discussion in this section.

  ```
  mysql> SELECT 1 << 2;
          -> 4
  mysql> SELECT HEX(_binary X'00FF00FF00FF' << 8);
          -> 'FF00FF00FF00'
  ```

  If a bit shift is invoked from within the `mysql` client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see  Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `>>`

  Shifts a longlong ( `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")) number or binary string to the right.

  The result type depends on whether the bit argument is evaluated as a binary string or number:

  + Binary-string evaluation occurs when the bit argument has a binary string type, and is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to an unsigned 64-bit integer as necessary.
  + Binary-string evaluation produces a binary string of the same length as the bit argument. Numeric evaluation produces an unsigned 64-bit integer.

  Bits shifted off the end of the value are lost without warning, regardless of the argument type. In particular, if the shift count is greater or equal to the number of bits in the bit argument, all bits in the result are 0.

  For more information, see the introductory discussion in this section.

  ```
  mysql> SELECT 4 >> 2;
          -> 1
  mysql> SELECT HEX(_binary X'00FF00FF00FF' >> 8);
          -> '0000FF00FF00'
  ```

  If a bit shift is invoked from within the `mysql` client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see  Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `~`

  Invert all bits.

  The result type depends on whether the bit argument is evaluated as a binary string or number:

  + Binary-string evaluation occurs when the bit argument has a binary string type, and is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to an unsigned 64-bit integer as necessary.
  + Binary-string evaluation produces a binary string of the same length as the bit argument. Numeric evaluation produces an unsigned 64-bit integer.

  For more information, see the introductory discussion in this section.

  ```
  mysql> SELECT 5 & ~1;
          -> 4
  mysql> SELECT HEX(~X'0000FFFF1111EEEE');
          -> 'FFFF0000EEEE1111'
  ```

  If bitwise inversion is invoked from within the `mysql` client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see  Section 6.5.1, “mysql — The MySQL Command-Line Client”.
*  `BIT_COUNT(N)`

  Returns the number of bits that are set in the argument *`N`* as an unsigned 64-bit integer, or `NULL` if the argument is `NULL`.

  ```
  mysql> SELECT BIT_COUNT(64), BIT_COUNT(BINARY 64);
          -> 1, 7
  mysql> SELECT BIT_COUNT('64'), BIT_COUNT(_binary '64');
          -> 1, 7
  mysql> SELECT BIT_COUNT(X'40'), BIT_COUNT(_binary X'40');
          -> 1, 1
  ```

Bit functions and operators comprise `BIT_COUNT()`, `BIT_AND()`, `BIT_OR()`, `BIT_XOR()`, `&`, `|`, `^`, `~`, `<<`, and `>>`. (The  `BIT_AND()`, `BIT_OR()`, and `BIT_XOR()` aggregate functions are described in  Section 14.19.1, “Aggregate Function Descriptions”.)

Bit functions and operators permit binary string type arguments ( `BINARY`, `VARBINARY`, and the `BLOB` types) and return a value of like type. Nonbinary string arguments are converted to `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

*  Bit Operations
*  Binary String Bit-Operation Examples
*  Bitwise AND, OR, and XOR Operations
*  Bitwise Complement and Shift Operations
*  BIT\_COUNT() Operations Operations")
*  BIT\_AND(), BIT\_OR(), and BIT\_XOR() Operations, BIT_OR(), and BIT_XOR() Operations")
* Special Handling of Hexadecimal Literals, Bit Literals, and NULL Literals

### Bit Operations

MySQL 8.4 handles binary string arguments directly (without conversion) and produces binary string results. Arguments that are not integers or binary strings are converted to integers.

Arguments that count as binary strings include column values, routine parameters, local variables, and user-defined variables that have a binary string type: `BINARY`, `VARBINARY`, or one of the `BLOB` types.

You can specify arguments to bit operations using hexadecimal literals or bit literals with the intent that they represent numbers; MySQL evaluates bit operations in numeric context when all bit arguments are hexadecimal or bit literals. For evaluation as binary strings instead, use the `_binary` introducer for at least one of the literal values.

* These bit operations evaluate the hexadecimal literals and bit literals as integers:

  ```
  mysql> SELECT X'40' | X'01', b'11110001' & b'01001111';
  +---------------+---------------------------+
  | X'40' | X'01' | b'11110001' & b'01001111' |
  +---------------+---------------------------+
  |            65 |                        65 |
  +---------------+---------------------------+
  ```
* These bit operations evaluate the hexadecimal literals and bit literals as binary strings, due to the `_binary` introducer:

  ```
  mysql> SELECT _binary X'40' | X'01', b'11110001' & _binary b'01001111';
  +-----------------------+-----------------------------------+
  | _binary X'40' | X'01' | b'11110001' & _binary b'01001111' |
  +-----------------------+-----------------------------------+
  | A                     | A                                 |
  +-----------------------+-----------------------------------+
  ```

Although the bit operations in both statements produce a result with a numeric value of 65, the second statement operates in binary-string context, for which 65 is ASCII `A`.

In numeric evaluation context, permitted values of hexadecimal literal and bit literal arguments have a maximum of 64 bits, as do results. By contrast, in binary-string evaluation context, permitted arguments (and results) can exceed 64 bits:

```
mysql> SELECT _binary X'4040404040404040' | X'0102030405060708';
+---------------------------------------------------+
| _binary X'4040404040404040' | X'0102030405060708' |
+---------------------------------------------------+
| ABCDEFGH                                          |
+---------------------------------------------------+
```

There are several ways to refer to a hexadecimal literal or bit literal in a bit operation to cause binary-string evaluation:

```
_binary literal
BINARY literal
CAST(literal AS BINARY)
```

Another way to produce binary-string evaluation of hexadecimal literals or bit literals is to assign them to user-defined variables, which results in variables that have a binary string type:

```
mysql> SET @v1 = X'40', @v2 = X'01', @v3 = b'11110001', @v4 = b'01001111';
mysql> SELECT @v1 | @v2, @v3 & @v4;
+-----------+-----------+
| @v1 | @v2 | @v3 & @v4 |
+-----------+-----------+
| A         | A         |
+-----------+-----------+
```

In binary-string context, bitwise operation arguments must have the same length or an `ER_INVALID_BITWISE_OPERANDS_SIZE` error occurs:

```
mysql> SELECT _binary X'40' | X'0001';
ERROR 3513 (HY000): Binary operands of bitwise
operators must be of equal length
```

To satisfy the equal-length requirement, pad the shorter value with leading zero digits or, if the longer value begins with leading zero digits and a shorter result value is acceptable, strip them:

```
mysql> SELECT _binary X'0040' | X'0001';
+---------------------------+
| _binary X'0040' | X'0001' |
+---------------------------+
|  A                        |
+---------------------------+
mysql> SELECT _binary X'40' | X'01';
+-----------------------+
| _binary X'40' | X'01' |
+-----------------------+
| A                     |
+-----------------------+
```

Padding or stripping can also be accomplished using functions such as  `LPAD()`, `RPAD()`, `SUBSTR()`, or `CAST()`. In such cases, the expression arguments are no longer all literals and `_binary` becomes unnecessary. Examples:

```
mysql> SELECT LPAD(X'40', 2, X'00') | X'0001';
+---------------------------------+
| LPAD(X'40', 2, X'00') | X'0001' |
+---------------------------------+
|  A                              |
+---------------------------------+
mysql> SELECT X'40' | SUBSTR(X'0001', 2, 1);
+-------------------------------+
| X'40' | SUBSTR(X'0001', 2, 1) |
+-------------------------------+
| A                             |
+-------------------------------+
```

See also Special Handling of Hexadecimal Literals, Bit Literals, and NULL Literals.

### Binary String Bit-Operation Examples

The following example illustrates use of bit operations to extract parts of a UUID value, in this case, the timestamp and IEEE 802 node number. This technique requires bitmasks for each extracted part.

Convert the text UUID to the corresponding 16-byte binary value so that it can be manipulated using bit operations in binary-string context:

```
mysql> SET @uuid = UUID_TO_BIN('6ccd780c-baba-1026-9564-5b8c656024db');
mysql> SELECT HEX(@uuid);
+----------------------------------+
| HEX(@uuid)                       |
+----------------------------------+
| 6CCD780CBABA102695645B8C656024DB |
+----------------------------------+
```

Construct bitmasks for the timestamp and node number parts of the value. The timestamp comprises the first three parts (64 bits, bits 0 to 63) and the node number is the last part (48 bits, bits 80 to 127):

```
mysql> SET @ts_mask = CAST(X'FFFFFFFFFFFFFFFF' AS BINARY(16));
mysql> SET @node_mask = CAST(X'FFFFFFFFFFFF' AS BINARY(16)) >> 80;
mysql> SELECT HEX(@ts_mask);
+----------------------------------+
| HEX(@ts_mask)                    |
+----------------------------------+
| FFFFFFFFFFFFFFFF0000000000000000 |
+----------------------------------+
mysql> SELECT HEX(@node_mask);
+----------------------------------+
| HEX(@node_mask)                  |
+----------------------------------+
| 00000000000000000000FFFFFFFFFFFF |
+----------------------------------+
```

The `CAST(... AS BINARY(16))` function is used here because the masks must be the same length as the UUID value against which they are applied. The same result can be produced using other functions to pad the masks to the required length:

```
SET @ts_mask= RPAD(X'FFFFFFFFFFFFFFFF' , 16, X'00');
SET @node_mask = LPAD(X'FFFFFFFFFFFF', 16, X'00') ;
```

Use the masks to extract the timestamp and node number parts:

```
mysql> SELECT HEX(@uuid & @ts_mask) AS 'timestamp part';
+----------------------------------+
| timestamp part                   |
+----------------------------------+
| 6CCD780CBABA10260000000000000000 |
+----------------------------------+
mysql> SELECT HEX(@uuid & @node_mask) AS 'node part';
+----------------------------------+
| node part                        |
+----------------------------------+
| 000000000000000000005B8C656024DB |
+----------------------------------+
```

The preceding example uses these bit operations: right shift ( `>>`) and bitwise AND ( `&`).

::: info Note

 `UUID_TO_BIN()` takes a flag that causes some bit rearrangement in the resulting binary UUID value. If you use that flag, modify the extraction masks accordingly.


:::

The next example uses bit operations to extract the network and host parts of an IPv6 address. Suppose that the network part has a length of 80 bits. Then the host part has a length of 128 − 80 = 48 bits. To extract the network and host parts of the address, convert it to a binary string, then use bit operations in binary-string context.

Convert the text IPv6 address to the corresponding binary string:

```
mysql> SET @ip = INET6_ATON('fe80::219:d1ff:fe91:1a72');
```

Define the network length in bits:

```
mysql> SET @net_len = 80;
```

Construct network and host masks by shifting the all-ones address left or right. To do this, begin with the address `::`, which is shorthand for all zeros, as you can see by converting it to a binary string like this:

```
mysql> SELECT HEX(INET6_ATON('::')) AS 'all zeros';
+----------------------------------+
| all zeros                        |
+----------------------------------+
| 00000000000000000000000000000000 |
+----------------------------------+
```

To produce the complementary value (all ones), use the `~` operator to invert the bits:

```
mysql> SELECT HEX(~INET6_ATON('::')) AS 'all ones';
+----------------------------------+
| all ones                         |
+----------------------------------+
| FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF |
+----------------------------------+
```

Shift the all-ones value left or right to produce the network and host masks:

```
mysql> SET @net_mask = ~INET6_ATON('::') << (128 - @net_len);
mysql> SET @host_mask = ~INET6_ATON('::') >> @net_len;
```

Display the masks to verify that they cover the correct parts of the address:

```
mysql> SELECT INET6_NTOA(@net_mask) AS 'network mask';
+----------------------------+
| network mask               |
+----------------------------+
| ffff:ffff:ffff:ffff:ffff:: |
+----------------------------+
mysql> SELECT INET6_NTOA(@host_mask) AS 'host mask';
+------------------------+
| host mask              |
+------------------------+
| ::ffff:255.255.255.255 |
+------------------------+
```

Extract and display the network and host parts of the address:

```
mysql> SET @net_part = @ip & @net_mask;
mysql> SET @host_part = @ip & @host_mask;
mysql> SELECT INET6_NTOA(@net_part) AS 'network part';
+-----------------+
| network part    |
+-----------------+
| fe80::219:0:0:0 |
+-----------------+
mysql> SELECT INET6_NTOA(@host_part) AS 'host part';
+------------------+
| host part        |
+------------------+
| ::d1ff:fe91:1a72 |
+------------------+
```

The preceding example uses these bit operations: Complement ( `~`), left shift ( `<<`), and bitwise AND ( `&`).

The remaining discussion provides details on argument handling for each group of bit operations, and more information about literal-value handling in bit operations.

### Bitwise AND, OR, and XOR Operations

For  `&`, `|`, and `^` bit operations, the result type depends on whether the arguments are evaluated as binary strings or numbers:

* Binary-string evaluation occurs when the arguments have a binary string type, and at least one of them is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to unsigned 64-bit integers as necessary.
* Binary-string evaluation produces a binary string of the same length as the arguments. If the arguments have unequal lengths, an `ER_INVALID_BITWISE_OPERANDS_SIZE` error occurs. Numeric evaluation produces an unsigned 64-bit integer.

Examples of numeric evaluation:

```
mysql> SELECT 64 | 1, X'40' | X'01';
+--------+---------------+
| 64 | 1 | X'40' | X'01' |
+--------+---------------+
|     65 |            65 |
+--------+---------------+
```

Examples of binary-string evaluation:

```
mysql> SELECT _binary X'40' | X'01';
+-----------------------+
| _binary X'40' | X'01' |
+-----------------------+
| A                     |
+-----------------------+
mysql> SET @var1 = X'40', @var2 = X'01';
mysql> SELECT @var1 | @var2;
+---------------+
| @var1 | @var2 |
+---------------+
| A             |
+---------------+
```

### Bitwise Complement and Shift Operations

For  `~`, `<<`, and `>>` bit operations, the result type depends on whether the bit argument is evaluated as a binary string or number:

* Binary-string evaluation occurs when the bit argument has a binary string type, and is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument conversion to an unsigned 64-bit integer as necessary.
* Binary-string evaluation produces a binary string of the same length as the bit argument. Numeric evaluation produces an unsigned 64-bit integer.

For shift operations, bits shifted off the end of the value are lost without warning, regardless of the argument type. In particular, if the shift count is greater or equal to the number of bits in the bit argument, all bits in the result are 0.

Examples of numeric evaluation:

```
mysql> SELECT ~0, 64 << 2, X'40' << 2;
+----------------------+---------+------------+
| ~0                   | 64 << 2 | X'40' << 2 |
+----------------------+---------+------------+
| 18446744073709551615 |     256 |        256 |
+----------------------+---------+------------+
```

Examples of binary-string evaluation:

```
mysql> SELECT HEX(_binary X'1111000022220000' >> 16);
+----------------------------------------+
| HEX(_binary X'1111000022220000' >> 16) |
+----------------------------------------+
| 0000111100002222                       |
+----------------------------------------+
mysql> SELECT HEX(_binary X'1111000022220000' << 16);
+----------------------------------------+
| HEX(_binary X'1111000022220000' << 16) |
+----------------------------------------+
| 0000222200000000                       |
+----------------------------------------+
mysql> SET @var1 = X'F0F0F0F0';
mysql> SELECT HEX(~@var1);
+-------------+
| HEX(~@var1) |
+-------------+
| 0F0F0F0F    |
+-------------+
```

### BIT\_COUNT() Operations

The  `BIT_COUNT()` function always returns an unsigned 64-bit integer, or `NULL` if the argument is `NULL`.

```
mysql> SELECT BIT_COUNT(127);
+----------------+
| BIT_COUNT(127) |
+----------------+
|              7 |
+----------------+
mysql> SELECT BIT_COUNT(b'010101'), BIT_COUNT(_binary b'010101');
+----------------------+------------------------------+
| BIT_COUNT(b'010101') | BIT_COUNT(_binary b'010101') |
+----------------------+------------------------------+
|                    3 |                            3 |
+----------------------+------------------------------+
```

### BIT\_AND(), BIT\_OR(), and BIT\_XOR() Operations

For the  `BIT_AND()`, `BIT_OR()`, and `BIT_XOR()` bit functions, the result type depends on whether the function argument values are evaluated as binary strings or numbers:

* Binary-string evaluation occurs when the argument values have a binary string type, and the argument is not a hexadecimal literal, bit literal, or `NULL` literal. Numeric evaluation occurs otherwise, with argument value conversion to unsigned 64-bit integers as necessary.
* Binary-string evaluation produces a binary string of the same length as the argument values. If argument values have unequal lengths, an `ER_INVALID_BITWISE_OPERANDS_SIZE` error occurs. If the argument size exceeds 511 bytes, an `ER_INVALID_BITWISE_AGGREGATE_OPERANDS_SIZE` error occurs. Numeric evaluation produces an unsigned 64-bit integer.

`NULL` values do not affect the result unless all values are `NULL`. In that case, the result is a neutral value having the same length as the length of the argument values (all bits 1 for `BIT_AND()`, all bits 0 for `BIT_OR()`, and `BIT_XOR()`).

Example:

```
mysql> CREATE TABLE t (group_id INT, a VARBINARY(6));
mysql> INSERT INTO t VALUES (1, NULL);
mysql> INSERT INTO t VALUES (1, NULL);
mysql> INSERT INTO t VALUES (2, NULL);
mysql> INSERT INTO t VALUES (2, X'1234');
mysql> INSERT INTO t VALUES (2, X'FF34');
mysql> SELECT HEX(BIT_AND(a)), HEX(BIT_OR(a)), HEX(BIT_XOR(a))
       FROM t GROUP BY group_id;
+-----------------+----------------+-----------------+
| HEX(BIT_AND(a)) | HEX(BIT_OR(a)) | HEX(BIT_XOR(a)) |
+-----------------+----------------+-----------------+
| FFFFFFFFFFFF    | 000000000000   | 000000000000    |
| 1234            | FF34           | ED00            |
+-----------------+----------------+-----------------+
```

### Special Handling of Hexadecimal Literals, Bit Literals, and NULL Literals

MySQL 8.4 evaluates bit operations in numeric context when all bit arguments are hexadecimal literals, bit literals, or `NULL` literals. That is, bit operations on binary-string bit arguments do not use binary-string evaluation if all bit arguments are unadorned hexadecimal literals, bit literals, or `NULL` literals. (This does not apply to such literals if they are written with a `_binary` introducer, `BINARY` operator, or other way of specifying them explicitly as binary strings.)

Examples:

* These bit operations evaluate the literals in numeric context and produce a `BIGINT` result:

  ```
  b'0001' | b'0010'
  X'0008' << 8
  ```
* These bit operations evaluate `NULL` in numeric context and produce a `BIGINT` result that has a `NULL` value:

  ```
  NULL & NULL
  NULL >> 4
  ```

You can cause those operations to evaluate the arguments in binary-string context by indicating explicitly that at least one argument is a binary string:

```
_binary b'0001' | b'0010'
_binary X'0008' << 8
BINARY NULL & NULL
BINARY NULL >> 4
```

The result of the last two expressions is `NULL`, just as without the `BINARY` operator, but the data type of the result is a binary string type rather than an integer type.


