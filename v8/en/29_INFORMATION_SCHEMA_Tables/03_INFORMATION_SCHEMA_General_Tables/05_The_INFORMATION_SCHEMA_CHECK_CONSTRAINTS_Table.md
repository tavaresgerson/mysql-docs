### 28.3.5 The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table

As of MySQL 8.0.16, `CREATE TABLE` permits the core features of table and column `CHECK` constraints, and the `CHECK_CONSTRAINTS` table provides information about these constraints.

The `CHECK_CONSTRAINTS` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `CHECK_CLAUSE`

  The expression that specifies the constraint condition.
