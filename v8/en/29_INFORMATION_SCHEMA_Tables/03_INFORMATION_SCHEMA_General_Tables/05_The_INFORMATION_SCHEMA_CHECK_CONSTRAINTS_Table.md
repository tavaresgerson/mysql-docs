### 28.3.5 The INFORMATION\_SCHEMA CHECK\_CONSTRAINTS Table

As of MySQL 8.0.16, [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement")
permits the core features of table and column
`CHECK` constraints, and the
[`CHECK_CONSTRAINTS`](information-schema-check-constraints-table.html "28.3.5 The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table") table provides
information about these constraints.

The [`CHECK_CONSTRAINTS`](information-schema-check-constraints-table.html "28.3.5 The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table") table has these
columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This
  value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint
  belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `CHECK_CLAUSE`

  The expression that specifies the constraint condition.