### 19.4.3 Monitoring Row-based Replication

The current progress of the replication applier (SQL) thread when using row-based replication is monitored through Performance Schema instrument stages, enabling you to track the processing of operations and check the amount of work completed and work estimated. When these Performance Schema instrument stages are enabled the `events_stages_current` table shows stages for applier threads and their progress. For background information, see Section 29.12.5, “Performance Schema Stage Event Tables”.

To track progress of all three row-based replication event types (write, update, delete):

* Enable the three Performance Schema stages by issuing:

  ```
  mysql> UPDATE performance_schema.setup_instruments SET ENABLED = 'YES'
      -> WHERE NAME LIKE 'stage/sql/Applying batch of row changes%';
  ```

* Wait for some events to be processed by the replication applier thread and then check progress by looking into the `events_stages_current` table. For example to get progress for `update` events issue:

  ```
  mysql> SELECT WORK_COMPLETED, WORK_ESTIMATED FROM performance_schema.events_stages_current
      -> WHERE EVENT_NAME LIKE 'stage/sql/Applying batch of row changes (update)'
  ```

* If `binlog_rows_query_log_events` is enabled, information about queries is stored in the binary log and is exposed in the `processlist_info` field. To see the original query that triggered this event:

  ```
  mysql> SELECT db, processlist_state, processlist_info FROM performance_schema.threads
      -> WHERE processlist_state LIKE 'stage/sql/Applying batch of row changes%' AND thread_id = N;
  ```
