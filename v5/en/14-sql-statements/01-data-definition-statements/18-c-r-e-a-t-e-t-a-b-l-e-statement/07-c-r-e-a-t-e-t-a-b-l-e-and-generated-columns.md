#### 13.1.18.7 CREATE TABLE and Generated Columns

[`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") supports the specification of generated columns. Values of a generated column are computed from an expression included in the column definition.

Generated columns are supported by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine beginning with MySQL NDB Cluster 7.5.3.

The following simple example shows a table that stores the lengths of the sides of right triangles in the `sidea` and `sideb` columns, and computes the length of the hypotenuse in `sidec` (the square root of the sums of the squares of the other sides):

```sql
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```

Selecting from the table yields this result:

```sql
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```

Any application that uses the `triangle` table has access to the hypotenuse values without having to specify the expression that calculates them.

Generated column definitions have this syntax:

```sql
col_name data_type [GENERATED ALWAYS] AS (expr)
  [VIRTUAL | STORED] [NOT NULL | NULL]
  [UNIQUE [KEY]] [[PRIMARY] KEY]
  [COMMENT 'string']
```

`AS (expr)` indicates that the column is generated and defines the expression used to compute column values. `AS` may be preceded by `GENERATED ALWAYS` to make the generated nature of the column more explicit. Constructs that are permitted or prohibited in the expression are discussed later.

The `VIRTUAL` or `STORED` keyword indicates how column values are stored, which has implications for column use:

* `VIRTUAL`: Column values are not stored, but are evaluated when rows are read, immediately after any `BEFORE` triggers. A virtual column takes no storage.

  `InnoDB` supports secondary indexes on virtual columns. See [Section 13.1.18.8, “Secondary Indexes and Generated Columns”](create-table-secondary-indexes.html "13.1.18.8 Secondary Indexes and Generated Columns").

* `STORED`: Column values are evaluated and stored when rows are inserted or updated. A stored column does require storage space and can be indexed.

The default is `VIRTUAL` if neither keyword is specified.

It is permitted to mix `VIRTUAL` and `STORED` columns within a table.

Other attributes may be given to indicate whether the column is indexed or can be `NULL`, or provide a comment.

Generated column expressions must adhere to the following rules. An error occurs if an expression contains disallowed constructs.

* Literals, deterministic built-in functions, and operators are permitted. A function is deterministic if, given the same data in tables, multiple invocations produce the same result, independently of the connected user. Examples of functions that are nondeterministic and fail this definition: [`CONNECTION_ID()`](information-functions.html#function_connection-id), [`CURRENT_USER()`](information-functions.html#function_current-user), [`NOW()`](date-and-time-functions.html#function_now).

* Stored functions and loadable functions are not permitted.
* Stored procedure and function parameters are not permitted.
* Variables (system variables, user-defined variables, and stored program local variables) are not permitted.

* Subqueries are not permitted.
* A generated column definition can refer to other generated columns, but only those occurring earlier in the table definition. A generated column definition can refer to any base (nongenerated) column in the table whether its definition occurs earlier or later.

* The `AUTO_INCREMENT` attribute cannot be used in a generated column definition.

* An `AUTO_INCREMENT` column cannot be used as a base column in a generated column definition.

* As of MySQL 5.7.10, if expression evaluation causes truncation or provides incorrect input to a function, the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement terminates with an error and the DDL operation is rejected.

If the expression evaluates to a data type that differs from the declared column type, implicit coercion to the declared type occurs according to the usual MySQL type-conversion rules. See [Section 12.3, “Type Conversion in Expression Evaluation”](type-conversion.html "12.3 Type Conversion in Expression Evaluation").

Note

If any component of the expression depends on the SQL mode, different results may occur for different uses of the table unless the SQL mode is the same during all uses.

For [`CREATE TABLE ... LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement"), the destination table preserves generated column information from the original table.

For [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement"), the destination table does not preserve information about whether columns in the selected-from table are generated columns. The [`SELECT`](select.html "13.2.9 SELECT Statement") part of the statement cannot assign values to generated columns in the destination table.

Partitioning by generated columns is permitted. See [Table Partitioning](create-table.html#create-table-partitioning "Table Partitioning").

A foreign key constraint on a stored generated column cannot use `CASCADE`, `SET NULL`, or `SET DEFAULT` as `ON UPDATE` referential actions, nor can it use `SET NULL` or `SET DEFAULT` as `ON DELETE` referential actions.

A foreign key constraint on the base column of a stored generated column cannot use `CASCADE`, `SET NULL`, or `SET DEFAULT` as `ON UPDATE` or `ON DELETE` referential actions.

A foreign key constraint cannot reference a virtual generated column.

Triggers cannot use `NEW.col_name` or use `OLD.col_name` to refer to generated columns.

For [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), and [`UPDATE`](update.html "13.2.11 UPDATE Statement"), if a generated column is inserted into, replaced, or updated explicitly, the only permitted value is `DEFAULT`.

A generated column in a view is considered updatable because it is possible to assign to it. However, if such a column is updated explicitly, the only permitted value is `DEFAULT`.

Generated columns have several use cases, such as these:

* Virtual generated columns can be used as a way to simplify and unify queries. A complicated condition can be defined as a generated column and referred to from multiple queries on the table to ensure that all of them use exactly the same condition.

* Stored generated columns can be used as a materialized cache for complicated conditions that are costly to calculate on the fly.

* Generated columns can simulate functional indexes: Use a generated column to define a functional expression and index it. This can be useful for working with columns of types that cannot be indexed directly, such as [`JSON`](json.html "11.5 The JSON Data Type") columns; see [Indexing a Generated Column to Provide a JSON Column Index](create-table-secondary-indexes.html#json-column-indirect-index "Indexing a Generated Column to Provide a JSON Column Index"), for a detailed example.

  For stored generated columns, the disadvantage of this approach is that values are stored twice; once as the value of the generated column and once in the index.

* If a generated column is indexed, the optimizer recognizes query expressions that match the column definition and uses indexes from the column as appropriate during query execution, even if a query does not refer to the column directly by name. For details, see [Section 8.3.10, “Optimizer Use of Generated Column Indexes”](generated-column-index-optimizations.html "8.3.10 Optimizer Use of Generated Column Indexes").

Example:

Suppose that a table `t1` contains `first_name` and `last_name` columns and that applications frequently construct the full name using an expression like this:

```sql
SELECT CONCAT(first_name,' ',last_name) AS full_name FROM t1;
```

One way to avoid writing out the expression is to create a view `v1` on `t1`, which simplifies applications by enabling them to select `full_name` directly without using an expression:

```sql
CREATE VIEW v1 AS
SELECT *, CONCAT(first_name,' ',last_name) AS full_name FROM t1;

SELECT full_name FROM v1;
```

A generated column also enables applications to select `full_name` directly without the need to define a view:

```sql
CREATE TABLE t1 (
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  full_name VARCHAR(255) AS (CONCAT(first_name,' ',last_name))
);

SELECT full_name FROM t1;
```
