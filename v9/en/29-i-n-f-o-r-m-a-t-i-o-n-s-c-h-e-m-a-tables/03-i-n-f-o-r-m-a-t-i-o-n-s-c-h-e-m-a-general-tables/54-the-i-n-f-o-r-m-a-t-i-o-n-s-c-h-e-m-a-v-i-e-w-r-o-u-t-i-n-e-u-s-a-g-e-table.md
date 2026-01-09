### 28.3.54 The INFORMATION_SCHEMA VIEW_ROUTINE_USAGE Table

The `VIEW_ROUTINE_USAGE` table provides access to information about stored functions used in view definitions. The table does not list information about built-in (native) functions or loadable functions used in the definitions.

You can see information only for views for which you have some privilege, and only for functions for which you have some privilege.

The `VIEW_ROUTINE_USAGE` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the view belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the view belongs.

* `TABLE_NAME`

  The name of the view.

* `SPECIFIC_CATALOG`

  The name of the catalog to which the function used in the view definition belongs. This value is always `def`.

* `SPECIFIC_SCHEMA`

  The name of the schema (database) to which the function used in the view definition belongs.

* `SPECIFIC_NAME`

  The name of the function used in the view definition.
