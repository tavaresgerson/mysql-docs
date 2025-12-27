### 28.3.30 The INFORMATION\_SCHEMA REFERENTIAL\_CONSTRAINTS Table

The `REFERENTIAL_CONSTRAINTS` table provides information about foreign keys.

The `REFERENTIAL_CONSTRAINTS` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `UNIQUE_CONSTRAINT_CATALOG`

  The name of the catalog containing the unique constraint that the constraint references. This value is always `def`.

* `UNIQUE_CONSTRAINT_SCHEMA`

  The name of the schema containing the unique constraint that the constraint references.

* `UNIQUE_CONSTRAINT_NAME`

  The name of the unique constraint that the constraint references.

* `MATCH_OPTION`

  The value of the constraint `MATCH` attribute. The only valid value at this time is `NONE`.

* `UPDATE_RULE`

  The value of the constraint `ON UPDATE` attribute. The possible values are `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `DELETE_RULE`

  The value of the constraint `ON DELETE` attribute. The possible values are `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `TABLE_NAME`

  The name of the table. This value is the same as in the `TABLE_CONSTRAINTS` table.

* `REFERENCED_TABLE_NAME`

  The name of the table referenced by the constraint.
