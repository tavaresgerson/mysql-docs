#### 25.12.4.1 The events\_waits\_current Table

The [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") table contains current wait events. The table stores one row per thread showing the current status of the thread's most recent monitored wait event, so there is no system variable for configuring the table size.

Of the tables that contain wait event rows, [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") is the most fundamental. Other tables that contain wait event rows are logically derived from the current events. For example, the [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") and [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") tables are collections of the most recent wait events that have ended, up to a maximum number of rows per thread and globally across all threads, respectively.

For more information about the relationship between the three wait event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

For information about configuring whether to collect wait events, see [Section 25.12.4, “Performance Schema Wait Event Tables”](performance-schema-wait-tables.html "25.12.4 Performance Schema Wait Event Tables").

The [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") table has these columns:

* `THREAD_ID`, `EVENT_ID`

  The thread associated with the event and the thread current event number when the event starts. The `THREAD_ID` and `EVENT_ID` values taken together uniquely identify the row. No two rows have the same pair of values.

* `END_EVENT_ID`

  This column is set to `NULL` when the event starts and updated to the thread current event number when the event ends.

* `EVENT_NAME`

  The name of the instrument that produced the event. This is a `NAME` value from the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table. Instrument names may have multiple parts and form a hierarchy, as discussed in [Section 25.6, “Performance Schema Instrument Naming Conventions”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

* `SOURCE`

  The name of the source file containing the instrumented code that produced the event and the line number in the file at which the instrumentation occurs. This enables you to check the source to determine exactly what code is involved. For example, if a mutex or lock is being blocked, you can check the context in which this occurs.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Timing information for the event. The unit for these values is picoseconds (trillionths of a second). The `TIMER_START` and `TIMER_END` values indicate when event timing started and ended. `TIMER_WAIT` is the event elapsed time (duration).

  If an event has not finished, `TIMER_END` is the current timer value and `TIMER_WAIT` is the time elapsed so far (`TIMER_END` − `TIMER_START`).

  If an event is produced from an instrument that has `TIMED = NO`, timing information is not collected, and `TIMER_START`, `TIMER_END`, and `TIMER_WAIT` are all `NULL`.

  For discussion of picoseconds as the unit for event times and factors that affect time values, see [Section 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

* `SPINS`

  For a mutex, the number of spin rounds. If the value is `NULL`, the code does not use spin rounds or spinning is not instrumented.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`, `OBJECT_INSTANCE_BEGIN`

  These columns identify the object “being acted on.” What that means depends on the object type.

  For a synchronization object (`cond`, `mutex`, `rwlock`):

  + `OBJECT_SCHEMA`, `OBJECT_NAME`, and `OBJECT_TYPE` are `NULL`.

  + `OBJECT_INSTANCE_BEGIN` is the address of the synchronization object in memory.

  For a file I/O object:

  + `OBJECT_SCHEMA` is `NULL`.

  + `OBJECT_NAME` is the file name.
  + `OBJECT_TYPE` is `FILE`.

  + `OBJECT_INSTANCE_BEGIN` is an address in memory.

  For a socket object:

  + `OBJECT_NAME` is the `IP:PORT` value for the socket.

  + `OBJECT_INSTANCE_BEGIN` is an address in memory.

  For a table I/O object:

  + `OBJECT_SCHEMA` is the name of the schema that contains the table.

  + `OBJECT_NAME` is the table name.
  + `OBJECT_TYPE` is `TABLE` for a persistent base table or `TEMPORARY TABLE` for a temporary table.

  + `OBJECT_INSTANCE_BEGIN` is an address in memory.

  An `OBJECT_INSTANCE_BEGIN` value itself has no meaning, except that different values indicate different objects. `OBJECT_INSTANCE_BEGIN` can be used for debugging. For example, it can be used with `GROUP BY OBJECT_INSTANCE_BEGIN` to see whether the load on 1,000 mutexes (that protect, say, 1,000 pages or blocks of data) is spread evenly or just hitting a few bottlenecks. This can help you correlate with other sources of information if you see the same object address in a log file or another debugging or performance tool.

* `INDEX_NAME`

  The name of the index used. `PRIMARY` indicates the table primary index. `NULL` means that no index was used.

* `NESTING_EVENT_ID`

  The `EVENT_ID` value of the event within which this event is nested.

* `NESTING_EVENT_TYPE`

  The nesting event type. The value is `TRANSACTION`, `STATEMENT`, `STAGE`, or `WAIT`.

* `OPERATION`

  The type of operation performed, such as `lock`, `read`, or `write`.

* `NUMBER_OF_BYTES`

  The number of bytes read or written by the operation. For table I/O waits (events for the `wait/io/table/sql/handler` instrument), `NUMBER_OF_BYTES` indicates the number of rows. If the value is greater than 1, the event is for a batch I/O operation. The following discussion describes the difference between exclusively single-row reporting and reporting that reflects batch I/O.

  MySQL executes joins using a nested-loop implementation. The job of the Performance Schema instrumentation is to provide row count and accumulated execution time per table in the join. Assume a join query of the following form that is executed using a table join order of `t1`, `t2`, `t3`:

  ```sql
  SELECT ... FROM t1 JOIN t2 ON ... JOIN t3 ON ...
  ```

  Table “fanout” is the increase or decrease in number of rows from adding a table during join processing. If the fanout for table `t3` is greater than 1, the majority of row-fetch operations are for that table. Suppose that the join accesses 10 rows from `t1`, 20 rows from `t2` per row from `t1`, and 30 rows from `t3` per row of table `t2`. With single-row reporting, the total number of instrumented operations is:

  ```sql
  10 + (10 * 20) + (10 * 20 * 30) = 6210
  ```

  A significant reduction in the number of instrumented operations is achievable by aggregating them per scan (that is, per unique combination of rows from `t1` and `t2`). With batch I/O reporting, the Performance Schema produces an event for each scan of the innermost table `t3` rather than for each row, and the number of instrumented row operations reduces to:

  ```sql
  10 + (10 * 20) + (10 * 20) = 410
  ```

  That is a reduction of 93%, illustrating how the batch-reporting strategy significantly reduces Performance Schema overhead for table I/O by reducing the number of reporting calls. The tradeoff is lesser accuracy for event timing. Rather than time for an individual row operation as in per-row reporting, timing for batch I/O includes time spent for operations such as join buffering, aggregation, and returning rows to the client.

  For batch I/O reporting to occur, these conditions must be true:

  + Query execution accesses the innermost table of a query block (for a single-table query, that table counts as innermost)

  + Query execution does not request a single row from the table (so, for example, [`eq_ref`](explain-output.html#jointype_eq_ref) access prevents use of batch reporting)

  + Query execution does not evaluate a subquery containing table access for the table

* `FLAGS`

  Reserved for future use.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") table. It removes the rows.
