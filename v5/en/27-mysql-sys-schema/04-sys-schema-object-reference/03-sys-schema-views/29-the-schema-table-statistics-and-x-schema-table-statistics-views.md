#### 26.4.3.29 The schema\_table\_statistics and x$schema\_table\_statistics Views

These views summarize table statistics. By default, rows are sorted by descending total wait time (tables with most contention first).

These views user a helper view, `x$ps_schema_table_statistics_io`.

The `schema_table_statistics` and `x$schema_table_statistics` views have these columns:

* `table_schema`

  The schema that contains the table.

* `table_name`

  The table name.

* `total_latency`

  The total wait time of timed I/O events for the table.

* `rows_fetched`

  The total number of rows read from the table.

* `fetch_latency`

  The total wait time of timed read I/O events for the table.

* `rows_inserted`

  The total number of rows inserted into the table.

* `insert_latency`

  The total wait time of timed insert I/O events for the table.

* `rows_updated`

  The total number of rows updated in the table.

* `update_latency`

  The total wait time of timed update I/O events for the table.

* `rows_deleted`

  The total number of rows deleted from the table.

* `delete_latency`

  The total wait time of timed delete I/O events for the table.

* `io_read_requests`

  The total number of read requests for the table.

* `io_read`

  The total number of bytes read from the table.

* `io_read_latency`

  The total wait time of reads from the table.

* `io_write_requests`

  The total number of write requests for the table.

* `io_write`

  The total number of bytes written to the table.

* `io_write_latency`

  The total wait time of writes to the table.

* `io_misc_requests`

  The total number of miscellaneous I/O requests for the table.

* `io_misc_latency`

  The total wait time of miscellaneous I/O requests for the table.
