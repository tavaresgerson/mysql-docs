### 24.4.15 The INFORMATION\_SCHEMA INNODB\_LOCK\_WAITS Table

The [`INNODB_LOCK_WAITS`](information-schema-innodb-lock-waits-table.html "24.4.15 The INFORMATION_SCHEMA INNODB_LOCK_WAITS Table") table contains one or more rows for each blocked `InnoDB` transaction, indicating the lock it has requested and any locks that are blocking that request.

Note

This table is deprecated as of MySQL 5.7.14 and is removed in MySQL 8.0.

The [`INNODB_LOCK_WAITS`](information-schema-innodb-lock-waits-table.html "24.4.15 The INFORMATION_SCHEMA INNODB_LOCK_WAITS Table") table has these columns:

* `REQUESTING_TRX_ID`

  The ID of the requesting (blocked) transaction.

* `REQUESTED_LOCK_ID`

  The ID of the lock for which a transaction is waiting. To obtain details about the lock, join this column with the `LOCK_ID` column of the [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table") table.

* `BLOCKING_TRX_ID`

  The ID of the blocking transaction.

* `BLOCKING_LOCK_ID`

  The ID of a lock held by a transaction blocking another transaction from proceeding. To obtain details about the lock, join this column with the `LOCK_ID` column of the [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table") table.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCK_WAITS\G
*************************** 1. row ***************************
requesting_trx_id: 3396
requested_lock_id: 3396:91:3:2
  blocking_trx_id: 3395
 blocking_lock_id: 3395:91:3:2
```

#### Notes

* Use this table to help diagnose performance problems that occur during times of heavy concurrent load. Its contents are updated as described in [Section 14.16.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.

* For usage information, see [Section 14.16.2.1, “Using InnoDB Transaction and Locking Information”](innodb-information-schema-examples.html "14.16.2.1 Using InnoDB Transaction and Locking Information").
