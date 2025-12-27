### 28.3.16 The INFORMATION\_SCHEMA KEY\_COLUMN\_USAGE Table

The `KEY_COLUMN_USAGE` table describes which key columns have constraints. This table provides no information about functional key parts because they are expressions and the table provides information only about columns.

The `KEY_COLUMN_USAGE` table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the constraint belongs. This value is always `def`.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the constraint belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table that has the constraint.

* `COLUMN_NAME`

  The name of the column that has the constraint.

  If the constraint is a foreign key, then this is the column of the foreign key, not the column that the foreign key references.

* `ORDINAL_POSITION`

  The column's position within the constraint, not the column's position within the table. Column positions are numbered beginning with 1.

* `POSITION_IN_UNIQUE_CONSTRAINT`

  `NULL` for unique and primary-key constraints. For foreign-key constraints, this column is the ordinal position in key of the table that is being referenced.

* `REFERENCED_TABLE_SCHEMA`

  The name of the schema referenced by the constraint.

* `REFERENCED_TABLE_NAME`

  The name of the table referenced by the constraint.

* `REFERENCED_COLUMN_NAME`

  The name of the column referenced by the constraint.

Suppose that there are two tables name `t1` and `t3` that have the following definitions:

```
CREATE TABLE t1
(
    s1 INT,
    s2 INT,
    s3 INT,
    PRIMARY KEY(s3)
) ENGINE=InnoDB;

CREATE TABLE t3
(
    s1 INT,
    s2 INT,
    s3 INT,
    KEY(s1),
    CONSTRAINT CO FOREIGN KEY (s2) REFERENCES t1(s3)
) ENGINE=InnoDB;
```

For those two tables, the `KEY_COLUMN_USAGE` table has two rows:

* One row with `CONSTRAINT_NAME` = `'PRIMARY'`, `TABLE_NAME` = `'t1'`, `COLUMN_NAME` = `'s3'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `NULL`.

  For `NDB`: This value is always `NULL`.

* One row with `CONSTRAINT_NAME` = `'CO'`, `TABLE_NAME` = `'t3'`, `COLUMN_NAME` = `'s2'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `1`.
