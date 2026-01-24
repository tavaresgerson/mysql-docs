## 11.1 Numeric Data Types

11.1.1 Numeric Data Type Syntax

11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT

11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC

11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE

11.1.5 Bit-Value Type - BIT

11.1.6 Numeric Type Attributes

11.1.7 Out-of-Range and Overflow Handling

MySQL supports all standard SQL numeric data types. These types include the exact numeric data types (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `DECIMAL` - DECIMAL, NUMERIC"), and `NUMERIC` - DECIMAL, NUMERIC")), as well as the approximate numeric data types (`FLOAT` - FLOAT, DOUBLE"), `REAL` - FLOAT, DOUBLE"), and `DOUBLE PRECISION` - FLOAT, DOUBLE")). The keyword `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") is a synonym for `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), and the keywords `DEC` - DECIMAL, NUMERIC") and `FIXED` - DECIMAL, NUMERIC") are synonyms for `DECIMAL` - DECIMAL, NUMERIC"). MySQL treats `DOUBLE` - FLOAT, DOUBLE") as a synonym for `DOUBLE PRECISION` - FLOAT, DOUBLE") (a nonstandard extension). MySQL also treats `REAL` - FLOAT, DOUBLE") as a synonym for `DOUBLE PRECISION` - FLOAT, DOUBLE") (a nonstandard variation), unless the `REAL_AS_FLOAT` SQL mode is enabled.

The `BIT` data type stores bit values and is supported for `MyISAM`, `MEMORY`, `InnoDB`, and `NDB` tables.

For information about how MySQL handles assignment of out-of-range values to columns and overflow during expression evaluation, see Section 11.1.7, “Out-of-Range and Overflow Handling”.

For information about storage requirements of the numeric data types, see Section 11.7, “Data Type Storage Requirements”.

For descriptions of functions that operate on numeric values, see Section 12.6, “Numeric Functions and Operators”. The data type used for the result of a calculation on numeric operands depends on the types of the operands and the operations performed on them. For more information, see Section 12.6.1, “Arithmetic Operators”.
