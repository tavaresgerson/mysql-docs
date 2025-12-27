#### 25.6.15.37 The ndbinfo foreign\_keys Table

The `foreign_keys` table provides information about foreign keys on `NDB` tables. This table has the following columns:

* `object_id`

  The foreign key's object ID

* `name`

  Name of the foreign key

* `parent_table`

  The name of the foreign key's parent table

* `parent_columns`

  A comma-delimited list of parent columns

* `child_table`

  The name of the child table

* `child_columns`

  A comma-separated list of child columns

* `parent_index`

  Name of the parent index

* `child_index`

  Name of the child index

* `on_update_action`

  The `ON UPDATE` action specified for the foreign key; one of `No Action`, `Restrict`, `Cascade`, `Set Null`, or `Set Default`

* `on_delete_action`

  The `ON DELETE` action specified for the foreign key; one of `No Action`, `Restrict`, `Cascade`, `Set Null`, or `Set Default`
