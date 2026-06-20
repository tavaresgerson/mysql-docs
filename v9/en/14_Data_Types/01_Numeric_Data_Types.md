## 13.1 Numeric Data Types

MySQL supports all standard SQL numeric data types. These types include the exact numeric data types (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `DECIMAL` - DECIMAL, NUMERIC"), and `NUMERIC` - DECIMAL, NUMERIC")), as well as the approximate numeric data types (`FLOAT` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE"), and `DOUBLE PRECISION` - FLOAT, DOUBLE")). The keyword `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") is a synonym for `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), and the keywords `DEC` - DECIMAL, NUMERIC") and `FIXED` - DECIMAL, NUMERIC") are synonyms for `DECIMAL` - DECIMAL, NUMERIC"). MySQL treats `DOUBLE` - FLOAT, DOUBLE") as a synonym for `DOUBLE PRECISION` - FLOAT, DOUBLE") (a nonstandard extension). MySQL also treats `REAL` - FLOAT, DOUBLE") as a synonym for `DOUBLE PRECISION` - FLOAT, DOUBLE") (a nonstandard variation), unless the `REAL_AS_FLOAT` SQL mode is enabled.

The `BIT` data type stores bit values and is supported for `MyISAM`, `MEMORY`, `InnoDB`, and `NDB` tables.

For information about how MySQL handles assignment of out-of-range values to columns and overflow during expression evaluation, see Section 13.1.7, “Out-of-Range and Overflow Handling”.

For information about storage requirements of the numeric data types, see Section 13.7, “Data Type Storage Requirements”.

For descriptions of functions that operate on numeric values, see Section 14.6, “Numeric Functions and Operators”. The data type used for the result of a calculation on numeric operands depends on the types of the operands and the operations performed on them. For more information, see Section 14.6.1, “Arithmetic Operators”.


### 13.1.1 Numeric Data Type Syntax

For integer data types, *`M`* indicates the minimum display width. The maximum display width is 255. Display width is unrelated to the range of values a type can store, as described in Section 13.1.6, “Numeric Type Attributes”.

For floating-point and fixed-point data types, *`M`* is the total number of digits that can be stored.

The display width attribute is deprecated for integer data types; you should expect support for it to be removed in a future version of MySQL.

If you specify `ZEROFILL` for a numeric column, MySQL automatically adds the `UNSIGNED` attribute to the column.

The `ZEROFILL` attribute is deprecated for numeric data types; you should expect support for it to be removed in a future version of MySQL. Consider using an alternative means of producing the effect of this attribute. For example, applications could use the `LPAD()` function to zero-pad numbers up to the desired width, or they could store the formatted numbers in `CHAR` columns.

Numeric data types that permit the `UNSIGNED` attribute also permit `SIGNED`. However, these data types are signed by default, so the `SIGNED` attribute has no effect.

The `UNSIGNED` attribute is deprecated for columns of type `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), and `DECIMAL` - DECIMAL, NUMERIC") (and any synonyms); you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

`SERIAL` is an alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

`SERIAL DEFAULT VALUE` in the definition of an integer column is an alias for `NOT NULL AUTO_INCREMENT UNIQUE`.

Warning

When you use subtraction between integer values where one is of type `UNSIGNED`, the result is unsigned unless the `NO_UNSIGNED_SUBTRACTION` SQL mode is enabled. See Section 14.10, “Cast Functions and Operators”.

* `BIT[(M)]`

  A bit-value type. *`M`* indicates the number of bits per value, from 1 to 64. The default is 1 if *`M`* is omitted.

* [`TINYINT[(M)] [UNSIGNED] [ZEROFILL]`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  A very small integer. The signed range is `-128` to `127`. The unsigned range is `0` to `255`.

* `BOOL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BOOLEAN` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  These types are synonyms for `TINYINT(1)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). A value of zero is considered false. Nonzero values are considered true:

  ```
  mysql> SELECT IF(0, 'true', 'false');
  +------------------------+
  | IF(0, 'true', 'false') |
  +------------------------+
  | false                  |
  +------------------------+

  mysql> SELECT IF(1, 'true', 'false');
  +------------------------+
  | IF(1, 'true', 'false') |
  +------------------------+
  | true                   |
  +------------------------+

  mysql> SELECT IF(2, 'true', 'false');
  +------------------------+
  | IF(2, 'true', 'false') |
  +------------------------+
  | true                   |
  +------------------------+
  ```

  However, the values `TRUE` and `FALSE` are merely aliases for `1` and `0`, respectively, as shown here:

  ```
  mysql> SELECT IF(0 = FALSE, 'true', 'false');
  +--------------------------------+
  | IF(0 = FALSE, 'true', 'false') |
  +--------------------------------+
  | true                           |
  +--------------------------------+

  mysql> SELECT IF(1 = TRUE, 'true', 'false');
  +-------------------------------+
  | IF(1 = TRUE, 'true', 'false') |
  +-------------------------------+
  | true                          |
  +-------------------------------+

  mysql> SELECT IF(2 = TRUE, 'true', 'false');
  +-------------------------------+
  | IF(2 = TRUE, 'true', 'false') |
  +-------------------------------+
  | false                         |
  +-------------------------------+

  mysql> SELECT IF(2 = FALSE, 'true', 'false');
  +--------------------------------+
  | IF(2 = FALSE, 'true', 'false') |
  +--------------------------------+
  | false                          |
  +--------------------------------+
  ```

  The last two statements display the results shown because `2` is equal to neither `1` nor `0`.

* [`SMALLINT[(M)] [UNSIGNED] [ZEROFILL]`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  A small integer. The signed range is `-32768` to `32767`. The unsigned range is `0` to `65535`.

* [`MEDIUMINT[(M)] [UNSIGNED] [ZEROFILL]`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  A medium-sized integer. The signed range is `-8388608` to `8388607`. The unsigned range is `0` to `16777215`.

* [`INT[(M)] [UNSIGNED] [ZEROFILL]`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  A normal-size integer. The signed range is `-2147483648` to `2147483647`. The unsigned range is `0` to `4294967295`.

* [`INTEGER[(M)] [UNSIGNED] [ZEROFILL]`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  This type is a synonym for `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

* [`BIGINT[(M)] [UNSIGNED] [ZEROFILL]`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  A large integer. The signed range is `-9223372036854775808` to `9223372036854775807`. The unsigned range is `0` to `18446744073709551615`.

  `SERIAL` is an alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

  Some things you should be aware of with respect to `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns:

  + All arithmetic is done using signed `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or `DOUBLE` - FLOAT, DOUBLE") values, so you should not use unsigned big integers larger than `9223372036854775807` (63 bits) except with bit functions! If you do that, some of the last digits in the result may be wrong because of rounding errors when converting a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") value to a `DOUBLE` - FLOAT, DOUBLE").

    MySQL can handle `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") in the following cases:

    - When using integers to store large unsigned values in a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column.

    - In `MIN(col_name)` or `MAX(col_name)`, where *`col_name`* refers to a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column.

    - When using operators (`+`, `-`, `*`, and so on) where both operands are integers.

  + You can always store an exact integer value in a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column by storing it using a string. In this case, MySQL performs a string-to-number conversion that involves no intermediate double-precision representation.

  + The `-`, `+`, and `*` operators use `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") arithmetic when both operands are integer values. This means that if you multiply two big integers (or results from functions that return integers), you may get unexpected results when the result is larger than `9223372036854775807`.

* [`DECIMAL[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")

  A packed “exact” fixed-point number. *`M`* is the total number of digits (the precision) and *`D`* is the number of digits after the decimal point (the scale). The decimal point and (for negative numbers) the `-` sign are not counted in *`M`*. If *`D`* is 0, values have no decimal point or fractional part. The maximum number of digits (*`M`*) for `DECIMAL` - DECIMAL, NUMERIC") is 65. The maximum number of supported decimals (*`D`*) is 30. If *`D`* is omitted, the default is 0. If *`M`* is omitted, the default is 10. (There is also a limit on how long the text of `DECIMAL` - DECIMAL, NUMERIC") literals can be; see Section 14.25.3, “Expression Handling”.)

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `DECIMAL` - DECIMAL, NUMERIC") (and any synonyms); you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

  All basic calculations (`+, -, *, /`) with `DECIMAL` - DECIMAL, NUMERIC") columns are done with a precision of 65 digits.

* [`DEC[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), [`NUMERIC[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), [`FIXED[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")

  These types are synonyms for `DECIMAL` - DECIMAL, NUMERIC"). The `FIXED` - DECIMAL, NUMERIC") synonym is available for compatibility with other database systems.

* [`FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  A small (single-precision) floating-point number. Permissible values are `-3.402823466E+38` to `-1.175494351E-38`, `0`, and `1.175494351E-38` to `3.402823466E+38`. These are the theoretical limits, based on the IEEE standard. The actual range might be slightly smaller depending on your hardware or operating system.

  *`M`* is the total number of digits and *`D`* is the number of digits following the decimal point. If *`M`* and *`D`* are omitted, values are stored to the limits permitted by the hardware. A single-precision floating-point number is accurate to approximately 7 decimal places.

  `FLOAT(M,D)` is a nonstandard MySQL extension. This syntax is deprecated, and you should expect support for it to be removed in a future version of MySQL.

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `FLOAT` - FLOAT, DOUBLE") (and any synonyms) and you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

  Using `FLOAT` - FLOAT, DOUBLE") might give you some unexpected problems because all calculations in MySQL are done with double precision. See Section B.3.4.7, “Solving Problems with No Matching Rows”.

* [`FLOAT(p) [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  A floating-point number. *`p`* represents the precision in bits, but MySQL uses this value only to determine whether to use `FLOAT` - FLOAT, DOUBLE") or `DOUBLE` - FLOAT, DOUBLE") for the resulting data type. If *`p`* is from 0 to 24, the data type becomes `FLOAT` - FLOAT, DOUBLE") with no *`M`* or *`D`* values. If *`p`* is from 25 to 53, the data type becomes `DOUBLE` - FLOAT, DOUBLE") with no *`M`* or *`D`* values. The range of the resulting column is the same as for the single-precision `FLOAT` - FLOAT, DOUBLE") or double-precision `DOUBLE` - FLOAT, DOUBLE") data types described earlier in this section.

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `FLOAT` - FLOAT, DOUBLE") (and any synonyms) and you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

  `FLOAT(p)` - FLOAT, DOUBLE") syntax is provided for ODBC compatibility.

* [`DOUBLE[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  A normal-size (double-precision) floating-point number. Permissible values are `-1.7976931348623157E+308` to `-2.2250738585072014E-308`, `0`, and `2.2250738585072014E-308` to `1.7976931348623157E+308`. These are the theoretical limits, based on the IEEE standard. The actual range might be slightly smaller depending on your hardware or operating system.

  *`M`* is the total number of digits and *`D`* is the number of digits following the decimal point. If *`M`* and *`D`* are omitted, values are stored to the limits permitted by the hardware. A double-precision floating-point number is accurate to approximately 15 decimal places.

  `DOUBLE(M,D)` is a nonstandard MySQL extension; and is deprecated. You should expect support for this syntax to be removed in a future version of MySQL.

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `DOUBLE` - FLOAT, DOUBLE") (and any synonyms) and you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

* [`DOUBLE PRECISION[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), [`REAL[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  These types are synonyms for `DOUBLE` - FLOAT, DOUBLE"). Exception: If the `REAL_AS_FLOAT` SQL mode is enabled, `REAL` - FLOAT, DOUBLE") is a synonym for `FLOAT` - FLOAT, DOUBLE") rather than `DOUBLE` - FLOAT, DOUBLE").


### 13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

MySQL supports the SQL standard integer types `INTEGER` (or `INT`) and `SMALLINT`. As an extension to the standard, MySQL also supports the integer types `TINYINT`, `MEDIUMINT`, and `BIGINT`. The following table shows the required storage and range for each integer type.

**Table 13.1 Required Storage and Range for Integer Types Supported by MySQL**

<table summary="Required storage and range for integer types supported by MySQL. Information includes the integer type, the storage size in bytes, the minimum signed and unsigned values, and the maximum signed and unsigned values."><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><col style="width: 16%"/><thead><tr> <th scope="col">Type</th> <th scope="col">Storage (Bytes)</th> <th scope="col">Minimum Value Signed</th> <th scope="col">Minimum Value Unsigned</th> <th scope="col">Maximum Value Signed</th> <th scope="col">Maximum Value Unsigned</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">TINYINT</code></th> <td>1</td> <td><code class="literal">-128</code></td> <td><code class="literal">0</code></td> <td><code class="literal">127</code></td> <td><code class="literal">255</code></td> </tr><tr> <th scope="row"><code class="literal">SMALLINT</code></th> <td>2</td> <td><code class="literal">-32768</code></td> <td><code class="literal">0</code></td> <td><code class="literal">32767</code></td> <td><code class="literal">65535</code></td> </tr><tr> <th scope="row"><code class="literal">MEDIUMINT</code></th> <td>3</td> <td><code class="literal">-8388608</code></td> <td><code class="literal">0</code></td> <td><code class="literal">8388607</code></td> <td><code class="literal">16777215</code></td> </tr><tr> <th scope="row"><code class="literal">INT</code></th> <td>4</td> <td><code class="literal">-2147483648</code></td> <td><code class="literal">0</code></td> <td><code class="literal">2147483647</code></td> <td><code class="literal">4294967295</code></td> </tr><tr> <th scope="row"><code class="literal">BIGINT</code></th> <td>8</td> <td><code class="literal">-2<sup>63</sup></code></td> <td><code class="literal">0</code></td> <td><code class="literal">2<sup>63</sup>-1</code></td> <td><code class="literal">2<sup>64</sup>-1</code></td> </tr></tbody></table>


### 13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC

The `DECIMAL` and `NUMERIC` types store exact numeric data values. These types are used when it is important to preserve exact precision, for example with monetary data. In MySQL, `NUMERIC` is implemented as `DECIMAL`, so the following remarks about `DECIMAL` apply equally to `NUMERIC`.

MySQL stores `DECIMAL` values in binary format. See Section 14.25, “Precision Math”.

In a `DECIMAL` column declaration, the precision and scale can be (and usually is) specified. For example:

```
salary DECIMAL(5,2)
```

In this example, `5` is the precision and `2` is the scale. The precision represents the number of significant digits that are stored for values, and the scale represents the number of digits that can be stored following the decimal point.

Standard SQL requires that `DECIMAL(5,2)` be able to store any value with five digits and two decimals, so values that can be stored in the `salary` column range from `-999.99` to `999.99`.

In standard SQL, the syntax `DECIMAL(M)` is equivalent to `DECIMAL(M,0)`. Similarly, the syntax `DECIMAL` is equivalent to `DECIMAL(M,0)`, where the implementation is permitted to decide the value of *`M`*. MySQL supports both of these variant forms of `DECIMAL` syntax. The default value of *`M`* is 10.

If the scale is 0, `DECIMAL` values contain no decimal point or fractional part.

The maximum number of digits for `DECIMAL` is 65, but the actual range for a given `DECIMAL` column can be constrained by the precision or scale for a given column. When such a column is assigned a value with more digits following the decimal point than are permitted by the specified scale, the value is converted to that scale. (The precise behavior is operating system-specific, but generally the effect is truncation to the permissible number of digits.)


### 13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE

The `FLOAT` and `DOUBLE` types represent approximate numeric data values. MySQL uses four bytes for single-precision values and eight bytes for double-precision values.

For `FLOAT`, the SQL standard permits an optional specification of the precision (but not the range of the exponent) in bits following the keyword `FLOAT` in parentheses, that is, `FLOAT(p)` - FLOAT, DOUBLE"). MySQL also supports this optional precision specification, but the precision value in `FLOAT(p)` - FLOAT, DOUBLE") is used only to determine storage size. A precision from 0 to 23 results in a 4-byte single-precision `FLOAT` column. A precision from 24 to 53 results in an 8-byte double-precision `DOUBLE` column.

MySQL permits a nonstandard syntax: `FLOAT(M,D)` or `REAL(M,D)` or `DOUBLE PRECISION(M,D)`. Here, `(M,D)` means than values can be stored with up to *`M`* digits in total, of which *`D`* digits may be after the decimal point. For example, a column defined as `FLOAT(7,4)` is displayed as `-999.9999`. MySQL performs rounding when storing values, so if you insert `999.00009` into a `FLOAT(7,4)` column, the approximate result is `999.0001`.

`FLOAT(M,D)`and `DOUBLE(M,D)` are nonstandard MySQL extensions; and are deprecated. You should expect support for these variants to be removed in a future version of MySQL.

Because floating-point values are approximate and not stored as exact values, attempts to treat them as exact in comparisons may lead to problems. They are also subject to platform or implementation dependencies. For more information, see Section B.3.4.8, “Problems with Floating-Point Values”.

For maximum portability, code requiring storage of approximate numeric data values should use `FLOAT` or `DOUBLE PRECISION` with no specification of precision or number of digits.


### 13.1.5 Bit-Value Type - BIT

The `BIT` data type is used to store bit values. A type of `BIT(M)` enables storage of *`M`*-bit values. *`M`* can range from 1 to 64.

To specify bit values, `b'value'` notation can be used. *`value`* is a binary value written using zeros and ones. For example, `b'111'` and `b'10000000'` represent 7 and 128, respectively. See Section 11.1.5, “Bit-Value Literals”.

If you assign a value to a `BIT(M)` column that is less than *`M`* bits long, the value is padded on the left with zeros. For example, assigning a value of `b'101'` to a `BIT(6)` column is, in effect, the same as assigning `b'000101'`.

**NDB Cluster.** The maximum combined size of all `BIT` columns used in a given `NDB` table must not exceed 4096 bits.


### 13.1.6 Numeric Type Attributes

MySQL supports an extension for optionally specifying the display width of integer data types in parentheses following the base keyword for the type. For example, `INT(4)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") specifies an `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") with a display width of four digits. This optional display width may be used by applications to display integer values having a width less than the width specified for the column by left-padding them with spaces. (That is, this width is present in the metadata returned with result sets. Whether it is used is up to the application.)

The display width does *not* constrain the range of values that can be stored in the column. Nor does it prevent values wider than the column display width from being displayed correctly. For example, a column specified as `SMALLINT(3)` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") has the usual `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") range of `-32768` to `32767`, and values outside the range permitted by three digits are displayed in full using more than three digits.

When used in conjunction with the optional (nonstandard) `ZEROFILL` attribute, the default padding of spaces is replaced with zeros. For example, for a column declared as `INT(4) ZEROFILL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), a value of `5` is retrieved as `0005`.

Note

The `ZEROFILL` attribute is ignored for columns involved in expressions or `UNION` queries.

If you store values larger than the display width in an integer column that has the `ZEROFILL` attribute, you may experience problems when MySQL generates temporary tables for some complicated joins. In these cases, MySQL assumes that the data values fit within the column display width.

The `ZEROFILL` attribute is deprecated for numeric data types, as is the display width attribute for integer data types. You should expect support for `ZEROFILL` and display widths for integer data types to be removed in a future version of MySQL. Consider using an alternative means of producing the effect of these attributes. For example, applications can use the `LPAD()` function to zero-pad numbers up to the desired width, or they can store the formatted numbers in `CHAR` columns.

All integer types can have an optional (nonstandard) `UNSIGNED` attribute. An unsigned type can be used to permit only nonnegative numbers in a column or when you need a larger upper numeric range for the column. For example, if an `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column is `UNSIGNED`, the size of the column's range is the same but its endpoints shift up, from `-2147483648` and `2147483647` to `0` and `4294967295`.

Floating-point and fixed-point types also can be `UNSIGNED`. As with integer types, this attribute prevents negative values from being stored in the column. Unlike the integer types, the upper range of column values remains the same. `UNSIGNED` is deprecated for columns of type `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), and `DECIMAL` - DECIMAL, NUMERIC") (and any synonyms) and you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

If you specify `ZEROFILL` for a numeric column, MySQL automatically adds the `UNSIGNED` attribute.

Integer or floating-point data types can have the `AUTO_INCREMENT` attribute. When you insert a value of `NULL` into an indexed `AUTO_INCREMENT` column, the column is set to the next sequence value. Typically this is `value+1`, where *`value`* is the largest value for the column currently in the table. (`AUTO_INCREMENT` sequences begin with `1`.)

Storing `0` into an `AUTO_INCREMENT` column has the same effect as storing `NULL`, unless the `NO_AUTO_VALUE_ON_ZERO` SQL mode is enabled.

Inserting `NULL` to generate `AUTO_INCREMENT` values requires that the column be declared `NOT NULL`. If the column is declared `NULL`, inserting `NULL` stores a `NULL`. When you insert any other value into an `AUTO_INCREMENT` column, the column is set to that value and the sequence is reset so that the next automatically generated value follows sequentially from the inserted value.

Negative values for `AUTO_INCREMENT` columns are not supported.

`CHECK` constraints cannot refer to columns that have the `AUTO_INCREMENT` attribute, nor can the `AUTO_INCREMENT` attribute be added to existing columns that are used in `CHECK` constraints.

`AUTO_INCREMENT` is deprecated for `FLOAT` - FLOAT, DOUBLE") and `DOUBLE` - FLOAT, DOUBLE") columns; you should expect support for it to be removed in a future version of MySQL. Consider removing the `AUTO_INCREMENT` attribute from such columns to avoid potential compatibility issues, or convert them to an integer type.


### 13.1.7 Out-of-Range and Overflow Handling

When MySQL stores a value in a numeric column that is outside the permissible range of the column data type, the result depends on the SQL mode in effect at the time:

* If strict SQL mode is enabled, MySQL rejects the out-of-range value with an error, and the insert fails, in accordance with the SQL standard.

* If no restrictive modes are enabled, MySQL clips the value to the appropriate endpoint of the column data type range and stores the resulting value instead.

  When an out-of-range value is assigned to an integer column, MySQL stores the value representing the corresponding endpoint of the column data type range.

  When a floating-point or fixed-point column is assigned a value that exceeds the range implied by the specified (or default) precision and scale, MySQL stores the value representing the corresponding endpoint of that range.

Suppose that a table `t1` has this definition:

```
CREATE TABLE t1 (i1 TINYINT, i2 TINYINT UNSIGNED);
```

With strict SQL mode enabled, an out of range error occurs:

```
mysql> SET sql_mode = 'TRADITIONAL';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
ERROR 1264 (22003): Out of range value for column 'i1' at row 1
mysql> SELECT * FROM t1;
Empty set (0.00 sec)
```

With strict SQL mode not enabled, clipping with warnings occurs:

```
mysql> SET sql_mode = '';
mysql> INSERT INTO t1 (i1, i2) VALUES(256, 256);
mysql> SHOW WARNINGS;
+---------+------+---------------------------------------------+
| Level   | Code | Message                                     |
+---------+------+---------------------------------------------+
| Warning | 1264 | Out of range value for column 'i1' at row 1 |
| Warning | 1264 | Out of range value for column 'i2' at row 1 |
+---------+------+---------------------------------------------+
mysql> SELECT * FROM t1;
+------+------+
| i1   | i2   |
+------+------+
|  127 |  255 |
+------+------+
```

When strict SQL mode is not enabled, column-assignment conversions that occur due to clipping are reported as warnings for `ALTER TABLE`, `LOAD DATA`, `UPDATE`, and multiple-row `INSERT` statements. In strict mode, these statements fail, and some or all the values are not inserted or changed, depending on whether the table is a transactional table and other factors. For details, see Section 7.1.11, “Server SQL Modes”.

Overflow during numeric expression evaluation results in an error. For example, the largest signed `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") value is 9223372036854775807, so the following expression produces an error:

```
mysql> SELECT 9223372036854775807 + 1;
ERROR 1690 (22003): BIGINT value is out of range in '(9223372036854775807 + 1)'
```

To enable the operation to succeed in this case, convert the value to unsigned;

```
mysql> SELECT CAST(9223372036854775807 AS UNSIGNED) + 1;
+-------------------------------------------+
| CAST(9223372036854775807 AS UNSIGNED) + 1 |
+-------------------------------------------+
|                       9223372036854775808 |
+-------------------------------------------+
```

Whether overflow occurs depends on the range of the operands, so another way to handle the preceding expression is to use exact-value arithmetic because `DECIMAL` - DECIMAL, NUMERIC") values have a larger range than integers:

```
mysql> SELECT 9223372036854775807.0 + 1;
+---------------------------+
| 9223372036854775807.0 + 1 |
+---------------------------+
|     9223372036854775808.0 |
+---------------------------+
```

Subtraction between integer values, where one is of type `UNSIGNED`, produces an unsigned result by default. If the result would otherwise have been negative, an error results:

```
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT CAST(0 AS UNSIGNED) - 1;
ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
```

If the `NO_UNSIGNED_SUBTRACTION` SQL mode is enabled, the result is negative:

```
mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
mysql> SELECT CAST(0 AS UNSIGNED) - 1;
+-------------------------+
| CAST(0 AS UNSIGNED) - 1 |
+-------------------------+
|                      -1 |
+-------------------------+
```

If the result of such an operation is used to update an `UNSIGNED` integer column, the result is clipped to the maximum value for the column type, or clipped to 0 if `NO_UNSIGNED_SUBTRACTION` is enabled. If strict SQL mode is enabled, an error occurs and the column remains unchanged.
