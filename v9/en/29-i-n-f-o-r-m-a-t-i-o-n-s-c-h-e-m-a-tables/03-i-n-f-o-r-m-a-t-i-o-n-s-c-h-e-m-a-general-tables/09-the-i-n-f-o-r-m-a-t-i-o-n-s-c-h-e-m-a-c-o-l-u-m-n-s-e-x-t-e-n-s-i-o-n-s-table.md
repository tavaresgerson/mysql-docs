### 28.3.9 The INFORMATION_SCHEMA COLUMNS_EXTENSIONS Table

The `COLUMNS_EXTENSIONS` table provides information about column attributes defined for primary and secondary storage engines.

Note

The `COLUMNS_EXTENSIONS` table is reserved for future use.

The `COLUMNS_EXTENSIONS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table.

* `COLUMN_NAME`

  The name of the column.

* `ENGINE_ATTRIBUTE`

  Column attributes defined for the primary storage engine. Reserved for future use.

* `SECONDARY_ENGINE_ATTRIBUTE`

  Column attributes defined for the secondary storage engine. Reserved for future use.
