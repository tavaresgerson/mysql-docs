### 13.3.5 The VECTOR Type

A `VECTOR` is a structure that can hold up to a
specified number of entries *`N`*,
defined as shown here:

```
VECTOR(N)
```

Each entry is a 4-byte (single-precision) floating-point value.

The default length is 2048; the maximum is 16383 entries. To
declare a `VECTOR` column of the default
length, define it as `VECTOR` with no
parentheses following; trying to define a column as
`VECTOR()` (with empty parentheses) raises a
syntax error.

A `VECTOR` cannot be compared to any other
type. It can be compared to another `VECTOR`
for equality, but no other comparison is possible.

A `VECTOR` column cannot be used as any type of
key. This includes all of the following types:

* Primary key
* Foreign key
* Unique key
* Partitioning key

A `VECTOR` column also cannot be used as a
histogram source.

#### VECTOR Supported and Unsupported Functions

`VECTOR` values can be used with the MySQL
string functions [`BIT_LENGTH()`](string-functions.html#function_bit-length),
[`CHAR_LENGTH()`](string-functions.html#function_char-length),
[`HEX()`](string-functions.html#function_hex),
[`LENGTH()`](string-functions.html#function_length), and
[`TO_BASE64()`](string-functions.html#function_to-base64). Other string
functions do not accept the `VECTOR` type as an
argument.

`VECTOR` can be used as an argument to any of
the encryption functions
[`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt),
[`COMPRESS()`](encryption-functions.html#function_compress),
[`MD5()`](encryption-functions.html#function_md5),
[`SHA1()`](encryption-functions.html#function_sha1), and
[`SHA2()`](encryption-functions.html#function_sha2). `VECTOR`
is not supported as an argument type by any other encryption
functions.

`VECTOR` can be used as an argument to the
[`CASE`](flow-control-functions.html#operator_case) operator and related
flow-control functions, including
[`COALESCE()`](comparison-operators.html#function_coalesce),
[`IFNULL()`](flow-control-functions.html#function_ifnull),
[`NULLIF()`](flow-control-functions.html#function_nullif), and
[`IF()`](flow-control-functions.html#function_if).

`VECTOR` can be used as the argument to
[`CAST(expression
AS BINARY`](cast-functions.html#function_cast)); the result is a binary string with the
same contents as the `VECTOR` argument. Casting
to `VECTOR` with `CAST` is not
supported; you can convert a suitable string to
`VECTOR` using
[`STRING_TO_VECTOR()`](vector-functions.html#function_string-to-vector).

`VECTOR` data types cannot be used as arguments
to aggregate functions or window functions other than
[`COUNT`](aggregate-functions.html#function_count)
`[DISTINCT]`.

`VECTOR` cannot be used as an argument to any
of the following types of functions and operators:

* Numeric functions and operators
* Temporal functions
* Fulltext search functions
* XML functions
* Bit functions such as bitwise `AND` and
  `OR`

* JSON functions

For more information, see [Section 14.21, “Vector Functions”](vector-functions.html "14.21 Vector Functions").

`VECTOR` values are supported by JavaScript
stored programs. See [Section 27.3.4, “JavaScript Stored Program Data Types and Argument Handling”](srjs-data-arguments.html "27.3.4 JavaScript Stored Program Data Types and Argument Handling"), for
more information.