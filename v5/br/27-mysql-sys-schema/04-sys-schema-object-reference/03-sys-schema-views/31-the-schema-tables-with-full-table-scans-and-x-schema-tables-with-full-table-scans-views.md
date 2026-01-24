#### 26.4.3.31 The schema_tables_with_full_table_scans and x$schema_tables_with_full_table_scans Views

These views display which tables are being accessed with full table scans. By default, rows are sorted by descending rows scanned.

The `schema_tables_with_full_table_scans` and `x$schema_tables_with_full_table_scans` views have these columns:

* `object_schema`

  The schema name.

* `object_name`

  The table name.

* `rows_full_scanned`

  The total number of rows scanned by full scans of the table.

* `latency`

  The total wait time of full scans of the table.
