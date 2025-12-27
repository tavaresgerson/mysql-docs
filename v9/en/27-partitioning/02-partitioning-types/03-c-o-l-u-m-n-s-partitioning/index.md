### 26.2.3 COLUMNS Partitioning

26.2.3.1 RANGE COLUMNS partitioning

26.2.3.2 LIST COLUMNS partitioning

The next two sections discuss `COLUMNS` partitioning, which are variants on `RANGE` and `LIST` partitioning. `COLUMNS` partitioning enables the use of multiple columns in partitioning keys. All of these columns are taken into account both for the purpose of placing rows in partitions and for the determination of which partitions are to be checked for matching rows in partition pruning.

In addition, both `RANGE COLUMNS` partitioning and `LIST COLUMNS` partitioning support the use of non-integer columns for defining value ranges or list members. The permitted data types are shown in the following list:

* All integer types: `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") (`INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")), and `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). (This is the same as with partitioning by `RANGE` and `LIST`.)

  Other numeric data types (such as `DECIMAL` - DECIMAL, NUMERIC") or `FLOAT` - FLOAT, DOUBLE")) are not supported as partitioning columns.

* `DATE` and `DATETIME`.

  Columns using other data types relating to dates or times are not supported as partitioning columns.

* The following string types: `CHAR`, `VARCHAR`, `BINARY`, and `VARBINARY`.

  `TEXT` and `BLOB` columns are not supported as partitioning columns.

The discussions of `RANGE COLUMNS` and `LIST COLUMNS` partitioning in the next two sections assume that you are already familiar with partitioning based on ranges and lists as supported in MySQL 5.1 and later; for more information about these, see Section 26.2.1, “RANGE Partitioning”, and Section 26.2.2, “LIST Partitioning”, respectively.
