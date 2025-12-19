--- title: MySQL 8.4 Reference Manual :: 13.8 Choosing the Right Type for a Column url: https://dev.mysql.com/doc/refman/8.4/en/choosing-types.html order: 55 ---



## 13.8 Choosing the Right Type for a Column

For optimum storage, you should try to use the most precise type in all cases. For example, if an integer column is used for values in the range from `1` to `99999`, `MEDIUMINT UNSIGNED` is the best type. Of the types that represent all the required values, this type uses the least amount of storage.

All basic calculations (`+`, `-`, `*`, and `/`) with  `DECIMAL` - DECIMAL, NUMERIC") columns are done with precision of 65 decimal (base 10) digits. See  Section 13.1.1, “Numeric Data Type Syntax”.

If accuracy is not too important or if speed is the highest priority, the  `DOUBLE` - FLOAT, DOUBLE") type may be good enough. For high precision, you can always convert to a fixed-point type stored in a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). This enables you to do all calculations with 64-bit integers and then convert results back to floating-point values as necessary.


