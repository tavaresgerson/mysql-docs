### 11.2.4 The YEAR Type

The `YEAR` type is a 1-byte type used to represent year values. It can be declared as `YEAR` with an implicit display width of 4 characters, or equivalently as `YEAR(4)` with an explicit display width.

Note

The 2-digit `YEAR(2)` data type is deprecated and support for it is removed in MySQL 5.7.5. To convert 2-digit `YEAR(2)` columns to 4-digit `YEAR` columns, see Section 11.2.5, “2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR” Limitations and Migrating to 4-Digit YEAR").

MySQL displays `YEAR` values in *`YYYY`* format, with a range of `1901` to `2155`, and `0000`.

`YEAR` accepts input values in a variety of formats:

* As 4-digit strings in the range `'1901'` to `'2155'`.

* As 4-digit numbers in the range `1901` to `2155`.

* As 1- or 2-digit strings in the range `'0'` to `'99'`. MySQL converts values in the ranges `'0'` to `'69'` and `'70'` to `'99'` to `YEAR` values in the ranges `2000` to `2069` and `1970` to `1999`.

* As 1- or 2-digit numbers in the range `0` to `99`. MySQL converts values in the ranges `1` to `69` and `70` to `99` to `YEAR` values in the ranges `2001` to `2069` and `1970` to `1999`.

  The result of inserting a numeric `0` has a display value of `0000` and an internal value of `0000`. To insert zero and have it be interpreted as `2000`, specify it as a string `'0'` or `'00'`.

* As the result of functions that return a value that is acceptable in `YEAR` context, such as `NOW()`.

If strict SQL mode is not enabled, MySQL converts invalid `YEAR` values to `0000`. In strict SQL mode, attempting to insert an invalid `YEAR` value produces an error.

See also Section 11.2.10, “2-Digit Years in Dates”.
