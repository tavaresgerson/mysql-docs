### 24.4.14 The INFORMATION\_SCHEMA INNODB\_LOCKS Table

The [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table") table provides information about each lock that an `InnoDB` transaction has requested but not yet acquired, and each lock that a transaction holds that is blocking another transaction.

Note

This table is deprecated as of MySQL 5.7.14 and is removed in MySQL 8.0.

The [`INNODB_LOCKS`](information-schema-innodb-locks-table.html "24.4.14 The INFORMATION_SCHEMA INNODB_LOCKS Table") table has these columns:

* `LOCK_ID`

  A unique lock ID number, internal to `InnoDB`. Treat it as an opaque string. Although `LOCK_ID` currently contains `TRX_ID`, the format of the data in `LOCK_ID` is subject to change at any time. Do not write applications that parse the `LOCK_ID` value.

* `LOCK_TRX_ID`

  The ID of the transaction holding the lock. To obtain details about the transaction, join this column with the `TRX_ID` column of the [`INNODB_TRX`](information-schema-innodb-trx-table.html "24.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") table.

* `LOCK_MODE`

  How the lock is requested. Permitted lock mode descriptors are `S`, `X`, `IS`, `IX`, `GAP`, `AUTO_INC`, and `UNKNOWN`. Lock mode descriptors may be used in combination to identify particular lock modes. For information about `InnoDB` lock modes, see [Section 14.7.1, “InnoDB Locking”](innodb-locking.html "14.7.1 InnoDB Locking").

* `LOCK_TYPE`

  The type of lock. Permitted values are `RECORD` for a row-level lock, `TABLE` for a table-level lock.

* `LOCK_TABLE`

  The name of the table that has been locked or contains locked records.

* `LOCK_INDEX`

  The name of the index, if `LOCK_TYPE` is `RECORD`; otherwise `NULL`.

* `LOCK_SPACE`

  The tablespace ID of the locked record, if `LOCK_TYPE` is `RECORD`; otherwise `NULL`.

* `LOCK_PAGE`

  The page number of the locked record, if `LOCK_TYPE` is `RECORD`; otherwise `NULL`.

* `LOCK_REC`

  The heap number of the locked record within the page, if `LOCK_TYPE` is `RECORD`; otherwise `NULL`.

* `LOCK_DATA`

  The data associated with the lock, if any. A value is shown if the `LOCK_TYPE` is `RECORD`, otherwise the value is `NULL`. Primary key values of the locked record are shown for a lock placed on the primary key index. Secondary index values of the locked record are shown for a lock placed on a unique secondary index. Secondary index values are shown with primary key values appended if the secondary index is not unique. If there is no primary key, `LOCK_DATA` shows either the key values of a selected unique index or the unique `InnoDB` internal row ID number, according to the rules governing `InnoDB` clustered index use (see [Section 14.6.2.1, “Clustered and Secondary Indexes”](innodb-index-types.html "14.6.2.1 Clustered and Secondary Indexes")). `LOCK_DATA` reports “supremum pseudo-record” for a lock taken on a supremum pseudo-record. If the page containing the locked record is not in the buffer pool because it was written to disk while the lock was held, `InnoDB` does not fetch the page from disk. Instead, `LOCK_DATA` reports `NULL`.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_LOCKS\G
*************************** 1. row ***************************
    lock_id: 3723:72:3:2
lock_trx_id: 3723
  lock_mode: X
  lock_type: RECORD
 lock_table: `mysql`.`t`
 lock_index: PRIMARY
 lock_space: 72
  lock_page: 3
   lock_rec: 2
  lock_data: 1, 9
*************************** 2. row ***************************
    lock_id: 3722:72:3:2
lock_trx_id: 3722
  lock_mode: S
  lock_type: RECORD
 lock_table: `mysql`.`t`
 lock_index: PRIMARY
 lock_space: 72
  lock_page: 3
   lock_rec: 2
  lock_data: 1, 9
```

#### Notes

* Use this table to help diagnose performance problems that occur during times of heavy concurrent load. Its contents are updated as described in [Section 14.16.2.3, “Persistence and Consistency of InnoDB Transaction and Locking Information”](innodb-information-schema-internal-data.html "14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information").

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.

* For usage information, see [Section 14.16.2.1, “Using InnoDB Transaction and Locking Information”](innodb-information-schema-examples.html "14.16.2.1 Using InnoDB Transaction and Locking Information").
