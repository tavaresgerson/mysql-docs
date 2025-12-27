### 13.3.5 The VECTOR Type

A `VECTOR` is a structure that can hold up to a specified number of entries *`N`*, defined as shown here:

```
VECTOR(N)
```

Each entry is a 4-byte (single-precision) floating-point value.

The default length is 2048; the maximum is 16383 entries. To declare a `VECTOR` column of the default length, define it as `VECTOR` with no parentheses following; trying to define a column as `VECTOR()` (with empty parentheses) raises a syntax error.

A `VECTOR` cannot be compared to any other type. It can be compared to another `VECTOR` for equality, but no other comparison is possible.

A `VECTOR` column cannot be used as any type of key. This includes all of the following types:

* Primary key
* Foreign key
* Unique key
* Partitioning key

A `VECTOR` column also cannot be used as a histogram source.

#### VECTOR Supported and Unsupported Functions

`VECTOR` values can be used with the MySQL string functions `BIT_LENGTH()`, `CHAR_LENGTH()`, `HEX()`, `LENGTH()`, and `TO_BASE64()`. Other string functions do not accept the `VECTOR` type as an argument.

`VECTOR` can be used as an argument to any of the encryption functions `AES_ENCRYPT()`, `COMPRESS()`, `MD5()`, `SHA1()`, and `SHA2()`. `VECTOR` is not supported as an argument type by any other encryption functions.

`VECTOR` can be used as an argument to the `CASE` operator and related flow-control functions, including `COALESCE()`, `IFNULL()`, `NULLIF()`, and `IF()`.

`VECTOR` can be used as the argument to `CAST(expression AS BINARY`); the result is a binary string with the same contents as the `VECTOR` argument. Casting to `VECTOR` with `CAST` is not supported; you can convert a suitable string to `VECTOR` using `STRING_TO_VECTOR()`.

`VECTOR` data types cannot be used as arguments to aggregate functions or window functions other than `COUNT` `[DISTINCT]`.

`VECTOR` cannot be used as an argument to any of the following types of functions and operators:

* Numeric functions and operators
* Temporal functions
* Fulltext search functions
* XML functions
* Bit functions such as bitwise `AND` and `OR`

* JSON functions

For more information, see Section 14.21, “Vector Functions”.

`VECTOR` values are supported by JavaScript stored programs. See Section 27.3.4, “JavaScript Stored Program Data Types and Argument Handling”, for more information.
