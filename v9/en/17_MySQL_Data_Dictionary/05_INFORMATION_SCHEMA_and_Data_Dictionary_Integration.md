## 16.5 INFORMATION\_SCHEMA and Data Dictionary Integration

With the introduction of the data dictionary, the following
[`INFORMATION_SCHEMA`](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables") tables are
implemented as views on data dictionary tables:

* [`CHARACTER_SETS`](information-schema-character-sets-table.html "28.3.4 The INFORMATION_SCHEMA CHARACTER_SETS Table")
* [`CHECK_CONSTRAINTS`](information-schema-check-constraints-table.html "28.3.5 The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table")
* [`COLLATIONS`](information-schema-collations-table.html "28.3.6 The INFORMATION_SCHEMA COLLATIONS Table")
* [`COLLATION_CHARACTER_SET_APPLICABILITY`](information-schema-collation-character-set-applicability-table.html "28.3.7 The INFORMATION_SCHEMA COLLATION_CHARACTER_SET_APPLICABILITY Table")
* [`COLUMNS`](information-schema-columns-table.html "28.3.8 The INFORMATION_SCHEMA COLUMNS Table")
* [`COLUMN_STATISTICS`](information-schema-column-statistics-table.html "28.3.11 The INFORMATION_SCHEMA COLUMN_STATISTICS Table")
* [`EVENTS`](information-schema-events-table.html "28.3.14 The INFORMATION_SCHEMA EVENTS Table")
* [`FILES`](information-schema-files-table.html "28.3.15 The INFORMATION_SCHEMA FILES Table")
* [`INNODB_COLUMNS`](information-schema-innodb-columns-table.html "28.4.9 The INFORMATION_SCHEMA INNODB_COLUMNS Table")
* [`INNODB_DATAFILES`](information-schema-innodb-datafiles-table.html "28.4.10 The INFORMATION_SCHEMA INNODB_DATAFILES Table")
* [`INNODB_FIELDS`](information-schema-innodb-fields-table.html "28.4.11 The INFORMATION_SCHEMA INNODB_FIELDS Table")
* [`INNODB_FOREIGN`](information-schema-innodb-foreign-table.html "28.4.12 The INFORMATION_SCHEMA INNODB_FOREIGN Table")
* [`INNODB_FOREIGN_COLS`](information-schema-innodb-foreign-cols-table.html "28.4.13 The INFORMATION_SCHEMA INNODB_FOREIGN_COLS Table")
* [`INNODB_INDEXES`](information-schema-innodb-indexes-table.html "28.4.20 The INFORMATION_SCHEMA INNODB_INDEXES Table")
* [`INNODB_TABLES`](information-schema-innodb-tables-table.html "28.4.23 The INFORMATION_SCHEMA INNODB_TABLES Table")
* [`INNODB_TABLESPACES`](information-schema-innodb-tablespaces-table.html "28.4.24 The INFORMATION_SCHEMA INNODB_TABLESPACES Table")
* [`INNODB_TABLESPACES_BRIEF`](information-schema-innodb-tablespaces-brief-table.html "28.4.25 The INFORMATION_SCHEMA INNODB_TABLESPACES_BRIEF Table")
* [`INNODB_TABLESTATS`](information-schema-innodb-tablestats-table.html "28.4.26 The INFORMATION_SCHEMA INNODB_TABLESTATS View")
* [`KEY_COLUMN_USAGE`](information-schema-key-column-usage-table.html "28.3.16 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table")
* `KEYWORDS`
* [`PARAMETERS`](information-schema-parameters-table.html "28.3.25 The INFORMATION_SCHEMA PARAMETERS Table")
* [`PARTITIONS`](information-schema-partitions-table.html "28.3.26 The INFORMATION_SCHEMA PARTITIONS Table")
* [`REFERENTIAL_CONSTRAINTS`](information-schema-referential-constraints-table.html "28.3.30 The INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS Table")
* [`RESOURCE_GROUPS`](information-schema-resource-groups-table.html "28.3.31 The INFORMATION_SCHEMA RESOURCE_GROUPS Table")
* [`ROUTINES`](information-schema-routines-table.html "28.3.36 The INFORMATION_SCHEMA ROUTINES Table")
* [`SCHEMATA`](information-schema-schemata-table.html "28.3.37 The INFORMATION_SCHEMA SCHEMATA Table")
* [`STATISTICS`](information-schema-statistics-table.html "28.3.40 The INFORMATION_SCHEMA STATISTICS Table")
* [`ST_GEOMETRY_COLUMNS`](information-schema-st-geometry-columns-table.html "28.3.41 The INFORMATION_SCHEMA ST_GEOMETRY_COLUMNS Table")
* [`ST_SPATIAL_REFERENCE_SYSTEMS`](information-schema-st-spatial-reference-systems-table.html "28.3.42 The INFORMATION_SCHEMA ST_SPATIAL_REFERENCE_SYSTEMS Table")
* [`TABLES`](information-schema-tables-table.html "28.3.44 The INFORMATION_SCHEMA TABLES Table")
* [`TABLE_CONSTRAINTS`](information-schema-table-constraints-table.html "28.3.47 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table")
* [`TRIGGERS`](information-schema-triggers-table.html "28.3.50 The INFORMATION_SCHEMA TRIGGERS Table")
* [`VIEWS`](information-schema-views-table.html "28.3.53 The INFORMATION_SCHEMA VIEWS Table")
* [`VIEW_ROUTINE_USAGE`](information-schema-view-routine-usage-table.html "28.3.54 The INFORMATION_SCHEMA VIEW_ROUTINE_USAGE Table")
* [`VIEW_TABLE_USAGE`](information-schema-view-table-usage-table.html "28.3.55 The INFORMATION_SCHEMA VIEW_TABLE_USAGE Table")

Queries on those tables are now more efficient because they obtain
information from data dictionary tables rather than by other,
slower means. In particular, for each
`INFORMATION_SCHEMA` table that is a view on data
dictionary tables:

* The server no longer must create a temporary table for each
  query of the `INFORMATION_SCHEMA` table.

* When the underlying data dictionary tables store values
  previously obtained by directory scans (for example, to
  enumerate database names or table names within databases) or
  file-opening operations (for example, to read information from
  `.frm` files),
  `INFORMATION_SCHEMA` queries for those values
  now use table lookups instead. (Additionally, even for a
  non-view `INFORMATION_SCHEMA` table, values
  such as database and table names are retrieved by lookups from
  the data dictionary and do not require directory or file
  scans.)

* Indexes on the underlying data dictionary tables permit the
  optimizer to construct efficient query execution plans,
  something not true for the previous implementation that
  processed the `INFORMATION_SCHEMA` table
  using a temporary table per query.

The preceding improvements also apply to
[`SHOW`](show.html "15.7.7 SHOW Statements") statements that display
information corresponding to the
`INFORMATION_SCHEMA` tables that are views on
data dictionary tables. For example, [`SHOW
DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") displays the same information as the
[`SCHEMATA`](information-schema-schemata-table.html "28.3.37 The INFORMATION_SCHEMA SCHEMATA Table") table.

In addition to the introduction of views on data dictionary
tables, table statistics contained in the
[`STATISTICS`](information-schema-statistics-table.html "28.3.40 The INFORMATION_SCHEMA STATISTICS Table") and
[`TABLES`](information-schema-tables-table.html "28.3.44 The INFORMATION_SCHEMA TABLES Table") tables is now cached to
improve [`INFORMATION_SCHEMA`](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables") query
performance. The
[`information_schema_stats_expiry`](server-system-variables.html#sysvar_information_schema_stats_expiry)
system variable defines the period of time before cached table
statistics expire. The default is 86400 seconds (24 hours). If
there are no cached statistics or statistics have expired,
statistics are retrieved from storage engine when querying table
statistics columns. To update cached values at any time for a
given table, use [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement")

[`information_schema_stats_expiry`](server-system-variables.html#sysvar_information_schema_stats_expiry)
can be set to `0` to have
[`INFORMATION_SCHEMA`](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables") queries retrieve
the latest statistics directly from the storage engine, which is
not as fast as retrieving cached statistics.

For more information, see
[Section 10.2.3, “Optimizing INFORMATION\_SCHEMA Queries”](information-schema-optimization.html "10.2.3 Optimizing INFORMATION_SCHEMA Queries").

`INFORMATION_SCHEMA` tables in MySQL
9.5 are closely tied to the data dictionary,
resulting in several usage differences. See
[Section 16.7, “Data Dictionary Usage Differences”](data-dictionary-usage-differences.html "16.7 Data Dictionary Usage Differences").