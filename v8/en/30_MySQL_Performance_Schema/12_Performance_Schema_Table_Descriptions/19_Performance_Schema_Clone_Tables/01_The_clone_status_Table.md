#### 29.12.19.1 The clone_status Table

Note

The Performance Schema table described here is available as of MySQL 8.0.17.

The `clone_status` table shows the status of the current or last executed cloning operation only. The table only ever contains one row of data, or is empty.

The `clone_status` table has these columns:

* `ID`

  A unique cloning operation identifier in the current MySQL server instance.

* `PID`

  Process list ID of the session executing the cloning operation.

* `STATE`

  Current state of the cloning operation. Values include `Not Started`, `In Progress`, `Completed`, and `Failed`.

* `BEGIN_TIME`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the cloning operation started.

* `END_TIME`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the cloning operation finished. Reports NULL if the operation has not ended.

* `SOURCE`

  The donor MySQL server address in '`HOST:PORT`' format. The column displays '`LOCAL INSTANCE`' for a local cloning operation.

* `DESTINATION`

  The directory being cloned to.

* `ERROR_NO`

  The error number reported for a failed cloning operation.

* `ERROR_MESSAGE`

  The error message string for a failed cloning operation.

* `BINLOG_FILE`

  The name of the binary log file up to which data is cloned.

* `BINLOG_POSITION`

  The binary log file offset up to which data is cloned.

* `GTID_EXECUTED`

  The GTID value for the last cloned transaction.

The `clone_status` table is read-only. DDL, including `TRUNCATE TABLE`, is not permitted.
