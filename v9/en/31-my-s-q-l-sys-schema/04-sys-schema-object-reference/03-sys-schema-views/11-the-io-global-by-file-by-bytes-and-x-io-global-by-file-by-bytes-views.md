#### 30.4.3.11 The io\_global\_by\_file\_by\_bytes and x$io\_global\_by\_file\_by\_bytes Views

These views summarize global I/O consumers to display amount of I/O, grouped by file. By default, rows are sorted by descending total I/O (bytes read and written).

The `io_global_by_file_by_bytes` and `x$io_global_by_file_by_bytes` views have these columns:

* `file`

  The file path name.

* `count_read`

  The total number of read events for the file.

* `total_read`

  The total number of bytes read from the file.

* `avg_read`

  The average number of bytes per read from the file.

* `count_write`

  The total number of write events for the file.

* `total_written`

  The total number of bytes written to the file.

* `avg_write`

  The average number of bytes per write to the file.

* `total`

  The total number of bytes read and written for the file.

* `write_pct`

  The percentage of total bytes of I/O that were writes.
