### 24.4.25 The INFORMATION\_SCHEMA INNODB\_SYS\_TABLESTATS View

The [`INNODB_SYS_TABLESTATS`](information-schema-innodb-sys-tablestats-table.html "24.4.25 The INFORMATION_SCHEMA INNODB_SYS_TABLESTATS View") table provides a view of low-level status information about `InnoDB` tables. This data is used by the MySQL optimizer to calculate which index to use when querying an `InnoDB` table. This information is derived from in-memory data structures rather than data stored on disk. There is no corresponding internal `InnoDB` system table.

`InnoDB` tables are represented in this view if they have been opened since the last server restart and have not aged out of the table cache. Tables for which persistent stats are available are always represented in this view.

Table statistics are updated only for [`DELETE`](delete.html "13.2.2 DELETE Statement") or [`UPDATE`](update.html "13.2.11 UPDATE Statement") operations that modify indexed columns. Statistics are not updated by operations that modify only nonindexed columns.

[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") clears table statistics and sets the `STATS_INITIALIZED` column to `Uninitialized`. Statistics are collected again the next time the table is accessed.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION\_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

The [`INNODB_SYS_TABLESTATS`](information-schema-innodb-sys-tablestats-table.html "24.4.25 The INFORMATION_SCHEMA INNODB_SYS_TABLESTATS View") table has these columns:

* `TABLE_ID`

  An identifier representing the table for which statistics are available; the same value as `INNODB_SYS_TABLES.TABLE_ID`.

* `NAME`

  The name of the table; the same value as `INNODB_SYS_TABLES.NAME`.

* `STATS_INITIALIZED`

  The value is `Initialized` if the statistics are already collected, `Uninitialized` if not.

* `NUM_ROWS`

  The current estimated number of rows in the table. Updated after each DML operation. The value could be imprecise if uncommitted transactions are inserting into or deleting from the table.

* `CLUST_INDEX_SIZE`

  The number of pages on disk that store the clustered index, which holds the `InnoDB` table data in primary key order. This value might be null if no statistics are collected yet for the table.

* `OTHER_INDEX_SIZE`

  The number of pages on disk that store all secondary indexes for the table. This value might be null if no statistics are collected yet for the table.

* `MODIFIED_COUNTER`

  The number of rows modified by DML operations, such as `INSERT`, `UPDATE`, `DELETE`, and also cascade operations from foreign keys. This column is reset each time table statistics are recalculated

* `AUTOINC`

  The next number to be issued for any auto-increment-based operation. The rate at which the `AUTOINC` value changes depends on how many times auto-increment numbers have been requested and how many numbers are granted per request.

* `REF_COUNT`

  When this counter reaches zero, the table metadata can be evicted from the table cache.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS where TABLE_ID = 71\G
*************************** 1. row ***************************
         TABLE_ID: 71
             NAME: test/t1
STATS_INITIALIZED: Initialized
         NUM_ROWS: 1
 CLUST_INDEX_SIZE: 1
 OTHER_INDEX_SIZE: 0
 MODIFIED_COUNTER: 1
          AUTOINC: 0
        REF_COUNT: 1
```

#### Notes

* This table is useful primarily for expert-level performance monitoring, or when developing performance-related extensions for MySQL.

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
