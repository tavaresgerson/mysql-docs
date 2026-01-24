#### 26.4.3.8 The innodb_buffer_stats_by_table and x$innodb_buffer_stats_by_table Views

These views summarize the information in the `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE` table, grouped by schema and table. By default, rows are sorted by descending buffer size.

Warning

Querying views that access the `INNODB_BUFFER_PAGE` table can affect performance. Do not query these views on a production system unless you are aware of the performance impact and have determined it to be acceptable. To avoid impacting performance on a production system, reproduce the issue you want to investigate and query buffer pool statistics on a test instance.

The `innodb_buffer_stats_by_table` and `x$innodb_buffer_stats_by_table` views have these columns:

* `object_schema`

  The schema name for the object, or `InnoDB System` if the table belongs to the `InnoDB` storage engine.

* `object_name`

  The table name.

* `allocated`

  The total number of bytes allocated for the table.

* `data`

  The number of data bytes allocated for the table.

* `pages`

  The total number of pages allocated for the table.

* `pages_hashed`

  The number of hashed pages allocated for the table.

* `pages_old`

  The number of old pages allocated for the table.

* `rows_cached`

  The number of cached rows for the table.
