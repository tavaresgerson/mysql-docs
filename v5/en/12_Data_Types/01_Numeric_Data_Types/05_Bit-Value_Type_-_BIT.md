### 11.1.5 Bit-Value Type - BIT

The `BIT` data type is used to store bit
values. A type of
`BIT(M)` enables
storage of *`M`*-bit values.
*`M`* can range from 1 to 64.

To specify bit values,
`b'value'` notation
can be used. *`value`* is a binary value
written using zeros and ones. For example,
`b'111'` and `b'10000000'`
represent 7 and 128, respectively. See
[Section 9.1.5, “Bit-Value Literals”](bit-value-literals.html "9.1.5 Bit-Value Literals").

If you assign a value to a
`BIT(M)` column that
is less than *`M`* bits long, the value
is padded on the left with zeros. For example, assigning a value
of `b'101'` to a `BIT(6)`
column is, in effect, the same as assigning
`b'000101'`.

**NDB Cluster.**
The maximum combined size of all `BIT`
columns used in a given [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table
must not exceed 4096 bits.