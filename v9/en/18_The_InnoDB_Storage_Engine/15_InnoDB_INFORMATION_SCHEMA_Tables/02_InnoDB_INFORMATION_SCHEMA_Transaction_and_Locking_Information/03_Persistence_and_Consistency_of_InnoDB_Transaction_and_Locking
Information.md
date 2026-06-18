#### 17.15.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information

The data exposed by the transaction and locking tables
(`INFORMATION_SCHEMA`
[`INNODB_TRX`](information-schema-innodb-trx-table.html "28.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") table, Performance
Schema [`data_locks`](performance-schema-data-locks-table.html "29.12.13.1 The data_locks Table") and
[`data_lock_waits`](performance-schema-data-lock-waits-table.html "29.12.13.2 The data_lock_waits Table") tables) represents
a glimpse into fast-changing data. This is not like user tables,
where the data changes only when application-initiated updates
occur. The underlying data is internal system-managed data, and
can change very quickly:

* Data might not be consistent between the
  [`INNODB_TRX`](information-schema-innodb-trx-table.html "28.4.28 The INFORMATION_SCHEMA INNODB_TRX Table"),
  [`data_locks`](performance-schema-data-locks-table.html "29.12.13.1 The data_locks Table"), and
  [`data_lock_waits`](performance-schema-data-lock-waits-table.html "29.12.13.2 The data_lock_waits Table") tables.

  The [`data_locks`](performance-schema-data-locks-table.html "29.12.13.1 The data_locks Table") and
  [`data_lock_waits`](performance-schema-data-lock-waits-table.html "29.12.13.2 The data_lock_waits Table") tables expose
  live data from the `InnoDB` storage engine,
  to provide lock information about the transactions in the
  [`INNODB_TRX`](information-schema-innodb-trx-table.html "28.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") table. Data
  retrieved from the lock tables exists when the
  [`SELECT`](select.html "15.2.13 SELECT Statement") is executed, but might
  be gone or changed by the time the query result is consumed
  by the client.

  Joining [`data_locks`](performance-schema-data-locks-table.html "29.12.13.1 The data_locks Table") with
  [`data_lock_waits`](performance-schema-data-lock-waits-table.html "29.12.13.2 The data_lock_waits Table") can show rows
  in [`data_lock_waits`](performance-schema-data-lock-waits-table.html "29.12.13.2 The data_lock_waits Table") that
  identify a parent row in
  [`data_locks`](performance-schema-data-locks-table.html "29.12.13.1 The data_locks Table") that no longer
  exists or does not exist yet.

* Data in the transaction and locking tables might not be
  consistent with data in the
  `INFORMATION_SCHEMA`
  [`PROCESSLIST`](information-schema-processlist-table.html "28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table") table or
  Performance Schema [`threads`](performance-schema-threads-table.html "29.12.22.10 The threads Table")
  table.

  For example, you should be careful when comparing data in
  the `InnoDB` transaction and locking tables
  with data in the [`PROCESSLIST`](information-schema-processlist-table.html "28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table")
  table. Even if you issue a single `SELECT`
  (joining [`INNODB_TRX`](information-schema-innodb-trx-table.html "28.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") and
  [`PROCESSLIST`](information-schema-processlist-table.html "28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table"), for example), the
  content of those tables is generally not consistent. It is
  possible for [`INNODB_TRX`](information-schema-innodb-trx-table.html "28.4.28 The INFORMATION_SCHEMA INNODB_TRX Table") to
  reference rows that are not present in
  [`PROCESSLIST`](information-schema-processlist-table.html "28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table") or for the
  currently executing SQL query of a transaction shown in
  `INNODB_TRX.TRX_QUERY` to differ from the
  one in `PROCESSLIST.INFO`.