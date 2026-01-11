#### 29.12.21.4 The innodb_redo_log_files Table

The `innodb_redo_log_files` table contains a row for each active `InnoDB` redo log file. This table was introduced in MySQL 8.0.30.

The `innodb_redo_log_files` table has the following columns:

* `FILE_ID`

  The ID of the redo log file. The value corresponds to the redo log file number.

* `FILE_NAME`

  The path and file name of the redo log file.

* `START_LSN`

  The log sequence number of the first block in the redo log file.

* `END_LSN`

  The log sequence number after the last block in the redo log file.

* `SIZE_IN_BYTES`

  The size of the redo log data in the file, in bytes. Data size is measured from the `END_LSN` to the start `>START_LSN`. The redo log file size on disk is slightly larger due to the file header (2048 bytes), which is not included in the value reported by this column.

* `IS_FULL`

  Whether the redo log file is full. A value of 0 indicates that free space in the file. A value of 1 indicates that the file is full.

* `CONSUMER_LEVEL`

  Reserved for future use.
