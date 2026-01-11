### 28.4.5 The INFORMATION_SCHEMA INNODB_CACHED_INDEXES Table

The `INNODB_CACHED_INDEXES` table reports the number of index pages cached in the `InnoDB` buffer pool for each index.

For related usage information and examples, see Section 17.15.5, “InnoDB INFORMATION_SCHEMA Buffer Pool Tables”.

The `INNODB_CACHED_INDEXES` table has these columns:

* `SPACE_ID`

  The tablespace ID.

* `INDEX_ID`

  An identifier for the index. Index identifiers are unique across all the databases in an instance.

* `N_CACHED_PAGES`

  The total number of index pages cached in the `InnoDB` buffer pool for a specific index since MySQL Server last started.

#### Examples

This query returns the number of index pages cached in the `InnoDB` buffer pool for a specific index:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CACHED_INDEXES WHERE INDEX_ID=65\G
*************************** 1. row ***************************
      SPACE_ID: 4294967294
      INDEX_ID: 65
N_CACHED_PAGES: 45
```

This query returns the number of index pages cached in the `InnoDB` buffer pool for each index, using the `INNODB_INDEXES` and `INNODB_TABLES` tables to resolve the table name and index name for each `INDEX_ID` value.

```
SELECT
  tables.NAME AS table_name,
  indexes.NAME AS index_name,
  cached.N_CACHED_PAGES AS n_cached_pages
FROM
  INFORMATION_SCHEMA.INNODB_CACHED_INDEXES AS cached,
  INFORMATION_SCHEMA.INNODB_INDEXES AS indexes,
  INFORMATION_SCHEMA.INNODB_TABLES AS tables
WHERE
  cached.INDEX_ID = indexes.INDEX_ID
  AND indexes.TABLE_ID = tables.TABLE_ID;
```

#### Notes

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.
