#### 30.4.3.7 The innodb\_buffer\_stats\_by\_schema and x$innodb\_buffer\_stats\_by\_schema Views

These views summarize the information in the `INFORMATION_SCHEMA` `INNODB_BUFFER_PAGE` table, grouped by schema. By default, rows are sorted by descending buffer size.

Warning

Querying views that access the `INNODB_BUFFER_PAGE` table can affect performance. Do not query these views on a production system unless you are aware of the performance impact and have determined it to be acceptable. To avoid impacting performance on a production system, reproduce the issue you want to investigate and query buffer pool statistics on a test instance.

The `innodb_buffer_stats_by_schema` and `x$innodb_buffer_stats_by_schema` views have these columns:

* `object_schema`

  The schema name for the object, or `InnoDB System` if the table belongs to the `InnoDB` storage engine.

* `allocated`

  The total number of bytes allocated for the schema.

* `data`

  The total number of data bytes allocated for the schema.

* `pages`

  The total number of pages allocated for the schema.

* `pages_hashed`

  The total number of hashed pages allocated for the schema.

* `pages_old`

  The total number of old pages allocated for the schema.

* `rows_cached`

  The total number of cached rows for the schema.
