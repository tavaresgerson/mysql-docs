### 28.3.47 The INFORMATION\_SCHEMA TABLE\_CONSTRAINTS Table

The [`TABLE_CONSTRAINTS`](information-schema-table-constraints-table.html "28.3.47 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table") table describes
which tables have constraints.

The [`TABLE_CONSTRAINTS`](information-schema-table-constraints-table.html "28.3.47 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table") table has these
columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This
  value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint
  belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `CONSTRAINT_TYPE`

  The type of constraint. The value can be
  `UNIQUE`, `PRIMARY KEY`,
  `FOREIGN KEY` or `CHECK`.
  This is a [`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") (not
  [`ENUM`](enum.html "13.3.6 The ENUM Type")) column.

  The `UNIQUE` and `PRIMARY
  KEY` information is about the same as what you get
  from the `Key_name` column in the output from
  [`SHOW INDEX`](show-index.html "15.7.7.24 SHOW INDEX Statement") when the
  `Non_unique` column is `0`.

* `ENFORCED`

  For `CHECK` constraints, the value is
  `YES` or `NO` to indicate
  whether the constraint is enforced. For other constraints, the
  value is always `YES`.