--- title: MySQL 8.4 Reference Manual :: 13.1.1 Numeric Data Type Syntax url: https://dev.mysql.com/doc/refman/8.4/en/numeric-type-syntax.html order: 3 ---



### 13.1.1 Numeric Data Type Syntax

For integer data types, *`M`* indicates the minimum display width. The maximum display width is 255. Display width is unrelated to the range of values a type can store, as described in Section 13.1.6, “Numeric Type Attributes”.

For floating-point and fixed-point data types, *`M`* is the total number of digits that can be stored.

The display width attribute is deprecated for integer data types; you should expect support for it to be removed in a future version of MySQL.

If you specify `ZEROFILL` for a numeric column, MySQL automatically adds the `UNSIGNED` attribute to the column.

The `ZEROFILL` attribute is deprecated for numeric data types; you should expect support for it to be removed in a future version of MySQL. Consider using an alternative means of producing the effect of this attribute. For example, applications could use the `LPAD()` function to zero-pad numbers up to the desired width, or they could store the formatted numbers in  `CHAR` columns.

Numeric data types that permit the `UNSIGNED` attribute also permit `SIGNED`. However, these data types are signed by default, so the `SIGNED` attribute has no effect.

The `UNSIGNED` attribute is deprecated for columns of type  `FLOAT` - FLOAT, DOUBLE"), `DOUBLE` - FLOAT, DOUBLE"), and `DECIMAL` - DECIMAL, NUMERIC") (and any synonyms); you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

`SERIAL` is an alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`.

`SERIAL DEFAULT VALUE` in the definition of an integer column is an alias for `NOT NULL AUTO_INCREMENT UNIQUE`.

Warning

When you use subtraction between integer values where one is of type `UNSIGNED`, the result is unsigned unless the `NO_UNSIGNED_SUBTRACTION` SQL mode is enabled. See  Section 14.10, “Cast Functions and Operators”.

*  `BIT[(M)]`

  A bit-value type. *`M`* indicates the number of bits per value, from 1 to 64. The default is 1 if *`M`* is omitted.
* [`TINYINT[(M)] [UNSIGNED] [ZEROFILL]`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

  A very small integer. The signed range is `-128` to `127`. The unsigned range is `0` to `255`.
*  `BOOL` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `BOOLEAN` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")

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

    MySQL can handle  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") in the following cases:

    - When using integers to store large unsigned values in a  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column.
    - In `MIN(col_name)` or `MAX(col_name)`, where *`col_name`* refers to a  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column.
    - When using operators ( `+`, `-`, `*`, and so on) where both operands are integers.
  + You can always store an exact integer value in a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column by storing it using a string. In this case, MySQL performs a string-to-number conversion that involves no intermediate double-precision representation.
  + The  `-`, `+`, and `*` operators use  `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") arithmetic when both operands are integer values. This means that if you multiply two big integers (or results from functions that return integers), you may get unexpected results when the result is larger than `9223372036854775807`.
* [`DECIMAL[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")

  A packed “exact” fixed-point number. *`M`* is the total number of digits (the precision) and *`D`* is the number of digits after the decimal point (the scale). The decimal point and (for negative numbers) the `-` sign are not counted in *`M`*. If *`D`* is 0, values have no decimal point or fractional part. The maximum number of digits (*`M`*) for `DECIMAL` - DECIMAL, NUMERIC") is 65. The maximum number of supported decimals (*`D`*) is 30. If *`D`* is omitted, the default is 0. If *`M`* is omitted, the default is 10. (There is also a limit on how long the text of  `DECIMAL` - DECIMAL, NUMERIC") literals can be; see  Section 14.24.3, “Expression Handling”.)

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `DECIMAL` - DECIMAL, NUMERIC") (and any synonyms); you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

  All basic calculations (`+, -, *, /`) with `DECIMAL` - DECIMAL, NUMERIC") columns are done with a precision of 65 digits.
* [`DEC[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), [`NUMERIC[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), [`FIXED[(M[,D])] [UNSIGNED] [ZEROFILL]`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")

  These types are synonyms for `DECIMAL` - DECIMAL, NUMERIC"). The `FIXED` - DECIMAL, NUMERIC") synonym is available for compatibility with other database systems.
* [`FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  A small (single-precision) floating-point number. Permissible values are `-3.402823466E+38` to `-1.175494351E-38`, `0`, and `1.175494351E-38` to `3.402823466E+38`. These are the theoretical limits, based on the IEEE standard. The actual range might be slightly smaller depending on your hardware or operating system.

  *`M`* is the total number of digits and *`D`* is the number of digits following the decimal point. If *`M`* and *`D`* are omitted, values are stored to the limits permitted by the hardware. A single-precision floating-point number is accurate to approximately 7 decimal places.

  `FLOAT(M,D)` is a nonstandard MySQL extension. This syntax is deprecated, and you should expect support for it to be removed in a future version of MySQL.

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `FLOAT` - FLOAT, DOUBLE") (and any synonyms) and you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

  Using  `FLOAT` - FLOAT, DOUBLE") might give you some unexpected problems because all calculations in MySQL are done with double precision. See Section B.3.4.7, “Solving Problems with No Matching Rows”.
* [`FLOAT(p) [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  A floating-point number. *`p`* represents the precision in bits, but MySQL uses this value only to determine whether to use `FLOAT` - FLOAT, DOUBLE") or `DOUBLE` - FLOAT, DOUBLE") for the resulting data type. If *`p`* is from 0 to 24, the data type becomes  `FLOAT` - FLOAT, DOUBLE") with no *`M`* or *`D`* values. If *`p`* is from 25 to 53, the data type becomes  `DOUBLE` - FLOAT, DOUBLE") with no *`M`* or *`D`* values. The range of the resulting column is the same as for the single-precision  `FLOAT` - FLOAT, DOUBLE") or double-precision  `DOUBLE` - FLOAT, DOUBLE") data types described earlier in this section.

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `FLOAT` - FLOAT, DOUBLE") (and any synonyms) and you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.

   `FLOAT(p)` - FLOAT, DOUBLE") syntax is provided for ODBC compatibility.
* [`DOUBLE[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  A normal-size (double-precision) floating-point number. Permissible values are `-1.7976931348623157E+308` to `-2.2250738585072014E-308`, `0`, and `2.2250738585072014E-308` to `1.7976931348623157E+308`. These are the theoretical limits, based on the IEEE standard. The actual range might be slightly smaller depending on your hardware or operating system.

  *`M`* is the total number of digits and *`D`* is the number of digits following the decimal point. If *`M`* and *`D`* are omitted, values are stored to the limits permitted by the hardware. A double-precision floating-point number is accurate to approximately 15 decimal places.

  `DOUBLE(M,D)` is a nonstandard MySQL extension; and is deprecated. You should expect support for this syntax to be removed in a future version of MySQL.

  `UNSIGNED`, if specified, disallows negative values. The `UNSIGNED` attribute is deprecated for columns of type `DOUBLE` - FLOAT, DOUBLE") (and any synonyms) and you should expect support for it to be removed in a future version of MySQL. Consider using a simple `CHECK` constraint instead for such columns.
* [`DOUBLE PRECISION[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), [`REAL[(M,D)] [UNSIGNED] [ZEROFILL]`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")

  These types are synonyms for `DOUBLE` - FLOAT, DOUBLE"). Exception: If the `REAL_AS_FLOAT` SQL mode is enabled,  `REAL` - FLOAT, DOUBLE") is a synonym for  `FLOAT` - FLOAT, DOUBLE") rather than `DOUBLE` - FLOAT, DOUBLE").

