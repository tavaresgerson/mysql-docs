#### 26.4.3.25 The schema_index_statistics and x$schema_index_statistics Views

These views provide index statistics. By default, rows are sorted by descending total index latency.

The `schema_index_statistics` and `x$schema_index_statistics` views have these columns:

* `table_schema`

  The schema that contains the table.

* `table_name`

  The table that contains the index.

* `index_name`

  The name of the index.

* `rows_selected`

  The total number of rows read using the index.

* `select_latency`

  The total wait time of timed reads using the index.

* `rows_inserted`

  The total number of rows inserted into the index.

* `insert_latency`

  The total wait time of timed inserts into the index.

* `rows_updated`

  The total number of rows updated in the index.

* `update_latency`

  The total wait time of timed updates in the index.

* `rows_deleted`

  The total number of rows deleted from the index.

* `delete_latency`

  The total wait time of timed deletes from the index.
