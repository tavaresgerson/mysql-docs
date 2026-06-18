### 28.3.55 The INFORMATION\_SCHEMA VIEW\_TABLE\_USAGE Table

The [`VIEW_TABLE_USAGE`](information-schema-view-table-usage-table.html "28.3.55 The INFORMATION_SCHEMA VIEW_TABLE_USAGE Table") table provides
access to information about tables and views used in view
definitions.

You can see information only for views for which you have some
privilege, and only for tables for which you have some privilege.

The [`VIEW_TABLE_USAGE`](information-schema-view-table-usage-table.html "28.3.55 The INFORMATION_SCHEMA VIEW_TABLE_USAGE Table") table has these
columns:

* `VIEW_CATALOG`

  The name of the catalog to which the view belongs. This value
  is always `def`.

* `VIEW_SCHEMA`

  The name of the schema (database) to which the view belongs.

* `VIEW_NAME`

  The name of the view.

* `TABLE_CATALOG`

  The name of the catalog to which the table or view used in the
  view definition belongs. This value is always
  `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table or view
  used in the view definition belongs.

* `TABLE_NAME`

  The name of the table or view used in the view definition.