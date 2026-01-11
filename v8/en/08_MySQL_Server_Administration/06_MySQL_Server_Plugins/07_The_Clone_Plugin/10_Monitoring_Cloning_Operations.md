#### 7.6.7.10 Monitoring Cloning Operations

This section describes options for monitoring cloning operations.

* Monitoring Cloning Operations using Performance Schema Clone Tables
* Monitoring Cloning Operations Using Performance Schema Stage Events
* Monitoring Cloning Operations Using Performance Schema Clone Instrumentation

* The Com_clone Status Variable

##### Monitoring Cloning Operations using Performance Schema Clone Tables

A cloning operation may take some time to complete, depending on the amount of data and other factors related to data transfer. You can monitor the status and progress of a cloning operation on the recipient MySQL server instance using the `clone_status` and `clone_progress` Performance Schema tables.

Note

The `clone_status` and `clone_progress` Performance Schema tables can be used to monitor a cloning operation on the recipient MySQL server instance only. To monitor a cloning operation on the donor MySQL server instance, use the clone stage events, as described in Monitoring Cloning Operations Using Performance Schema Stage Events.

* The `clone_status` table provides the state of the current or last executed cloning operation. A clone operation has four possible states: `Not Started`, `In Progress`, `Completed`, and `Failed`.

* The `clone_progress` table provides progress information for the current or last executed clone operation, by stage. The stages of a cloning operation include `DROP DATA`, `FILE COPY`, `PAGE_COPY`, `REDO_COPY`, `FILE_SYNC`, `RESTART`, and `RECOVERY`.

The `SELECT` and `EXECUTE` privileges on the Performance Schema is required to access the Performance Schema clone tables.

To check the state of a cloning operation:

1. Connect to the recipient MySQL server instance.
2. Query the `clone_status` table:

   ```
   mysql> SELECT STATE FROM performance_schema.clone_status;
   +-----------+
   | STATE     |
   +-----------+
   | Completed |
   +-----------+
   ```

Should a failure occur during a cloning operation, you can query the `clone_status` table for error information:

```
mysql> SELECT STATE, ERROR_NO, ERROR_MESSAGE FROM performance_schema.clone_status;
+-----------+----------+---------------+
| STATE     | ERROR_NO | ERROR_MESSAGE |
+-----------+----------+---------------+
| Failed    |      xxx | "xxxxxxxxxxx" |
+-----------+----------+---------------+
```

To review the details of each stage of a cloning operation:

1. Connect to the recipient MySQL server instance.
2. Query the `clone_progress` table. For example, the following query provides state and end time data for each stage of the cloning operation:

   ```
   mysql> SELECT STAGE, STATE, END_TIME FROM performance_schema.clone_progress;
   +-----------+-----------+----------------------------+
   | stage     | state     | end_time                   |
   +-----------+-----------+----------------------------+
   | DROP DATA | Completed | 2019-01-27 22:45:43.141261 |
   | FILE COPY | Completed | 2019-01-27 22:45:44.457572 |
   | PAGE COPY | Completed | 2019-01-27 22:45:44.577330 |
   | REDO COPY | Completed | 2019-01-27 22:45:44.679570 |
   | FILE SYNC | Completed | 2019-01-27 22:45:44.918547 |
   | RESTART   | Completed | 2019-01-27 22:45:48.583565 |
   | RECOVERY  | Completed | 2019-01-27 22:45:49.626595 |
   +-----------+-----------+----------------------------+
   ```

   For other clone status and progress data points that you can monitor, refer to Section 29.12.19, “Performance Schema Clone Tables”.

##### Monitoring Cloning Operations Using Performance Schema Stage Events

A cloning operation may take some time to complete, depending on the amount of data and other factors related to data transfer. There are three stage events for monitoring the progress of a cloning operation. Each stage event reports `WORK_COMPLETED` and `WORK_ESTIMATED` values. Reported values are revised as the operation progresses.

This method of monitoring a cloning operation can be used on the donor or recipient MySQL server instance.

In order of occurrence, cloning operation stage events include:

* `stage/innodb/clone (file copy)`: Indicates progress of the file copy phase of the cloning operation. `WORK_ESTIMATED` and `WORK_COMPLETED` units are file chunks. The number of files to be transferred is known at the start of the file copy phase, and the number of chunks is estimated based on the number of files. `WORK_ESTIMATED` is set to the number of estimated file chunks. `WORK_COMPLETED` is updated after each chunk is sent.

* `stage/innodb/clone (page copy)`: Indicates progress of the page copy phase of cloning operation. `WORK_ESTIMATED` and `WORK_COMPLETED` units are pages. Once the file copy phase is completed, the number of pages to be transferred is known, and `WORK_ESTIMATED` is set to this value. `WORK_COMPLETED` is updated after each page is sent.

* `stage/innodb/clone (redo copy)`: Indicates progress of the redo copy phase of cloning operation. `WORK_ESTIMATED` and `WORK_COMPLETED` units are redo chunks. Once the page copy phase is completed, the number of redo chunks to be transferred is known, and `WORK_ESTIMATED` is set to this value. `WORK_COMPLETED` is updated after each chunk is sent.

The following example demonstrates how to enable `stage/innodb/clone%` event instruments and related consumer tables to monitor a cloning operation. For information about Performance Schema stage event instruments and related consumers, see Section 29.12.5, “Performance Schema Stage Event Tables”.

1. Enable the `stage/innodb/clone%` instruments:

   ```
   mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/clone%';
   ```

2. Enable the stage event consumer tables, which include `events_stages_current`, `events_stages_history`, and `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   ```

3. Run a cloning operation. In this example, a local data directory is cloned to a directory named `cloned_dir`.

   ```
   mysql> CLONE LOCAL DATA DIRECTORY = '/path/to/cloned_dir';
   ```

4. Check the progress of the cloning operation by querying the Performance Schema `events_stages_current` table. The stage event shown differs depending on the cloning phase that is in progress. The `WORK_COMPLETED` column shows the work completed. The `WORK_ESTIMATED` column shows the work required in total.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

   The `events_stages_current` table returns an empty set if the cloning operation has finished. In this case, you can check the `events_stages_history` table to view event data for the completed operation. For example:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM events_stages_history
          WHERE EVENT_NAME LIKE 'stage/innodb/clone%';
   +--------------------------------+----------------+----------------+
   | EVENT_NAME                     | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------+----------------+----------------+
   | stage/innodb/clone (file copy) |            301 |            301 |
   | stage/innodb/clone (page copy) |              0 |              0 |
   | stage/innodb/clone (redo copy) |              1 |              1 |
   +--------------------------------+----------------+----------------+
   ```

##### Monitoring Cloning Operations Using Performance Schema Clone Instrumentation

Performance Schema provides instrumentation for advanced performance monitoring of clone operations. To view the available clone instrumentation, and issue the following query:

```
mysql> SELECT NAME,ENABLED FROM performance_schema.setup_instruments
       WHERE NAME LIKE '%clone%';
+---------------------------------------------------+---------+
| NAME                                              | ENABLED |
+---------------------------------------------------+---------+
| wait/synch/mutex/innodb/clone_snapshot_mutex      | NO      |
| wait/synch/mutex/innodb/clone_sys_mutex           | NO      |
| wait/synch/mutex/innodb/clone_task_mutex          | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_donor_list  | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_handler_run | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_query       | NO      |
| wait/synch/mutex/group_rpl/LOCK_clone_read_mode   | NO      |
| wait/synch/cond/group_rpl/COND_clone_handler_run  | NO      |
| wait/io/file/innodb/innodb_clone_file             | YES     |
| stage/innodb/clone (file copy)                    | YES     |
| stage/innodb/clone (redo copy)                    | YES     |
| stage/innodb/clone (page copy)                    | YES     |
| statement/abstract/clone                          | YES     |
| statement/clone/local                             | YES     |
| statement/clone/client                            | YES     |
| statement/clone/server                            | YES     |
| memory/innodb/clone                               | YES     |
| memory/clone/data                                 | YES     |
+---------------------------------------------------+---------+
```

###### Wait Instruments

Performance schema wait instruments track events that take time. Clone wait event instruments include:

* `wait/synch/mutex/innodb/clone_snapshot_mutex`: Tracks wait events for the clone snapshot mutex, which synchronizes access to the dynamic snapshot object (on the donor and recipient) between multiple clone threads.

* `wait/synch/mutex/innodb/clone_sys_mutex`: Tracks wait events for the clone sys mutex. There is one clone system object in a MySQL server instance. This mutex synchronizes access to the clone system object on the donor and recipient. It is acquired by clone threads and other foreground and background threads.

* `wait/synch/mutex/innodb/clone_task_mutex`: Tracks wait events for the clone task mutex, used for clone task management. The `clone_task_mutex` is acquired by clone threads.

* `wait/io/file/innodb/innodb_clone_file`: Tracks all I/O wait operations for files that clone operates on.

For information about monitoring `InnoDB` mutex waits, see Section 17.16.2, “Monitoring InnoDB Mutex Waits Using Performance Schema”. For information about monitoring wait events in general, see Section 29.12.4, “Performance Schema Wait Event Tables”.

###### Stage Instruments

Performance Schema stage events track steps that occur during the statement-execution process. Clone stage event instruments include:

* `stage/innodb/clone (file copy)`: Indicates progress of the file copy phase of the cloning operation.

* `stage/innodb/clone (redo copy)`: Indicates progress of the redo copy phase of cloning operation.

* `stage/innodb/clone (page copy)`: Indicates progress of the page copy phase of cloning operation.

For information about monitoring cloning operations using stage events, see Monitoring Cloning Operations Using Performance Schema Stage Events. For general information about monitoring stage events, see Section 29.12.5, “Performance Schema Stage Event Tables”.

###### Statement Instruments

Performance Schema statement events track statement execution. When a clone operation is initiated, the different statement types tracked by clone statement instruments may be executed in parallel. You can observe these statement events in the Performance Schema statement event tables. The number of statements that execute depends on the `clone_max_concurrency` and `clone_autotune_concurrency` settings.

Clone statement event instruments include:

* `statement/abstract/clone`: Tracks statement events for any clone operation before it is classified as a local, client, or server operation type.

* `statement/clone/local`: Tracks clone statement events for local clone operations; generated when executing a `CLONE LOCAL` statement.

* `statement/clone/client`: Tracks remote cloning statement events that occur on the recipient MySQL server instance; generated when executing a `CLONE INSTANCE` statement on the recipient.

* `statement/clone/server`: Tracks remote cloning statement events that occur on the donor MySQL server instance; generated when executing a `CLONE INSTANCE` statement on the recipient.

For information about monitoring Performance Schema statement events, see Section 29.12.6, “Performance Schema Statement Event Tables”.

###### Memory Instruments

Performance Schema memory instruments track memory usage. Clone memory usage instruments include:

* `memory/innodb/clone`: Tracks memory allocated by `InnoDB` for the dynamic snapshot.

* `memory/clone/data`: Tracks memory allocated by the clone plugin during a clone operation.

For information about monitoring memory usage using Performance Schema, see Section 29.12.20.10, “Memory Summary Tables”.

##### The Com_clone Status Variable

The `Com_clone` status variable provides a count of `CLONE` statement executions.

For more information, refer to the discussion about `Com_xxx` statement counter variables in Section 7.1.10, “Server Status Variables”.
