#### 29.12.13.2 The data_lock_waits Table

The `data_lock_waits` table implements a many-to-many relationship showing which data lock requests in the `data_locks` table are blocked by which held data locks in the `data_locks` table. Held locks in `data_locks` appear in `data_lock_waits` only if they block some lock request.

This information enables you to understand data lock dependencies between sessions. The table exposes not only which lock a session or transaction is waiting for, but which session or transaction currently holds that lock.

Example data lock wait information:

```
mysql> SELECT * FROM performance_schema.data_lock_waits\G
*************************** 1. row ***************************
                          ENGINE: INNODB
       REQUESTING_ENGINE_LOCK_ID: 140211201964816:2:4:2:140211086465800
REQUESTING_ENGINE_TRANSACTION_ID: 1555
            REQUESTING_THREAD_ID: 47
             REQUESTING_EVENT_ID: 5
REQUESTING_OBJECT_INSTANCE_BEGIN: 140211086465800
         BLOCKING_ENGINE_LOCK_ID: 140211201963888:2:4:2:140211086459880
  BLOCKING_ENGINE_TRANSACTION_ID: 1554
              BLOCKING_THREAD_ID: 46
               BLOCKING_EVENT_ID: 12
  BLOCKING_OBJECT_INSTANCE_BEGIN: 140211086459880
```

Unlike most Performance Schema data collection, there are no instruments for controlling whether data lock information is collected or system variables for controlling data lock table sizes. The Performance Schema collects information that is already available in the server, so there is no memory or CPU overhead to generate this information or need for parameters that control its collection.

Use the `data_lock_waits` table to help diagnose performance problems that occur during times of heavy concurrent load. For `InnoDB`, see the discussion of this topic at Section 17.15.2, “InnoDB INFORMATION_SCHEMA Transaction and Locking Information”.

Because the columns in the `data_lock_waits` table are similar to those in the `data_locks` table, the column descriptions here are abbreviated. For more detailed column descriptions, see Section 29.12.13.1, “The data_locks Table”.

The `data_lock_waits` table has these columns:

* `ENGINE`

  The storage engine that requested the lock.

* `REQUESTING_ENGINE_LOCK_ID`

  The ID of the lock requested by the storage engine. To obtain details about the lock, join this column with the `ENGINE_LOCK_ID` column of the `data_locks` table.

* `REQUESTING_ENGINE_TRANSACTION_ID`

  The storage engine internal ID of the transaction that requested the lock.

* `REQUESTING_THREAD_ID`

  The thread ID of the session that requested the lock.

* `REQUESTING_EVENT_ID`

  The Performance Schema event that caused the lock request in the session that requested the lock.

* `REQUESTING_OBJECT_INSTANCE_BEGIN`

  The address in memory of the requested lock.

* `BLOCKING_ENGINE_LOCK_ID`

  The ID of the blocking lock. To obtain details about the lock, join this column with the `ENGINE_LOCK_ID` column of the `data_locks` table.

* `BLOCKING_ENGINE_TRANSACTION_ID`

  The storage engine internal ID of the transaction that holds the blocking lock.

* `BLOCKING_THREAD_ID`

  The thread ID of the session that holds the blocking lock.

* `BLOCKING_EVENT_ID`

  The Performance Schema event that caused the blocking lock in the session that holds it.

* `BLOCKING_OBJECT_INSTANCE_BEGIN`

  The address in memory of the blocking lock.

The `data_lock_waits` table has these indexes:

* Index on (`REQUESTING_ENGINE_LOCK_ID`, `ENGINE`)

* Index on (`BLOCKING_ENGINE_LOCK_ID`, `ENGINE`)

* Index on (`REQUESTING_ENGINE_TRANSACTION_ID`, `ENGINE`)

* Index on (`BLOCKING_ENGINE_TRANSACTION_ID`, `ENGINE`)

* Index on (`REQUESTING_THREAD_ID`, `REQUESTING_EVENT_ID`)

* Index on (`BLOCKING_THREAD_ID`, `BLOCKING_EVENT_ID`)

`TRUNCATE TABLE` is not permitted for the `data_lock_waits` table.

Note

Prior to MySQL 8.0.1, information similar to that in the Performance Schema `data_lock_waits` table is available in the `INFORMATION_SCHEMA.INNODB_LOCK_WAITS` table, which provides information about each blocked `InnoDB` transaction, indicating the lock it has requested and any locks that are blocking that request. `INFORMATION_SCHEMA.INNODB_LOCK_WAITS` is deprecated and is removed as of MySQL 8.0.1. `data_lock_waits` should be used instead.

The tables differ in the privileges required: The `INNODB_LOCK_WAITS` table requires the global `PROCESS` privilege. The `data_lock_waits` table requires the usual Performance Schema privilege of `SELECT` on the table to be selected from.

The following table shows the mapping from `INNODB_LOCK_WAITS` columns to `data_lock_waits` columns. Use this information to migrate applications from one table to the other.

**Table 29.5 Mapping from INNODB_LOCK_WAITS to data_lock_waits Columns**

<table summary="Mapping from INNODB_LOCK_WAITS to data_lock_waits columns."><thead><tr> <th>INNODB_LOCK_WAITS Column</th> <th>data_lock_waits Column</th> </tr></thead><tbody><tr> <td><code>REQUESTING_TRX_ID</code></td> <td><code>REQUESTING_ENGINE_TRANSACTION_ID</code></td> </tr><tr> <td><code>REQUESTED_LOCK_ID</code></td> <td><code>REQUESTING_ENGINE_LOCK_ID</code></td> </tr><tr> <td><code>BLOCKING_TRX_ID</code></td> <td><code>BLOCKING_ENGINE_TRANSACTION_ID</code></td> </tr><tr> <td><code>BLOCKING_LOCK_ID</code></td> <td><code>BLOCKING_ENGINE_LOCK_ID</code></td> </tr></tbody></table>
