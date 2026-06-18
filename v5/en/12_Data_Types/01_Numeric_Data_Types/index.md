## 11.1 Numeric Data Types

[11.1.1 Numeric Data Type Syntax](numeric-type-syntax.html)

[11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT](integer-types.html)

[11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC](fixed-point-types.html)

[11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE](floating-point-types.html)

[11.1.5 Bit-Value Type - BIT](bit-type.html)

[11.1.6 Numeric Type Attributes](numeric-type-attributes.html)

[11.1.7 Out-of-Range and Overflow Handling](out-of-range-and-overflow.html)

MySQL supports all standard SQL numeric data types. These types
include the exact numeric data types
([`INTEGER`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
[`SMALLINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
[`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), and
[`NUMERIC`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC")), as well as the
approximate numeric data types
([`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"),
[`REAL`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), and
[`DOUBLE PRECISION`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")). The keyword
[`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") is a synonym for
[`INTEGER`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), and the keywords
[`DEC`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") and
[`FIXED`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") are synonyms for
[`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"). MySQL treats
[`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") as a synonym for
[`DOUBLE PRECISION`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") (a nonstandard
extension). MySQL also treats [`REAL`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")
as a synonym for [`DOUBLE PRECISION`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")
(a nonstandard variation), unless the
[`REAL_AS_FLOAT`](sql-mode.html#sqlmode_real_as_float) SQL mode is
enabled.

The [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") data type stores bit values
and is supported for [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"),
[`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine"),
[`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), and
[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables.

For information about how MySQL handles assignment of out-of-range
values to columns and overflow during expression evaluation, see
[Section 11.1.7, “Out-of-Range and Overflow Handling”](out-of-range-and-overflow.html "11.1.7 Out-of-Range and Overflow Handling").

For information about storage requirements of the numeric data
types, see [Section 11.7, “Data Type Storage Requirements”](storage-requirements.html "11.7 Data Type Storage Requirements").

For descriptions of functions that operate on numeric values, see
[Section 12.6, “Numeric Functions and Operators”](numeric-functions.html "12.6 Numeric Functions and Operators"). The data type used for the
result of a calculation on numeric operands depends on the types
of the operands and the operations performed on them. For more
information, see [Section 12.6.1, “Arithmetic Operators”](arithmetic-functions.html "12.6.1 Arithmetic Operators").