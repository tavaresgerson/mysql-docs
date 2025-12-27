### 14.25.2 DECIMAL Data Type Characteristics

This section discusses the characteristics of the `DECIMAL` - DECIMAL, NUMERIC") data type (and its synonyms), with particular regard to the following topics:

* Maximum number of digits
* Storage format
* Storage requirements
* The nonstandard MySQL extension to the upper range of `DECIMAL` - DECIMAL, NUMERIC") columns

The declaration syntax for a `DECIMAL` - DECIMAL, NUMERIC") column is `DECIMAL(M,D)`. The ranges of values for the arguments are as follows:

* *`M`* is the maximum number of digits (the precision). It has a range of 1 to 65.

* *`D`* is the number of digits to the right of the decimal point (the scale). It has a range of 0 to 30 and must be no larger than *`M`*.

If *`D`* is omitted, the default is 0. If *`M`* is omitted, the default is 10.

The maximum value of 65 for *`M`* means that calculations on `DECIMAL` - DECIMAL, NUMERIC") values are accurate up to 65 digits. This limit of 65 digits of precision also applies to exact-value numeric literals, so the maximum range of such literals differs from before. (There is also a limit on how long the text of `DECIMAL` - DECIMAL, NUMERIC") literals can be; see Section 14.25.3, “Expression Handling”.)

Values for `DECIMAL` - DECIMAL, NUMERIC") columns are stored using a binary format that packs nine decimal digits into 4 bytes. The storage requirements for the integer and fractional parts of each value are determined separately. Each multiple of nine digits requires 4 bytes, and any remaining digits left over require some fraction of 4 bytes. The storage required for remaining digits is given by the following table.

<table summary="The number of bytes required for remaining/leftover digits in DECIMAL values."><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Leftover Digits</th> <th>Number of Bytes</th> </tr></thead><tbody><tr> <td>0</td> <td>0</td> </tr><tr> <td>1–2</td> <td>1</td> </tr><tr> <td>3–4</td> <td>2</td> </tr><tr> <td>5–6</td> <td>3</td> </tr><tr> <td>7–9</td> <td>4</td> </tr></tbody></table>

For example, a `DECIMAL(18,9)` column has nine digits on either side of the decimal point, so the integer part and the fractional part each require 4 bytes. A `DECIMAL(20,6)` column has fourteen integer digits and six fractional digits. The integer digits require four bytes for nine of the digits and 3 bytes for the remaining five digits. The six fractional digits require 3 bytes.

`DECIMAL` - DECIMAL, NUMERIC") columns do not store a leading `+` character or `-` character or leading `0` digits. If you insert `+0003.1` into a `DECIMAL(5,1)` column, it is stored as `3.1`. For negative numbers, a literal `-` character is not stored.

`DECIMAL` - DECIMAL, NUMERIC") columns do not permit values larger than the range implied by the column definition. For example, a `DECIMAL(3,0)` column supports a range of `-999` to `999`. A `DECIMAL(M,D)` column permits up to *`M`* - *`D`* digits to the left of the decimal point.

The SQL standard requires that the precision of `NUMERIC(M,D)` be *exactly* *`M`* digits. For `DECIMAL(M,D)`, the standard requires a precision of at least *`M`* digits but permits more. In MySQL, `DECIMAL(M,D)` and `NUMERIC(M,D)` are the same, and both have a precision of exactly *`M`* digits.

For a full explanation of the internal format of `DECIMAL` values, see the file `strings/decimal.c` in a MySQL source distribution. The format is explained (with an example) in the `decimal2bin()` function.
