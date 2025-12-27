#### 25.12.7.1 The events\_transactions\_current Table

The [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") table contains current transaction events. The table stores one row per thread showing the current status of the thread's most recent monitored transaction event, so there is no system variable for configuring the table size. For example:

```sql
mysql> SELECT *
       FROM performance_schema.events_transactions_current LIMIT 1\G
*************************** 1. row ***************************
                      THREAD_ID: 26
                       EVENT_ID: 7
                   END_EVENT_ID: NULL
                     EVENT_NAME: transaction
                          STATE: ACTIVE
                         TRX_ID: NULL
                           GTID: 3E11FA47-71CA-11E1-9E33-C80AA9429562:56
                            XID: NULL
                       XA_STATE: NULL
                         SOURCE: transaction.cc:150
                    TIMER_START: 420833537900000
                      TIMER_END: NULL
                     TIMER_WAIT: NULL
                    ACCESS_MODE: READ WRITE
                ISOLATION_LEVEL: REPEATABLE READ
                     AUTOCOMMIT: NO
           NUMBER_OF_SAVEPOINTS: 0
NUMBER_OF_ROLLBACK_TO_SAVEPOINT: 0
    NUMBER_OF_RELEASE_SAVEPOINT: 0
          OBJECT_INSTANCE_BEGIN: NULL
               NESTING_EVENT_ID: 6
             NESTING_EVENT_TYPE: STATEMENT
```

Of the tables that contain transaction event rows, [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") is the most fundamental. Other tables that contain transaction event rows are logically derived from the current events. For example, the [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 The events_transactions_history Table") and [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table") tables are collections of the most recent transaction events that have ended, up to a maximum number of rows per thread and globally across all threads, respectively.

For more information about the relationship between the three transaction event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

For information about configuring whether to collect transaction events, see [Section 25.12.7, “Performance Schema Transaction Tables”](performance-schema-transaction-tables.html "25.12.7 Performance Schema Transaction Tables").

The [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") table has these columns:

* `THREAD_ID`, `EVENT_ID`

  The thread associated with the event and the thread current event number when the event starts. The `THREAD_ID` and `EVENT_ID` values taken together uniquely identify the row. No two rows have the same pair of values.

* `END_EVENT_ID`

  This column is set to `NULL` when the event starts and updated to the thread current event number when the event ends.

* `EVENT_NAME`

  The name of the instrument from which the event was collected. This is a `NAME` value from the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table. Instrument names may have multiple parts and form a hierarchy, as discussed in [Section 25.6, “Performance Schema Instrument Naming Conventions”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

* `STATE`

  The current transaction state. The value is `ACTIVE` (after [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")), `COMMITTED` (after [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")), or `ROLLED BACK` (after [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")).

* `TRX_ID`

  Unused.

* `GTID`

  The GTID column contains the value of [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next), which can be one of `ANONYMOUS`, `AUTOMATIC`, or a GTID using the format `UUID:NUMBER`. For transactions that use [`gtid_next=AUTOMATIC`](replication-options-gtids.html#sysvar_gtid_next), which is all normal client transactions, the GTID column changes when the transaction commits and the actual GTID is assigned. If [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is either `ON` or `ON_PERMISSIVE`, the GTID column changes to the transaction's GTID. If `gtid_mode` is either `OFF` or `OFF_PERMISSIVE`, the GTID column changes to `ANONYMOUS`.

* `XID_FORMAT_ID`, `XID_GTRID`, and `XID_BQUAL`

  The elements of the XA transaction identifier. They have the format described in [Section 13.3.7.1, “XA Transaction SQL Statements”](xa-statements.html "13.3.7.1 XA Transaction SQL Statements").

* `XA_STATE`

  The state of the XA transaction. The value is `ACTIVE` (after [`XA START`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), `IDLE` (after [`XA END`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), `PREPARED` (after [`XA PREPARE`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), `ROLLED BACK` (after [`XA ROLLBACK`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), or `COMMITTED` (after [`XA COMMIT`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")).

  On a replica, the same XA transaction can appear in the [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") table with different states on different threads. This is because immediately after the XA transaction is prepared, it is detached from the replication applier thread, and can be committed or rolled back by any thread on the replica. The [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") table displays the current status of the most recent monitored transaction event on the thread, and does not update this status when the thread is idle. So the XA transaction can still be displayed in the `PREPARED` state for the original applier thread, after it has been processed by another thread. To positively identify XA transactions that are still in the `PREPARED` state and need to be recovered, use the [`XA RECOVER`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") statement rather than the Performance Schema transaction tables.

* `SOURCE`

  The name of the source file containing the instrumented code that produced the event and the line number in the file at which the instrumentation occurs. This enables you to check the source to determine exactly what code is involved.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Timing information for the event. The unit for these values is picoseconds (trillionths of a second). The `TIMER_START` and `TIMER_END` values indicate when event timing started and ended. `TIMER_WAIT` is the event elapsed time (duration).

  If an event has not finished, `TIMER_END` is the current timer value and `TIMER_WAIT` is the time elapsed so far (`TIMER_END` − `TIMER_START`).

  If an event is produced from an instrument that has `TIMED = NO`, timing information is not collected, and `TIMER_START`, `TIMER_END`, and `TIMER_WAIT` are all `NULL`.

  For discussion of picoseconds as the unit for event times and factors that affect time values, see [Section 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

* `ACCESS_MODE`

  The transaction access mode. The value is `READ WRITE` or `READ ONLY`.

* `ISOLATION_LEVEL`

  The transaction isolation level. The value is [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read), [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), or [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable).

* `AUTOCOMMIT`

  Whether autcommit mode was enabled when the transaction started.

* `NUMBER_OF_SAVEPOINTS`, `NUMBER_OF_ROLLBACK_TO_SAVEPOINT`, `NUMBER_OF_RELEASE_SAVEPOINT`

  The number of [`SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), [`ROLLBACK TO SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), and [`RELEASE SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") statements issued during the transaction.

* `OBJECT_INSTANCE_BEGIN`

  Unused.

* `NESTING_EVENT_ID`

  The `EVENT_ID` value of the event within which this event is nested.

* `NESTING_EVENT_TYPE`

  The nesting event type. The value is `TRANSACTION`, `STATEMENT`, `STAGE`, or `WAIT`. (`TRANSACTION` does not appear because transactions cannot be nested.)

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") table. It removes the rows.
