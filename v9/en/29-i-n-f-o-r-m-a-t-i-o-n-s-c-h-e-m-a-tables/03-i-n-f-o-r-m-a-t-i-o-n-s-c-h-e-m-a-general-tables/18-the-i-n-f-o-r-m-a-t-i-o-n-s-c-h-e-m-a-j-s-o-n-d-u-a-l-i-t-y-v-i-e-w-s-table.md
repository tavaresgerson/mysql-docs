### 28.3.18 The INFORMATION SCHEMA JSON_DUALITY_VIEWS Table

The `JSON_DUALITY_VIEWS` table provides information about JSON duality views accessible by the current user. There is one row in this table for each such view.

The `JSON_DUALITY_VIEWS` table contains the columns listed here:

* `TABLE_CATALOG`

  View catalog; this is always `def`.

* `TABLE_SCHEMA`

  View schema.

* `TABLE_NAME`

  View name.

* `DEFINER`

  User who created the view.

* `SECURITY_TYPE`

  One of `INVOKER` or `DEFINER`.

* `JSON_COLUMN_NAME`

  This is always `data`.

* `ROOT_TABLE_CATALOG`

  Catalog of the root table; this is always `def`.

* `ROOT_TABLE_SCHEMA`

  Schema of the root table.

* `ROOT_TABLE_NAME`

  Name of the root table.

* `ALLOW_INSERT`

  `1` if inserts are allowed, otherwise `0`.

* `ALLOW_UPDATE`

  `1` if updates are allowed, otherwise `0`.

* `ALLOW_DELETE`

  `1` if deletes are allowed, otherwise `0`.

* `READ_ONLY`

  `1` if insert, update, or delete are not allowed, otherwise `0`. (In other words, this is `1` only when `ALLOW_INSERT`, `ALLOW_UPDATE`, and `ALLOW_DELETE` are all `0`.)

* `STATUS`

  One of `valid` or `invalid`.

The root table name and other information are shown only if the user has some type of privilege on the root table; the user must also have `SHOW VIEW` and `SELECT` privileges on the view.
