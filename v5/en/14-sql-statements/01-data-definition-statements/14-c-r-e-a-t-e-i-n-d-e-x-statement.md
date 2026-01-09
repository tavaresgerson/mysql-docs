### 13.1.14 CREATE INDEX Statement

```sql
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...

key_part:
    col_name [(length)] [ASC | DESC]

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
}

index_type:
    USING {BTREE | HASH}

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

Normally, you create all indexes on a table at the time the table itself is created with [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). See [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"). This guideline is especially important for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, where the primary key determines the physical layout of rows in the data file. [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") enables you to add indexes to existing tables.

[`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") is mapped to an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement to create indexes. See [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement"). [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") cannot be used to create a `PRIMARY KEY`; use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") instead. For more information about indexes, see [Section 8.3.1, “How MySQL Uses Indexes”](mysql-indexes.html "8.3.1 How MySQL Uses Indexes").

[`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") supports secondary indexes on virtual columns. For more information, see [Section 13.1.18.8, “Secondary Indexes and Generated Columns”](create-table-secondary-indexes.html "13.1.18.8 Secondary Indexes and Generated Columns").

When the [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent) setting is enabled, run the [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") statement for an [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") table after creating an index on that table.

An index specification of the form `(key_part1, key_part2, ...)` creates an index with multiple key parts. Index key values are formed by concatenating the values of the given key parts. For example `(col1, col2, col3)` specifies a multiple-column index with index keys consisting of values from `col1`, `col2`, and `col3`.

A *`key_part`* specification can end with `ASC` or `DESC`. These keywords are permitted for future extensions for specifying ascending or descending index value storage. Currently, they are parsed but ignored; index values are always stored in ascending order.

The following sections describe different aspects of the [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") statement:

* [Column Prefix Key Parts](create-index.html#create-index-column-prefixes "Column Prefix Key Parts")
* [Unique Indexes](create-index.html#create-index-unique "Unique Indexes")
* [Full-Text Indexes](create-index.html#create-index-fulltext "Full-Text Indexes")
* [Spatial Indexes](create-index.html#create-index-spatial "Spatial Indexes")
* [Index Options](create-index.html#create-index-options "Index Options")
* [Table Copying and Locking Options](create-index.html#create-index-copying "Table Copying and Locking Options")

#### Column Prefix Key Parts

For string columns, indexes can be created that use only the leading part of column values, using `col_name(length)` syntax to specify an index prefix length:

* Prefixes can be specified for [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), and [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") key parts.

* Prefixes *must* be specified for [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") key parts. Additionally, [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns can be indexed only for `InnoDB`, `MyISAM`, and `BLACKHOLE` tables.

* Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), and [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") statements are interpreted as number of characters for nonbinary string types ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) and number of bytes for binary string types ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  Prefix support and lengths of prefixes (where supported) are storage engine dependent. For example, a prefix can be up to 767 bytes long for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables or 3072 bytes if the [`innodb_large_prefix`](innodb-parameters.html#sysvar_innodb_large_prefix) option is enabled. For [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables, the prefix length limit is 1000 bytes. The [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine does not support prefixes (see [Section 21.2.7.6, “Unsupported or Missing Features in NDB Cluster”](mysql-cluster-limitations-unsupported.html "21.2.7.6 Unsupported or Missing Features in NDB Cluster")).

As of MySQL 5.7.17, if a specified index prefix exceeds the maximum column data type size, [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") handles the index as follows:

* For a nonunique index, either an error occurs (if strict SQL mode is enabled), or the index length is reduced to lie within the maximum column data type size and a warning is produced (if strict SQL mode is not enabled).

* For a unique index, an error occurs regardless of SQL mode because reducing the index length might enable insertion of nonunique entries that do not meet the specified uniqueness requirement.

The statement shown here creates an index using the first 10 characters of the `name` column (assuming that `name` has a nonbinary string type):

```sql
CREATE INDEX part_of_name ON customer (name(10));
```

If names in the column usually differ in the first 10 characters, lookups performed using this index should not be much slower than using an index created from the entire `name` column. Also, using column prefixes for indexes can make the index file much smaller, which could save a lot of disk space and might also speed up [`INSERT`](insert.html "13.2.5 INSERT Statement") operations.

#### Unique Indexes

A `UNIQUE` index creates a constraint such that all values in the index must be distinct. An error occurs if you try to add a new row with a key value that matches an existing row. If you specify a prefix value for a column in a `UNIQUE` index, the column values must be unique within the prefix length. A `UNIQUE` index permits multiple `NULL` values for columns that can contain `NULL`.

If a table has a `PRIMARY KEY` or `UNIQUE NOT NULL` index that consists of a single column that has an integer type, you can use `_rowid` to refer to the indexed column in [`SELECT`](select.html "13.2.9 SELECT Statement") statements, as follows:

* `_rowid` refers to the `PRIMARY KEY` column if there is a `PRIMARY KEY` consisting of a single integer column. If there is a `PRIMARY KEY` but it does not consist of a single integer column, `_rowid` cannot be used.

* Otherwise, `_rowid` refers to the column in the first `UNIQUE NOT NULL` index if that index consists of a single integer column. If the first `UNIQUE NOT NULL` index does not consist of a single integer column, `_rowid` cannot be used.

#### Full-Text Indexes

`FULLTEXT` indexes are supported only for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") and [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables and can include only [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns. Indexing always happens over the entire column; column prefix indexing is not supported and any prefix length is ignored if specified. See [Section 12.9, “Full-Text Search Functions”](fulltext-search.html "12.9 Full-Text Search Functions"), for details of operation.

#### Spatial Indexes

The [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), and [`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine") storage engines support spatial columns such as [`POINT`](spatial-type-overview.html "11.4.1 Spatial Data Types") and [`GEOMETRY`](spatial-type-overview.html "11.4.1 Spatial Data Types"). ([Section 11.4, “Spatial Data Types”](spatial-types.html "11.4 Spatial Data Types"), describes the spatial data types.) However, support for spatial column indexing varies among engines. Spatial and nonspatial indexes on spatial columns are available according to the following rules.

Spatial indexes on spatial columns (created using `SPATIAL INDEX`) have these characteristics:

* Available only for [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") and [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables. Specifying `SPATIAL INDEX` for other storage engines results in an error.

* Indexed columns must be `NOT NULL`.
* Column prefix lengths are prohibited. The full width of each column is indexed.

Nonspatial indexes on spatial columns (created with `INDEX`, `UNIQUE`, or `PRIMARY KEY`) have these characteristics:

* Permitted for any storage engine that supports spatial columns except [`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine").

* Columns can be `NULL` unless the index is a primary key.

* For each spatial column in a non-`SPATIAL` index except [`POINT`](spatial-type-overview.html "11.4.1 Spatial Data Types") columns, a column prefix length must be specified. (This is the same requirement as for indexed [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns.) The prefix length is given in bytes.

* The index type for a non-`SPATIAL` index depends on the storage engine. Currently, B-tree is used.

* Permitted for a column that can have `NULL` values only for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), and [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") tables.

#### Index Options

Following the key part list, index options can be given. An *`index_option`* value can be any of the following:

* `KEY_BLOCK_SIZE [=] value`

  For [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables, `KEY_BLOCK_SIZE` optionally specifies the size in bytes to use for index key blocks. The value is treated as a hint; a different size could be used if necessary. A `KEY_BLOCK_SIZE` value specified for an individual index definition overrides a table-level `KEY_BLOCK_SIZE` value.

  `KEY_BLOCK_SIZE` is not supported at the index level for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables. See [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement").

* *`index_type`*

  Some storage engines permit you to specify an index type when creating an index. For example:

  ```sql
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

  [Table 13.1, “Index Types Per Storage Engine”](create-index.html#create-index-storage-engine-index-types "Table 13.1 Index Types Per Storage Engine") shows the permissible index type values supported by different storage engines. Where multiple index types are listed, the first one is the default when no index type specifier is given. Storage engines not listed in the table do not support an *`index_type`* clause in index definitions.

  **Table 13.1 Index Types Per Storage Engine**

  <table summary="Permissible index types by storage engine."><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Storage Engine</th> <th>Permissible Index Types</th> </tr></thead><tbody><tr> <td><a class="link" href="innodb-storage-engine.html" title="Chapter 14 The InnoDB Storage Engine"><code>InnoDB</code></a></td> <td><code>BTREE</code></td> </tr><tr> <td><a class="link" href="myisam-storage-engine.html" title="15.2 The MyISAM Storage Engine"><code>MyISAM</code></a></td> <td><code>BTREE</code></td> </tr><tr> <td><a class="link" href="memory-storage-engine.html" title="15.3 The MEMORY Storage Engine"><code>MEMORY</code></a>/<code>HEAP</code></td> <td><code>HASH</code>, <code>BTREE</code></td> </tr><tr> <td><a class="link" href="mysql-cluster.html" title="Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"><code>NDB</code></a></td> <td><code>HASH</code>, <code>BTREE</code> (see note in text)</td> </tr></tbody></table>

  The *`index_type`* clause cannot be used for `FULLTEXT INDEX` or `SPATIAL INDEX` specifications. Full-text index implementation is storage engine dependent. Spatial indexes are implemented as R-tree indexes.

  `BTREE` indexes are implemented by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine as T-tree indexes.

  Note

  For indexes on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table columns, the `USING` option can be specified only for a unique index or primary key. `USING HASH` prevents the creation of an ordered index; otherwise, creating a unique index or primary key on an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table automatically results in the creation of both an ordered index and a hash index, each of which indexes the same set of columns.

  For unique indexes that include one or more `NULL` columns of an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table, the hash index can be used only to look up literal values, which means that `IS [NOT] NULL` conditions require a full scan of the table. One workaround is to make sure that a unique index using one or more `NULL` columns on such a table is always created in such a way that it includes the ordered index; that is, avoid employing `USING HASH` when creating the index.

  If you specify an index type that is not valid for a given storage engine, but another index type is available that the engine can use without affecting query results, the engine uses the available type. The parser recognizes `RTREE` as a type name, but currently this cannot be specified for any storage engine.

  Note

  Use of the *`index_type`* option before the `ON tbl_name` clause is deprecated; you should expect support for use of the option in this position to be removed in a future MySQL release. If an *`index_type`* option is given in both the earlier and later positions, the final option applies.

  `TYPE type_name` is recognized as a synonym for `USING type_name`. However, `USING` is the preferred form.

  The following tables show index characteristics for the storage engines that support the *`index_type`* option.

  **Table 13.2 InnoDB Storage Engine Index Characteristics**

  <table summary="Index characteristics of the InnoDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Index Class</th> <th>Index Type</th> <th>Stores NULL VALUES</th> <th>Permits Multiple NULL Values</th> <th>IS NULL Scan Type</th> <th>IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Table 13.3 MyISAM Storage Engine Index Characteristics**

  <table summary="Index characteristics of the MyISAM storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Index Class</th> <th>Index Type</th> <th>Stores NULL VALUES</th> <th>Permits Multiple NULL Values</th> <th>IS NULL Scan Type</th> <th>IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Table 13.4 MEMORY Storage Engine Index Characteristics**

  <table summary="Index characteristics of the Memory storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Index Class</th> <th>Index Type</th> <th>Stores NULL VALUES</th> <th>Permits Multiple NULL Values</th> <th>IS NULL Scan Type</th> <th>IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th>Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr></tbody></table>

  **Table 13.5 NDB Storage Engine Index Characteristics**

  <table summary="Index characteristics of the NDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Index Class</th> <th>Index Type</th> <th>Stores NULL VALUES</th> <th>Permits Multiple NULL Values</th> <th>IS NULL Scan Type</th> <th>IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th>Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th>Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th>Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th>Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr></tbody></table>

  Table note:

  1. If `USING HASH` is specified that prevents creation of an implicit ordered index.

* `WITH PARSER parser_name`

  This option can be used only with `FULLTEXT` indexes. It associates a parser plugin with the index if full-text indexing and searching operations need special handling. [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") and [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") support full-text parser plugins. If you have a [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") table with an associated full-text parser plugin, you can convert the table to `InnoDB` using `ALTER TABLE`. See [Full-Text Parser Plugins](/doc/extending-mysql/5.7/en/plugin-types.html#full-text-plugin-type) and [Writing Full-Text Parser Plugins](/doc/extending-mysql/5.7/en/writing-full-text-plugins.html) for more information.

* `COMMENT 'string'`

  Index definitions can include an optional comment of up to 1024 characters.

  The [`MERGE_THRESHOLD`](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages") for index pages can be configured for individual indexes using the *`index_option`* `COMMENT` clause of the [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") statement. For example:

  ```sql
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

  If the page-full percentage for an index page falls below the `MERGE_THRESHOLD` value when a row is deleted or when a row is shortened by an update operation, [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") attempts to merge the index page with a neighboring index page. The default `MERGE_THRESHOLD` value is 50, which is the previously hardcoded value.

  `MERGE_THRESHOLD` can also be defined at the index level and table level using [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements. For more information, see [Section 14.8.12, “Configuring the Merge Threshold for Index Pages”](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages").

#### Table Copying and Locking Options

`ALGORITHM` and `LOCK` clauses may be given to influence the table copying method and level of concurrency for reading and writing the table while its indexes are being modified. They have the same meaning as for the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement. For more information, see [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement")

NDB Cluster formerly supported online `CREATE INDEX` operations using an alternative syntax that is no longer supported. NDB Cluster now supports online operations using the same `ALGORITHM=INPLACE` syntax used with the standard MySQL Server. See [Section 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), for more information.
