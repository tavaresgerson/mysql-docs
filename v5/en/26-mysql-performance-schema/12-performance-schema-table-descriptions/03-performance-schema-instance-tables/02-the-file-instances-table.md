#### 25.12.3.2 The file\_instances Table

The [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table") table lists all the files seen by the Performance Schema when executing file I/O instrumentation. If a file on disk has never been opened, it is not in [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table"). When a file is deleted from the disk, it is also removed from the [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table") table.

The [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table") table has these columns:

* `FILE_NAME`

  The file name.

* `EVENT_NAME`

  The instrument name associated with the file.

* `OPEN_COUNT`

  The count of open handles on the file. If a file was opened and then closed, it was opened 1 time, but `OPEN_COUNT` is 0. To list all the files currently opened by the server, use `WHERE OPEN_COUNT > 0`.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table") table.
