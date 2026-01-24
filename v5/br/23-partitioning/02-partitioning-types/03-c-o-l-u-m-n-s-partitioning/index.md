### 22.2.3 COLUMNS Partitioning

[22.2.3.1 RANGE COLUMNS partitioning](partitioning-columns-range.html)

[22.2.3.2 LIST COLUMNS partitioning](partitioning-columns-list.html)

The next two sections discuss `COLUMNS` partitioning, which are variants on `RANGE` and `LIST` partitioning. `COLUMNS` partitioning enables the use of multiple columns in partitioning keys. All of these columns are taken into account both for the purpose of placing rows in partitions and for the determination of which partitions are to be checked for matching rows in partition pruning.

In addition, both `RANGE COLUMNS` partitioning and `LIST COLUMNS` partitioning support the use of non-integer columns for defining value ranges or list members. The permitted data types are shown in the following list:

* All integer types: [`TINYINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`SMALLINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`MEDIUMINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") ([`INTEGER`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")), and [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (This is the same as with partitioning by `RANGE` and `LIST`.)

  Other numeric data types (such as [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") or [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")) are not supported as partitioning columns.

* [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") and [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types").

  Columns using other data types relating to dates or times are not supported as partitioning columns.

* The following string types: [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), and [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types").

  [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") and [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns are not supported as partitioning columns.

The discussions of `RANGE COLUMNS` and `LIST COLUMNS` partitioning in the next two sections assume that you are already familiar with partitioning based on ranges and lists as supported in MySQL 5.1 and later; for more information about these, see [Section 22.2.1, “RANGE Partitioning”](partitioning-range.html "22.2.1 RANGE Partitioning"), and [Section 22.2.2, “LIST Partitioning”](partitioning-list.html "22.2.2 LIST Partitioning"), respectively.
