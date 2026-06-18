### 28.3.48 The INFORMATION\_SCHEMA TABLE\_CONSTRAINTS\_EXTENSIONS Table

The [`TABLE_CONSTRAINTS_EXTENSIONS`](information-schema-table-constraints-extensions-table.html "28.3.48 The INFORMATION_SCHEMA TABLE_CONSTRAINTS_EXTENSIONS Table")
table provides information about table constraint attributes
defined for primary and secondary storage engines.

Note

The [`TABLE_CONSTRAINTS_EXTENSIONS`](information-schema-table-constraints-extensions-table.html "28.3.48 The INFORMATION_SCHEMA TABLE_CONSTRAINTS_EXTENSIONS Table")
table is reserved for future use.

The [`TABLE_CONSTRAINTS_EXTENSIONS`](information-schema-table-constraints-extensions-table.html "28.3.48 The INFORMATION_SCHEMA TABLE_CONSTRAINTS_EXTENSIONS Table")
table has these columns:

* `CONSTRAINT_CATALOG`

  The name of the catalog to which the table belongs.

* `CONSTRAINT_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `CONSTRAINT_NAME`

  The name of the constraint.

* `TABLE_NAME`

  The name of the table.

* `ENGINE_ATTRIBUTE`

  Constraint attributes defined for the primary storage engine.
  Reserved for future use.

* `SECONDARY_ENGINE_ATTRIBUTE`

  Constraint attributes defined for the secondary storage
  engine. Reserved for future use.