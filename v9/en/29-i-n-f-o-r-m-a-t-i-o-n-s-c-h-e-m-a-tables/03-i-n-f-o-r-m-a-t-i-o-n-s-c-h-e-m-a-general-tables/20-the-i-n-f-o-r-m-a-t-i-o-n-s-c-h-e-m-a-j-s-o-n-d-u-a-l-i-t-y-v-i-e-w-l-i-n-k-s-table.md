### 28.3.20 The INFORMATION SCHEMA JSON\_DUALITY\_VIEW\_LINKS Table

The `JSON_DUALITY_VIEW_LINKS` table shows information about the relationships between parent and child tables for all views accessible by the current user. There is one row per view.

The `JSON_DUALITY_VIEW_LINKS` table has the columns shown here:

* `TABLE_CATALOG`

  View catalog; this is always `def`.

* `TABLE_SCHEMA`

  View schema.

* `TABLE_NAME`

  View name.

* `PARENT_TABLE_CATALOG`

  Parent catalog; this is always `def`.

* `PARENT_TABLE_SCHEMA`

  Parent schema.

* `PARENT_TABLE_NAME`

  Parent table.

* `CHILD_TABLE_CATALOG`

  Child catalog; this is always `def`.

* `CHILD_TABLE_SCHEMA`

  Child schema.

* `CHILD_TABLE_NAME`

  Child table.

* `PARENT_TABLE_COLUMN_NAME`

  Parent column name.

* `CHILD_TABLE_COLUMN_NAME`

  Child column name.

* `JOIN_TYPE`

  One of `NESTED` or `OUTER`.

* `JSON_KEY_NAME`

  Name of the applicable JSON key, if any.
