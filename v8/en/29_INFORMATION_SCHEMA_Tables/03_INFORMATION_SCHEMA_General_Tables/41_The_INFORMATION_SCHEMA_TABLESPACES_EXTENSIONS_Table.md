### 28.3.41 The INFORMATION\_SCHEMA TABLESPACES\_EXTENSIONS Table

The [`TABLESPACES_EXTENSIONS`](information-schema-tablespaces-extensions-table.html "28.3.41 The INFORMATION_SCHEMA TABLESPACES_EXTENSIONS Table") table
(available as of MySQL 8.0.21) provides information about
tablespace attributes defined for primary storage engines.

Note

The [`TABLESPACES_EXTENSIONS`](information-schema-tablespaces-extensions-table.html "28.3.41 The INFORMATION_SCHEMA TABLESPACES_EXTENSIONS Table") table is
reserved for future use.

The [`TABLESPACES_EXTENSIONS`](information-schema-tablespaces-extensions-table.html "28.3.41 The INFORMATION_SCHEMA TABLESPACES_EXTENSIONS Table") table has
these columns:

* `TABLESPACE_NAME`

  The name of the tablespace.

* `ENGINE_ATTRIBUTE`

  Tablespace attributes defined for the primary storage engine.
  Reserved for future use.