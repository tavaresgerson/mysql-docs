#### 29.12.19.2 The clone_progress Table

The `clone_progress` table shows progress information for the current or last executed cloning operation only.

The stages of a cloning operation include `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART`, and `RECOVERY`. A cloning operation produces a record for each stage. The table therefore only ever contains seven rows of data, or is empty.

The `clone_progress` table has these columns:

* `ID`

  A unique cloning operation identifier in the current MySQL server instance.

* `STAGE`

  The name of the current cloning stage. Stages include `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART`, and `RECOVERY`.

* `STATE`

  The current state of the cloning stage. States include `Not Started`, `In Progress`, and `Completed`.

* `BEGIN_TIME`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the cloning stage started. Reports NULL if the stage has not started.

* `END_TIME`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the cloning stage finished. Reports NULL if the stage has not ended.

* `THREADS`

  The number of concurrent threads used in the stage.

* `ESTIMATE`

  The estimated amount of data for the current stage, in bytes.

* `DATA`

  The amount of data transferred in current state, in bytes.

* `NETWORK`

  The amount of network data transferred in the current state, in bytes.

* `DATA_SPEED`

  The current actual speed of data transfer, in bytes per second. This value may differ from the requested maximum data transfer rate defined by `clone_max_data_bandwidth`.

* `NETWORK_SPEED`

  The current speed of network transfer in bytes per second.

The `clone_progress` table is read-only. DDL, including `TRUNCATE TABLE`, is not permitted.
