## 16.5 INFORMATION\_SCHEMA and Data Dictionary Integration

With the introduction of the data dictionary, the following `INFORMATION_SCHEMA` tables are implemented as views on data dictionary tables:

* `CHARACTER_SETS`
* `CHECK_CONSTRAINTS`
* `COLLATIONS`
* `COLLATION_CHARACTER_SET_APPLICABILITY`
* `COLUMNS`
* `COLUMN_STATISTICS`
* `EVENTS`
* `FILES`
* `INNODB_COLUMNS`
* `INNODB_DATAFILES`
* `INNODB_FIELDS`
* `INNODB_FOREIGN`
* `INNODB_FOREIGN_COLS`
* `INNODB_INDEXES`
* `INNODB_TABLES`
* `INNODB_TABLESPACES`
* `INNODB_TABLESPACES_BRIEF`
* `INNODB_TABLESTATS`
* `KEY_COLUMN_USAGE`
* `KEYWORDS`
* `PARAMETERS`
* `PARTITIONS`
* `REFERENTIAL_CONSTRAINTS`
* `RESOURCE_GROUPS`
* `ROUTINES`
* `SCHEMATA`
* `STATISTICS`
* `ST_GEOMETRY_COLUMNS`
* `ST_SPATIAL_REFERENCE_SYSTEMS`
* `TABLES`
* `TABLE_CONSTRAINTS`
* `TRIGGERS`
* `VIEWS`
* `VIEW_ROUTINE_USAGE`
* `VIEW_TABLE_USAGE`

Queries on those tables are now more efficient because they obtain information from data dictionary tables rather than by other, slower means. In particular, for each `INFORMATION_SCHEMA` table that is a view on data dictionary tables:

* The server no longer must create a temporary table for each query of the `INFORMATION_SCHEMA` table.

* When the underlying data dictionary tables store values previously obtained by directory scans (for example, to enumerate database names or table names within databases) or file-opening operations (for example, to read information from `.frm` files), `INFORMATION_SCHEMA` queries for those values now use table lookups instead. (Additionally, even for a non-view `INFORMATION_SCHEMA` table, values such as database and table names are retrieved by lookups from the data dictionary and do not require directory or file scans.)

* Indexes on the underlying data dictionary tables permit the optimizer to construct efficient query execution plans, something not true for the previous implementation that processed the `INFORMATION_SCHEMA` table using a temporary table per query.

The preceding improvements also apply to `SHOW` statements that display information corresponding to the `INFORMATION_SCHEMA` tables that are views on data dictionary tables. For example, `SHOW DATABASES` displays the same information as the `SCHEMATA` table.

In addition to the introduction of views on data dictionary tables, table statistics contained in the `STATISTICS` and `TABLES` tables is now cached to improve `INFORMATION_SCHEMA` query performance. The `information_schema_stats_expiry` system variable defines the period of time before cached table statistics expire. The default is 86400 seconds (24 hours). If there are no cached statistics or statistics have expired, statistics are retrieved from storage engine when querying table statistics columns. To update cached values at any time for a given table, use `ANALYZE TABLE`

`information_schema_stats_expiry` can be set to `0` to have `INFORMATION_SCHEMA` queries retrieve the latest statistics directly from the storage engine, which is not as fast as retrieving cached statistics.

For more information, see Section 10.2.3, “Optimizing INFORMATION\_SCHEMA Queries”.

`INFORMATION_SCHEMA` tables in MySQL 9.5 are closely tied to the data dictionary, resulting in several usage differences. See Section 16.7, “Data Dictionary Usage Differences”.
