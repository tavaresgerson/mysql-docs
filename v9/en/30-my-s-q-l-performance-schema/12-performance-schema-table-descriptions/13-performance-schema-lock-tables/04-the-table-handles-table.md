#### 29.12.13.4 The table_handles Table

The Performance Schema exposes table lock information through the `table_handles` table to show the table locks currently in effect for each opened table handle. `table_handles` reports what is recorded by the table lock instrumentation. This information shows which table handles the server has open, how they are locked, and by which sessions.

The `table_handles` table is read only and cannot be updated. It is autosized by default; to configure the table size, set the `performance_schema_max_table_handles` system variable at server startup.

Table lock instrumentation uses the `wait/lock/table/sql/handler` instrument, which is enabled by default.

To control table lock instrumentation state at server startup, use lines like these in your `my.cnf` file:

* Enable:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=ON'
  ```

* Disable:

  ```
  [mysqld]
  performance-schema-instrument='wait/lock/table/sql/handler=OFF'
  ```

To control table lock instrumentation state at runtime, update the `setup_instruments` table:

* Enable:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

* Disable:

  ```
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/table/sql/handler';
  ```

The `table_handles` table has these columns:

* `OBJECT_TYPE`

  The table opened by a table handle.

* `OBJECT_SCHEMA`

  The schema that contains the object.

* `OBJECT_NAME`

  The name of the instrumented object.

* `OBJECT_INSTANCE_BEGIN`

  The table handle address in memory.

* `OWNER_THREAD_ID`

  The thread owning the table handle.

* `OWNER_EVENT_ID`

  The event which caused the table handle to be opened.

* `INTERNAL_LOCK`

  The table lock used at the SQL level. The value is one of `READ`, `READ WITH SHARED LOCKS`, `READ HIGH PRIORITY`, `READ NO INSERT`, `WRITE ALLOW WRITE`, `WRITE CONCURRENT INSERT`, `WRITE LOW PRIORITY`, or `WRITE`. For information about these lock types, see the `include/thr_lock.h` source file.

* `EXTERNAL_LOCK`

  The table lock used at the storage engine level. The value is one of `READ EXTERNAL` or `WRITE EXTERNAL`.

The `table_handles` table has these indexes:

* Primary key on (`OBJECT_INSTANCE_BEGIN`)
* Index on (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

* Index on (`OWNER_THREAD_ID`, `OWNER_EVENT_ID`)

`TRUNCATE TABLE` is not permitted for the `table_handles` table.
