### 24.3.24 The INFORMATION_SCHEMA STATISTICS Table

The [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") table provides information about table indexes.

The [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") table has these columns:

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

  An estimate of the number of unique values in the index. To update this number, run [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") or (for `MyISAM` tables) [**myisamchk -a**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

  `CARDINALITY` is counted based on statistics stored as integers, so the value is not necessarily exact even for small tables. The higher the cardinality, the greater the chance that MySQL uses the index when doing joins.

* `SUB_PART`

  The index prefix. That is, the number of indexed characters if the column is only partly indexed, `NULL` if the entire column is indexed.

  Note

  Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), and [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") statements are interpreted as number of characters for nonbinary string types ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) and number of bytes for binary string types ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  For additional information about index prefixes, see [Section 8.3.4, “Column Indexes”](column-indexes.html "8.3.4 Column Indexes"), and [Section 13.1.14, “CREATE INDEX Statement”](create-index.html "13.1.14 CREATE INDEX Statement").

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

#### Notes

* There is no standard `INFORMATION_SCHEMA` table for indexes. The MySQL column list is similar to what SQL Server 2000 returns for `sp_statistics`, except that `QUALIFIER` and `OWNER` are replaced with `CATALOG` and `SCHEMA`, respectively.

Information about table indexes is also available from the [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") statement. See [Section 13.7.5.22, “SHOW INDEX Statement”](show-index.html "13.7.5.22 SHOW INDEX Statement"). The following statements are equivalent:

```sql
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```
