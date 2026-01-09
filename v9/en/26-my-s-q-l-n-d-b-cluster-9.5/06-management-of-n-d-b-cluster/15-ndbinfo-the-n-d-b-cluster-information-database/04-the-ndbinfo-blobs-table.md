#### 25.6.15.4 The ndbinfo blobs Table

This table provides about blob values stored in `NDB`. The `blobs` table has the columns listed here:

* `table_id`

  Unique ID of the table containing the column

* `database_name`

  Name of the database in which this table resides

* `table_name`

  Name of the table

* `column_id`

  The column's unique ID within the table

* `column_name`

  Name of the column

* `inline_size`

  Inline size of the column

* `part_size`

  Part size of the column

* `stripe_size`

  Stripe size of the column

* `blob_table_name`

  Name of the blob table containing this column's blob data, if any

Rows exist in this table for those `NDB` table columns that store `BLOB`, `TEXT` values taking up more than 255 bytes and thus require the use of a blob table. Parts of `JSON` values exceeding 4000 bytes in size are also stored in this table. For more information about how NDB Cluster stores columns of such types, see String Type Storage Requirements.

The part and inline sizes of `NDB` blob columns can be set using `CREATE TABLE` and `ALTER TABLE` statements containing `NDB` table column comments (see NDB_COLUMN Options); this can also be done in NDB API applications (see `Column::setPartSize()` and `setInlineSize()`).
