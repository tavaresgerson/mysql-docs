### 28.3.42 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table

The `TABLE_CONSTRAINTS` table describes which tables have constraints.

The `TABLE_CONSTRAINTS` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `CONSTRAINT_TYPE`

  The type of constraint. The value can be `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, or (as of MySQL 8.0.16) `CHECK`. This is a `CHAR` (not `ENUM`) column.

  The `UNIQUE` and `PRIMARY KEY` information is about the same as what you get from the `Key_name` column in the output from `SHOW INDEX` when the `Non_unique` column is `0`.

* `ENFORCED`

  For `CHECK` constraints, the value is `YES` or `NO` to indicate whether the constraint is enforced. For other constraints, the value is always `YES`.

  This column was added in MySQL 8.0.16.
