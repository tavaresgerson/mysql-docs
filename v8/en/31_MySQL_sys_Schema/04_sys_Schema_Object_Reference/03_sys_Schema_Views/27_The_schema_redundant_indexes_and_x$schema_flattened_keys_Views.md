#### 30.4.3.27 The schema_redundant_indexes and x$schema_flattened_keys Views

The `schema_redundant_indexes` view displays indexes that duplicate other indexes or are made redundant by them. The `x$schema_flattened_keys` view is a helper view for `schema_redundant_indexes`.

In the following column descriptions, the dominant index is the one that makes the redundant index redundant.

The `schema_redundant_indexes` view has these columns:

* `table_schema`

  The schema that contains the table.

* `table_name`

  The table that contains the index.

* `redundant_index_name`

  The name of the redundant index.

* `redundant_index_columns`

  The names of the columns in the redundant index.

* `redundant_index_non_unique`

  The number of nonunique columns in the redundant index.

* `dominant_index_name`

  The name of the dominant index.

* `dominant_index_columns`

  The names of the columns in the dominant index.

* `dominant_index_non_unique`

  The number of nonunique columns in the dominant index.

* `subpart_exists`

  Whether the index indexes only part of a column.

* `sql_drop_index`

  The statement to execute to drop the redundant index.

The `x$schema_flattened_keys` view has these columns:

* `table_schema`

  The schema that contains the table.

* `table_name`

  The table that contains the index.

* `index_name`

  An index name.

* `non_unique`

  The number of nonunique columns in the index.

* `subpart_exists`

  Whether the index indexes only part of a column.

* `index_columns`

  The name of the columns in the index.
