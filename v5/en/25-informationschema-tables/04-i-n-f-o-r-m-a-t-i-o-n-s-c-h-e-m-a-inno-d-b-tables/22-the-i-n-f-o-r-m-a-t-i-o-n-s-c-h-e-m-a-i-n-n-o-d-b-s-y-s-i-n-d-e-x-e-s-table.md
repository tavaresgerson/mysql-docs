### 24.4.22 The INFORMATION_SCHEMA INNODB_SYS_INDEXES Table

The [`INNODB_SYS_INDEXES`](information-schema-innodb-sys-indexes-table.html "24.4.22 The INFORMATION_SCHEMA INNODB_SYS_INDEXES Table") table provides metadata about `InnoDB` indexes, equivalent to the information in the internal `SYS_INDEXES` table in the `InnoDB` data dictionary.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

The [`INNODB_SYS_INDEXES`](information-schema-innodb-sys-indexes-table.html "24.4.22 The INFORMATION_SCHEMA INNODB_SYS_INDEXES Table") table has these columns:

* `INDEX_ID`

  An identifier for the index. Index identifiers are unique across all the databases in an instance.

* `NAME`

  The name of the index. Most indexes created implicitly by `InnoDB` have consistent names but the index names are not necessarily unique. Examples: `PRIMARY` for a primary key index, `GEN_CLUST_INDEX` for the index representing a primary key when one is not specified, and `ID_IND`, `FOR_IND`, and `REF_IND` for foreign key constraints.

* `TABLE_ID`

  An identifier representing the table associated with the index; the same value as `INNODB_SYS_TABLES.TABLE_ID`.

* `TYPE`

  A numeric value derived from bit-level information that identifies the index type. 0 = nonunique secondary index; 1 = automatically generated clustered index (`GEN_CLUST_INDEX`); 2 = unique nonclustered index; 3 = clustered index; 32 = full-text index; 64 = spatial index; 128 = secondary index on a [virtual generated column](glossary.html#glos_virtual_generated_column "virtual generated column").

* `N_FIELDS`

  The number of columns in the index key. For `GEN_CLUST_INDEX` indexes, this value is 0 because the index is created using an artificial value rather than a real table column.

* `PAGE_NO`

  The root page number of the index B-tree. For full-text indexes, the `PAGE_NO` column is unused and set to -1 (`FIL_NULL`) because the full-text index is laid out in several B-trees (auxiliary tables).

* `SPACE`

  An identifier for the tablespace where the index resides. 0 means the `InnoDB` [system tablespace](glossary.html#glos_system_tablespace "system tablespace"). Any other number represents a table created with a separate `.ibd` file in [file-per-table](glossary.html#glos_file_per_table "file-per-table") mode. This identifier stays the same after a [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") statement. Because all indexes for a table reside in the same tablespace as the table, this value is not necessarily unique.

* `MERGE_THRESHOLD`

  The merge threshold value for index pages. If the amount of data in an index page falls below the [`MERGE_THRESHOLD`](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages") value when a row is deleted or when a row is shortened by an update operation, `InnoDB` attempts to merge the index page with the neighboring index page. The default threshold value is 50%. For more information, see [Section 14.8.12, “Configuring the Merge Threshold for Index Pages”](index-page-merge-threshold.html "14.8.12 Configuring the Merge Threshold for Index Pages").

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID = 34\G
*************************** 1. row ***************************
       INDEX_ID: 39
           NAME: GEN_CLUST_INDEX
       TABLE_ID: 34
           TYPE: 1
       N_FIELDS: 0
        PAGE_NO: 3
          SPACE: 23
MERGE_THRESHOLD: 50
*************************** 2. row ***************************
       INDEX_ID: 40
           NAME: i1
       TABLE_ID: 34
           TYPE: 0
       N_FIELDS: 1
        PAGE_NO: 4
          SPACE: 23
MERGE_THRESHOLD: 50
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
