#### 29.12.3.2 The file_instances Table

The `file_instances` table lists all the files seen by the Performance Schema when executing file I/O instrumentation. If a file on disk has never been opened, it is not shown in `file_instances`. When a file is deleted from the disk, it is also removed from the `file_instances` table.

The `file_instances` table has these columns:

* `FILE_NAME`

  The file name.

* `EVENT_NAME`

  The instrument name associated with the file.

* `OPEN_COUNT`

  The count of open handles on the file. If a file was opened and then closed, it was opened 1 time, but `OPEN_COUNT` is 0. To list all the files currently opened by the server, use `WHERE OPEN_COUNT > 0`.

The `file_instances` table has these indexes:

* Primary key on (`FILE_NAME`)
* Index on (`EVENT_NAME`)

`TRUNCATE TABLE` is not permitted for the `file_instances` table.
