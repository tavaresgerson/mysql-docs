### 24.4.28 The INFORMATION\_SCHEMA INNODB\_TRX Table

The [`INNODB_TRX`](information-schema-innodb-trx-table.html "24.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") table provides information about every transaction currently executing inside `InnoDB`, including whether the transaction is waiting for a lock, when the transaction started, and the SQL statement the transaction is executing, if any.

For usage information, see [Section 14.16.2.1, “Using InnoDB Transaction and Locking Information”](innodb-information-schema-examples.html "14.16.2.1 Using InnoDB Transaction and Locking Information").

The [`INNODB_TRX`](information-schema-innodb-trx-table.html "24.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") table has these columns:

* `TRX_ID`

  A unique transaction ID number, internal to `InnoDB`. These IDs are not created for transactions that are read only and nonlocking. For details, see [Section 8.5.3, “Optimizing InnoDB Read-Only Transactions”](innodb-performance-ro-txn.html "8.5.3 Optimizing InnoDB Read-Only Transactions").

* `TRX_WEIGHT`

  The weight of a transaction, reflecting (but not necessarily the exact count of) the number of rows altered and the number of rows locked by the transaction. To resolve a deadlock, `InnoDB` selects the transaction with the smallest weight as the “victim” to roll back. Transactions that have changed nontransactional tables are considered heavier than others, regardless of the number of altered and locked rows.

* `TRX_STATE`

  The transaction execution state. Permitted values are `RUNNING`, `LOCK WAIT`, `ROLLING BACK`, and `COMMITTING`.

* `TRX_STARTED`

  The transaction start time.

* `TRX_REQUESTED_LOCK_ID`

  The ID of the lock the transaction is currently waiting for, if `TRX_STATE` is `LOCK WAIT`; otherwise `NULL`. To obtain details about the lock, join this column with the `LOCK_ID` column of the [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table") table.

* `TRX_WAIT_STARTED`

  The time when the transaction started waiting on the lock, if `TRX_STATE` is `LOCK WAIT`; otherwise `NULL`.

* `TRX_MYSQL_THREAD_ID`

  The MySQL thread ID. To obtain details about the thread, join this column with the `ID` column of the `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table, but see [Section 14.16.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* `TRX_QUERY`

  The SQL statement that is being executed by the transaction.

* `TRX_OPERATION_STATE`

  The transaction's current operation, if any; otherwise `NULL`.

* `TRX_TABLES_IN_USE`

  The number of `InnoDB` tables used while processing the current SQL statement of this transaction.

* `TRX_TABLES_LOCKED`

  The number of `InnoDB` tables that the current SQL statement has row locks on. (Because these are row locks, not table locks, the tables can usually still be read from and written to by multiple transactions, despite some rows being locked.)

* `TRX_LOCK_STRUCTS`

  The number of locks reserved by the transaction.

* `TRX_LOCK_MEMORY_BYTES`

  The total size taken up by the lock structures of this transaction in memory.

* `TRX_ROWS_LOCKED`

  The approximate number or rows locked by this transaction. The value might include delete-marked rows that are physically present but not visible to the transaction.

* `TRX_ROWS_MODIFIED`

  The number of modified and inserted rows in this transaction.

* `TRX_CONCURRENCY_TICKETS`

  A value indicating how much work the current transaction can do before being swapped out, as specified by the [`innodb_concurrency_tickets`](innodb-parameters.html#sysvar_innodb_concurrency_tickets) system variable.

* `TRX_ISOLATION_LEVEL`

  The isolation level of the current transaction.

* `TRX_UNIQUE_CHECKS`

  Whether unique checks are turned on or off for the current transaction. For example, they might be turned off during a bulk data load.

* `TRX_FOREIGN_KEY_CHECKS`

  Whether foreign key checks are turned on or off for the current transaction. For example, they might be turned off during a bulk data load.

* `TRX_LAST_FOREIGN_KEY_ERROR`

  The detailed error message for the last foreign key error, if any; otherwise `NULL`.

* `TRX_ADAPTIVE_HASH_LATCHED`

  Whether the adaptive hash index is locked by the current transaction. When the adaptive hash index search system is partitioned, a single transaction does not lock the entire adaptive hash index. Adaptive hash index partitioning is controlled by [`innodb_adaptive_hash_index_parts`](innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts), which is set to 8 by default.

* `TRX_ADAPTIVE_HASH_TIMEOUT`

  Deprecated in MySQL 5.7.8. Always returns 0.

  Whether to relinquish the search latch immediately for the adaptive hash index, or reserve it across calls from MySQL. When there is no adaptive hash index contention, this value remains zero and statements reserve the latch until they finish. During times of contention, it counts down to zero, and statements release the latch immediately after each row lookup. When the adaptive hash index search system is partitioned (controlled by [`innodb_adaptive_hash_index_parts`](innodb-parameters.html#sysvar_innodb_adaptive_hash_index_parts)), the value remains 0.

* `TRX_IS_READ_ONLY`

  A value of 1 indicates the transaction is read only.

* `TRX_AUTOCOMMIT_NON_LOCKING`

  A value of 1 indicates the transaction is a [`SELECT`](select.html "13.2.9 SELECT Statement") statement that does not use the `FOR UPDATE` or `LOCK IN SHARED MODE` clauses, and is executing with [`autocommit`](server-system-variables.html#sysvar_autocommit) enabled so that the transaction contains only this one statement. When this column and `TRX_IS_READ_ONLY` are both 1, `InnoDB` optimizes the transaction to reduce the overhead associated with transactions that change table data.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TRX\G
*************************** 1. row ***************************
                    trx_id: 1510
                 trx_state: RUNNING
               trx_started: 2014-11-19 13:24:40
     trx_requested_lock_id: NULL
          trx_wait_started: NULL
                trx_weight: 586739
       trx_mysql_thread_id: 2
                 trx_query: DELETE FROM employees.salaries WHERE salary > 65000
       trx_operation_state: updating or deleting
         trx_tables_in_use: 1
         trx_tables_locked: 1
          trx_lock_structs: 3003
     trx_lock_memory_bytes: 450768
           trx_rows_locked: 1407513
         trx_rows_modified: 583736
   trx_concurrency_tickets: 0
       trx_isolation_level: REPEATABLE READ
         trx_unique_checks: 1
    trx_foreign_key_checks: 1
trx_last_foreign_key_error: NULL
 trx_adaptive_hash_latched: 0
 trx_adaptive_hash_timeout: 10000
          trx_is_read_only: 0
trx_autocommit_non_locking: 0
```

#### Notes

* Use this table to help diagnose performance problems that occur during times of heavy concurrent load. Its contents are updated as described in [Section 14.16.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
