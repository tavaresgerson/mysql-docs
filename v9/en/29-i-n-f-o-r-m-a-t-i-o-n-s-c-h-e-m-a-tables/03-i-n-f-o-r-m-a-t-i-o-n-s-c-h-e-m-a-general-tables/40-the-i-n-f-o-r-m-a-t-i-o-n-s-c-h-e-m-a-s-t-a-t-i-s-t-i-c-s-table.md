### 28.3.40 The INFORMATION\_SCHEMA STATISTICS Table

The `STATISTICS` table provides information about table indexes.

Columns in `STATISTICS` that represent table statistics hold cached values. The `information_schema_stats_expiry` system variable defines the period of time before cached table statistics expire. The default is 86400 seconds (24 hours). If there are no cached statistics or statistics have expired, statistics are retrieved from storage engines when querying table statistics columns. To update cached values at any time for a given table, use `ANALYZE TABLE`. To always retrieve the latest statistics directly from storage engines, set `information_schema_stats_expiry=0`. For more information, see Section 10.2.3, “Optimizing INFORMATION\_SCHEMA Queries”.

Note

If the `innodb_read_only` system variable is enabled, `ANALYZE TABLE` may fail because it cannot update statistics tables in the data dictionary, which use `InnoDB`. For `ANALYZE TABLE` operations that update the key distribution, failure may occur even if the operation updates the table itself (for example, if it is a `MyISAM` table). To obtain the updated distribution statistics, set `information_schema_stats_expiry=0`.

The `STATISTICS` table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table containing the index belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table containing the index belongs.

* `TABLE_NAME`

  The name of the table containing the index.

* `NON_UNIQUE`

  0 if the index cannot contain duplicates, 1 if it can.

* `INDEX_SCHEMA`

  The name of the schema (database) to which the index belongs.

* `INDEX_NAME`

  The name of the index. If the index is the primary key, the name is always `PRIMARY`.

* `SEQ_IN_INDEX`

  The column sequence number in the index, starting with 1.

* `COLUMN_NAME`

  The column name. See also the description for the `EXPRESSION` column.

* `COLLATION`

  How the column is sorted in the index. This can have values `A` (ascending), `D` (descending), or `NULL` (not sorted).

* `CARDINALITY`

  An estimate of the number of unique values in the index. To update this number, run `ANALYZE TABLE` or (for `MyISAM` tables) **myisamchk -a**.

  `CARDINALITY` is counted based on statistics stored as integers, so the value is not necessarily exact even for small tables. The higher the cardinality, the greater the chance that MySQL uses the index when doing joins.

* `SUB_PART`

  The index prefix. That is, the number of indexed characters if the column is only partly indexed, `NULL` if the entire column is indexed.

  Note

  Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in `CREATE TABLE`, `ALTER TABLE`, and `CREATE INDEX` statements are interpreted as number of characters for nonbinary string types (`CHAR`, `VARCHAR`, `TEXT`) and number of bytes for binary string types (`BINARY`, `VARBINARY`, `BLOB`). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  For additional information about index prefixes, see Section 10.3.5, “Column Indexes”, and Section 15.1.18, “CREATE INDEX Statement”.

* `PACKED`

  Indicates how the key is packed. `NULL` if it is not.

* `NULLABLE`

  Contains `YES` if the column may contain `NULL` values and `''` if not.

* `INDEX_TYPE`

  The index method used (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `COMMENT`

  Information about the index not described in its own column, such as `disabled` if the index is disabled.

* `INDEX_COMMENT`

  Any comment provided for the index with a `COMMENT` attribute when the index was created.

* `IS_VISIBLE`

  Whether the index is visible to the optimizer. See Section 10.3.12, “Invisible Indexes”.

* `EXPRESSION`

  MySQL supports functional key parts (see Functional Key Parts), which affects both the `COLUMN_NAME` and `EXPRESSION` columns:

  + For a nonfunctional key part, `COLUMN_NAME` indicates the column indexed by the key part and `EXPRESSION` is `NULL`.

  + For a functional key part, `COLUMN_NAME` column is `NULL` and `EXPRESSION` indicates the expression for the key part.

#### Notes

* There is no standard `INFORMATION_SCHEMA` table for indexes. The MySQL column list is similar to what SQL Server 2000 returns for `sp_statistics`, except that `QUALIFIER` and `OWNER` are replaced with `CATALOG` and `SCHEMA`, respectively.

Information about table indexes is also available from the `SHOW INDEX` statement. See Section 15.7.7.24, “SHOW INDEX Statement”. The following statements are equivalent:

```
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```

Information about generated invisible primary key columns is visible in this table by default. You can cause such information to be hidden by setting `show_gipk_in_create_table_and_information_schema = OFF`. For more information, see Section 15.1.24.11, “Generated Invisible Primary Keys”.
