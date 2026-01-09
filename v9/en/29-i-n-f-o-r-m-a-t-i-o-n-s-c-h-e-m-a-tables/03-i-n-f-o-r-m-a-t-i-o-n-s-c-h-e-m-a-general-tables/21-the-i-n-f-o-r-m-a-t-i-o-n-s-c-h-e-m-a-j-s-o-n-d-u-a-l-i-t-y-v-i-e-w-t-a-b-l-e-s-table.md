### 28.3.21 The INFORMATION SCHEMA JSON_DUALITY_VIEW_TABLES Table

The `JSON_DUALITY_VIEW_TABLES` table shows information about all tables referenced by any JSON duality view which is accessible by the current user. This table contains one row per table reference.

The `JSON_DUALITY_VIEW_TABLES` table has the columns listed here:

* `TABLE_CATALOG`

  View catalog; this is always `def`.

* `TABLE_SCHEMA`

  View schema.

* `TABLE_NAME`

  View name.

* `REFERENCED_TABLE_CATALOG`

  Table catalog; this is always `def`.

* `REFERENCED_TABLE_SCHEMA`

  Table schema.

* `REFERENCED_TABLE_NAME`

  Name of the table.

* `WHERE_CLAUSE`

  Expression used in the `WHERE` clause.

* `ALLOW_INSERT`

  `1` if inserts are allowed, otherwise `0`.

* `ALLOW_UPDATE`

  `1` if updates are allowed, otherwise `0`.

* `ALLOW_DELETE`

  `1` if deletes are allowed, otherwise `0`.

* `READ_ONLY`

  `1` if insert, update, or delete are not allowed, otherwise `0`. (In other words, this is `1` only when `ALLOW_INSERT`, `ALLOW_UPDATE`, and `ALLOW_DELETE` are all `0`.)

* `IS_ROOT_TABLE`

  `1` if this is the root table, otherwise `0`.

* `REFERENCED_TABLE_ID`

  Unique table ID within this view.

* `REFERENCED_TABLE_PARENT_ID`

  ID of the parent table.

* `REFERENCED_TABLE_PARENT_RELATIONSHIP`

  One of `nested` (arrays) or `singleton` (otherwise).
