#### 25.12.12.1 The metadata_locks Table

MySQL uses metadata locking to manage concurrent access to database objects and to ensure data consistency; see [Section 8.11.4, “Metadata Locking”](metadata-locking.html "8.11.4 Metadata Locking"). Metadata locking applies not just to tables, but also to schemas, stored programs (procedures, functions, triggers, scheduled events), tablespaces, user locks acquired with the [`GET_LOCK()`](locking-functions.html#function_get-lock) function (see [Section 12.14, “Locking Functions”](locking-functions.html "12.14 Locking Functions")), and locks acquired with the locking service described in [Section 5.5.6.1, “The Locking Service”](locking-service.html "5.5.6.1 The Locking Service").

The Performance Schema exposes metadata lock information through the [`metadata_locks`](performance-schema-metadata-locks-table.html "25.12.12.1 The metadata_locks Table") table:

* Locks that have been granted (shows which sessions own which current metadata locks).

* Locks that have been requested but not yet granted (shows which sessions are waiting for which metadata locks).

* Lock requests that have been killed by the deadlock detector.

* Lock requests that have timed out and are waiting for the requesting session's lock request to be discarded.

This information enables you to understand metadata lock dependencies between sessions. You can see not only which lock a session is waiting for, but which session currently holds that lock.

The [`metadata_locks`](performance-schema-metadata-locks-table.html "25.12.12.1 The metadata_locks Table") table is read only and cannot be updated. It is autosized by default; to configure the table size, set the [`performance_schema_max_metadata_locks`](performance-schema-system-variables.html#sysvar_performance_schema_max_metadata_locks) system variable at server startup.

Metadata lock instrumentation uses the `wait/lock/metadata/sql/mdl` instrument, which is disabled by default.

To control metadata lock instrumentation state at server startup, use lines like these in your `my.cnf` file:

* Enable:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=ON'
  ```

* Disable:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/lock/metadata/sql/mdl=OFF'
  ```

To control metadata lock instrumentation state at runtime, update the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table:

* Enable:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

* Disable:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'wait/lock/metadata/sql/mdl';
  ```

The Performance Schema maintains [`metadata_locks`](performance-schema-metadata-locks-table.html "25.12.12.1 The metadata_locks Table") table content as follows, using the `LOCK_STATUS` column to indicate the status of each lock:

* When a metadata lock is requested and obtained immediately, a row with a status of `GRANTED` is inserted.

* When a metadata lock is requested and not obtained immediately, a row with a status of `PENDING` is inserted.

* When a metadata lock previously requested is granted, its row status is updated to `GRANTED`.

* When a metadata lock is released, its row is deleted.
* When a pending lock request is canceled by the deadlock detector to break a deadlock ([`ER_LOCK_DEADLOCK`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_lock_deadlock)), its row status is updated from `PENDING` to `VICTIM`.

* When a pending lock request times out ([`ER_LOCK_WAIT_TIMEOUT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_lock_wait_timeout)), its row status is updated from `PENDING` to `TIMEOUT`.

* When granted lock or pending lock request is killed, its row status is updated from `GRANTED` or `PENDING` to `KILLED`.

* The `VICTIM`, `TIMEOUT`, and `KILLED` status values are brief and signify that the lock row is about to be deleted.

* The `PRE_ACQUIRE_NOTIFY` and `POST_RELEASE_NOTIFY` status values are brief and signify that the metadata locking subsubsystem is notifying interested storage engines while entering lock acquisition operations or leaving lock release operations. These status values were added in MySQL 5.7.11.

The [`metadata_locks`](performance-schema-metadata-locks-table.html "25.12.12.1 The metadata_locks Table") table has these columns:

* `OBJECT_TYPE`

  The type of lock used in the metadata lock subsystem. The value is one of `GLOBAL`, `SCHEMA`, `TABLE`, `FUNCTION`, `PROCEDURE`, `TRIGGER` (currently unused), `EVENT`, `COMMIT`, `USER LEVEL LOCK`, `TABLESPACE`, or `LOCKING SERVICE`.

  A value of `USER LEVEL LOCK` indicates a lock acquired with [`GET_LOCK()`](locking-functions.html#function_get-lock). A value of `LOCKING SERVICE` indicates a lock acquired with the locking service described in [Section 5.5.6.1, “The Locking Service”](locking-service.html "5.5.6.1 The Locking Service").

* `OBJECT_SCHEMA`

  The schema that contains the object.

* `OBJECT_NAME`

  The name of the instrumented object.

* `OBJECT_INSTANCE_BEGIN`

  The address in memory of the instrumented object.

* `LOCK_TYPE`

  The lock type from the metadata lock subsystem. The value is one of `INTENTION_EXCLUSIVE`, `SHARED`, `SHARED_HIGH_PRIO`, `SHARED_READ`, `SHARED_WRITE`, `SHARED_UPGRADABLE`, `SHARED_NO_WRITE`, `SHARED_NO_READ_WRITE`, or `EXCLUSIVE`.

* `LOCK_DURATION`

  The lock duration from the metadata lock subsystem. The value is one of `STATEMENT`, `TRANSACTION`, or `EXPLICIT`. The `STATEMENT` and `TRANSACTION` values signify locks that are released implicitly at statement or transaction end, respectively. The `EXPLICIT` value signifies locks that survive statement or transaction end and are released by explicit action, such as global locks acquired with [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock).

* `LOCK_STATUS`

  The lock status from the metadata lock subsystem. The value is one of `PENDING`, `GRANTED`, `VICTIM`, `TIMEOUT`, `KILLED`, `PRE_ACQUIRE_NOTIFY`, or `POST_RELEASE_NOTIFY`. The Performance Schema assigns these values as described previously.

* `SOURCE`

  The name of the source file containing the instrumented code that produced the event and the line number in the file at which the instrumentation occurs. This enables you to check the source to determine exactly what code is involved.

* `OWNER_THREAD_ID`

  The thread requesting a metadata lock.

* `OWNER_EVENT_ID`

  The event requesting a metadata lock.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`metadata_locks`](performance-schema-metadata-locks-table.html "25.12.12.1 The metadata_locks Table") table.
