#### 25.6.16.39 The ndbinfo index_columns Table

This table provides information about indexes on `NDB` tables. The columns of the `index_columns` table are listed here, along with brief descriptions:

* `table_id`

  Unique ID of the `NDB` table for which the index is defined

* Name of the database containing this table

  `varchar(64)`

* `table_name`

  Name of the table

* `index_object_id`

  Object ID of this index

* `index_name`

  Name of the index; if the index is not named, the name of the first column in the index is used

* `index_type`

  Type of index; normally this is 3 (unique hash index) or 6 (ordered index); the values are the same as those in the `type_id` column of the `dict_obj_types` table

* `status`

  One of `new`, `changed`, `retrieved`, `invalid`, or `altered`

* `columns`

  A comma-delimited list of columns making up the index

The `index_columns` table was added in NDB 8.0.29.
