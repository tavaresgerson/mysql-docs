### 14.24.1 Types of Numeric Values

The scope of precision math for exact-value operations includes
the exact-value data types (integer and
[`DECIMAL`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") types) and exact-value
numeric literals. Approximate-value data types and numeric
literals are handled as floating-point numbers.

Exact-value numeric literals have an integer part or fractional
part, or both. They may be signed. Examples: `1`,
`.2`, `3.4`,
`-5`, `-6.78`,
`+9.10`.

Approximate-value numeric literals are represented in scientific
notation with a mantissa and exponent. Either or both parts may be
signed. Examples: `1.2E3`,
`1.2E-3`, `-1.2E3`,
`-1.2E-3`.

Two numbers that look similar may be treated differently. For
example, `2.34` is an exact-value (fixed-point)
number, whereas `2.34E0` is an approximate-value
(floating-point) number.

The [`DECIMAL`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") data type is a
fixed-point type and calculations are exact. In MySQL, the
[`DECIMAL`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") type has several synonyms:
[`NUMERIC`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"),
[`DEC`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"),
[`FIXED`](fixed-point-types.html "13.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"). The integer types also are
exact-value types.

The [`FLOAT`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") and
[`DOUBLE`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") data types are
floating-point types and calculations are approximate. In MySQL,
types that are synonymous with
[`FLOAT`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") or
[`DOUBLE`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") are
[`DOUBLE PRECISION`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") and
[`REAL`](floating-point-types.html "13.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE").