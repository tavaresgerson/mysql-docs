#### 13.1.8.2 ALTER TABLE and Generated Columns

`ALTER TABLE` operations permitted for generated columns are `ADD`, `MODIFY`, and `CHANGE`.

* Generated columns can be added.

  ```sql
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* The data type and expression of generated columns can be modified.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

* Generated columns can be renamed or dropped, if no other column refers to them.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

* Virtual generated columns cannot be altered to stored generated columns, or vice versa. To work around this, drop the column, then add it with the new definition.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Nongenerated columns can be altered to stored but not virtual generated columns.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Stored but not virtual generated columns can be altered to nongenerated columns. The stored generated values become the values of the nongenerated column.

  ```sql
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

* `ADD COLUMN` is not an in-place operation for stored columns (done without using a temporary table) because the expression must be evaluated by the server. For stored columns, indexing changes are done in place, and expression changes are not done in place. Changes to column comments are done in place.

* For non-partitioned tables, `ADD COLUMN` and `DROP COLUMN` are in-place operations for virtual columns. However, adding or dropping a virtual column cannot be performed in place in combination with other [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations.

  For partitioned tables, `ADD COLUMN` and `DROP COLUMN` are not in-place operations for virtual columns.

* `InnoDB` supports secondary indexes on virtual generated columns. Adding or dropping a secondary index on a virtual generated column is an in-place operation. For more information, see [Section 13.1.18.8, “Secondary Indexes and Generated Columns”](create-table-secondary-indexes.html "13.1.18.8 Secondary Indexes and Generated Columns").

* When a `VIRTUAL` generated column is added to a table or modified, it is not ensured that values being calculated by the generated column expression are not out of range for the column. This can lead to inconsistent data being returned and unexpectedly failed statements. To permit control over whether validation occurs for such columns, `ALTER TABLE` supports `WITHOUT VALIDATION` and `WITH VALIDATION` clauses:

  + With `WITHOUT VALIDATION` (the default if neither clause is specified), an in-place operation is performed (if possible), data integrity is not checked, and the statement finishes more quickly. However, later reads from the table might report warnings or errors for the column if values are out of range.

  + With `WITH VALIDATION`, `ALTER TABLE` copies the table. If an out-of-range or any other error occurs, the statement fails. Because a table copy is performed, the statement takes longer.

  `WITHOUT VALIDATION` and `WITH VALIDATION` are permitted only with `ADD COLUMN`, `CHANGE COLUMN`, and `MODIFY COLUMN` operations. Otherwise, an [`ER_WRONG_USAGE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_usage) error occurs.

* As of MySQL 5.7.10, if expression evaluation causes truncation or provides incorrect input to a function, the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement terminates with an error and the DDL operation is rejected.

* An [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement that changes the default value of a column *`col_name`* may also change the value of a generated column expression that refers to the column using [`DEFAULT(col_name)`](miscellaneous-functions.html#function_default). For this reason, as of MySQL 5.7.13, [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations that change the definition of a column cause a table rebuild if any generated column expression uses [`DEFAULT()`](miscellaneous-functions.html#function_default).
