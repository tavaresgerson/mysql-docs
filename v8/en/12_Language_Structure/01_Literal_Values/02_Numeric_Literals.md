### 11.1.2 Numeric Literals

Number literals include exact-value (integer and `DECIMAL` - DECIMAL, NUMERIC")) literals and approximate-value (floating-point) literals.

Integers are represented as a sequence of digits. Numbers may include `.` as a decimal separator. Numbers may be preceded by `-` or `+` to indicate a negative or positive value, respectively. Numbers represented in scientific notation with a mantissa and exponent are approximate-value numbers.

Exact-value numeric literals have an integer part or fractional part, or both. They may be signed. Examples: `1`, `.2`, `3.4`, `-5`, `-6.78`, `+9.10`.

Approximate-value numeric literals are represented in scientific notation with a mantissa and exponent. Either or both parts may be signed. Examples: `1.2E3`, `1.2E-3`, `-1.2E3`, `-1.2E-3`.

Two numbers that look similar may be treated differently. For example, `2.34` is an exact-value (fixed-point) number, whereas `2.34E0` is an approximate-value (floating-point) number.

The `DECIMAL` - DECIMAL, NUMERIC") data type is a fixed-point type and calculations are exact. In MySQL, the `DECIMAL` - DECIMAL, NUMERIC") type has several synonyms: `NUMERIC` - DECIMAL, NUMERIC"), `DEC` - DECIMAL, NUMERIC"), `FIXED` - DECIMAL, NUMERIC"). The integer types also are exact-value types. For more information about exact-value calculations, see Section 14.24, “Precision Math”.

The `FLOAT` - FLOAT, DOUBLE") and `DOUBLE` - FLOAT, DOUBLE") data types are floating-point types and calculations are approximate. In MySQL, types that are synonymous with `FLOAT` - FLOAT, DOUBLE") or `DOUBLE` - FLOAT, DOUBLE") are `DOUBLE PRECISION` - FLOAT, DOUBLE") and `REAL` - FLOAT, DOUBLE").

An integer may be used in floating-point context; it is interpreted as the equivalent floating-point number.
