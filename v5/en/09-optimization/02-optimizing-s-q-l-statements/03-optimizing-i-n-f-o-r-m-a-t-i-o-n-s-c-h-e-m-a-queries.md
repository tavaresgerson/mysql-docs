### 8.2.3 Optimizing INFORMATION\_SCHEMA Queries

Applications that monitor databases may make frequent use of `INFORMATION_SCHEMA` tables. Certain types of queries for `INFORMATION_SCHEMA` tables can be optimized to execute more quickly. The goal is to minimize file operations (for example, scanning a directory or opening a table file) to collect the information that makes up these dynamic tables.

Note

Comparison behavior for database and table names in `INFORMATION_SCHEMA` queries might differ from what you expect. For details, see Section 10.8.7, “Using Collation in INFORMATION\_SCHEMA Searches”.

**1) Try to use constant lookup values for database and table names in the `WHERE` clause**

You can take advantage of this principle as follows:

* To look up databases or tables, use expressions that evaluate to a constant, such as literal values, functions that return a constant, or scalar subqueries.

* Avoid queries that use a nonconstant database name lookup value (or no lookup value) because they require a scan of the data directory to find matching database directory names.

* Within a database, avoid queries that use a nonconstant table name lookup value (or no lookup value) because they require a scan of the database directory to find matching table files.

This principle applies to the `INFORMATION_SCHEMA` tables shown in the following table, which shows the columns for which a constant lookup value enables the server to avoid a directory scan. For example, if you are selecting from `TABLES`, using a constant lookup value for `TABLE_SCHEMA` in the `WHERE` clause enables a data directory scan to be avoided.

<table summary="INFORMATION_SCHEMA tables and table columns for which a constant lookup value enables the server to avoid directory scans."><col style="width: 34%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Table</th> <th>Column to specify to avoid data directory scan</th> <th>Column to specify to avoid database directory scan</th> </tr></thead><tbody><tr> <th><a class="link" href="information-schema-columns-table.html" title="24.3.5 The INFORMATION_SCHEMA COLUMNS Table"><code>COLUMNS</code></a></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><a class="link" href="information-schema-key-column-usage-table.html" title="24.3.12 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table"><code>KEY_COLUMN_USAGE</code></a></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><a class="link" href="information-schema-partitions-table.html" title="24.3.16 The INFORMATION_SCHEMA PARTITIONS Table"><code>PARTITIONS</code></a></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><a class="link" href="information-schema-referential-constraints-table.html" title="24.3.20 The INFORMATION_SCHEMA REFERENTIAL_CONSTRAINTS Table"><code>REFERENTIAL_CONSTRAINTS</code></a></th> <td><code>CONSTRAINT_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><a class="link" href="information-schema-statistics-table.html" title="24.3.24 The INFORMATION_SCHEMA STATISTICS Table"><code>STATISTICS</code></a></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><a class="link" href="information-schema-tables-table.html" title="24.3.25 The INFORMATION_SCHEMA TABLES Table"><code>TABLES</code></a></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><a class="link" href="information-schema-table-constraints-table.html" title="24.3.27 The INFORMATION_SCHEMA TABLE_CONSTRAINTS Table"><code>TABLE_CONSTRAINTS</code></a></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr><tr> <th><a class="link" href="information-schema-triggers-table.html" title="24.3.29 The INFORMATION_SCHEMA TRIGGERS Table"><code>TRIGGERS</code></a></th> <td><code>EVENT_OBJECT_SCHEMA</code></td> <td><code>EVENT_OBJECT_TABLE</code></td> </tr><tr> <th><a class="link" href="information-schema-views-table.html" title="24.3.31 The INFORMATION_SCHEMA VIEWS Table"><code>VIEWS</code></a></th> <td><code>TABLE_SCHEMA</code></td> <td><code>TABLE_NAME</code></td> </tr></tbody></table>

The benefit of a query that is limited to a specific constant database name is that checks need be made only for the named database directory. Example:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

Use of the literal database name `test` enables the server to check only the `test` database directory, regardless of how many databases there might be. By contrast, the following query is less efficient because it requires a scan of the data directory to determine which database names match the pattern `'test%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA LIKE 'test%';
```

For a query that is limited to a specific constant table name, checks need be made only for the named table within the corresponding database directory. Example:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
```

Use of the literal table name `t1` enables the server to check only the files for the `t1` table, regardless of how many tables there might be in the `test` database. By contrast, the following query requires a scan of the `test` database directory to determine which table names match the pattern `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME LIKE 't%';
```

The following query requires a scan of the database directory to determine matching database names for the pattern `'test%'`, and for each matching database, it requires a scan of the database directory to determine matching table names for the pattern `'t%'`:

```sql
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test%' AND TABLE_NAME LIKE 't%';
```

**2) Write queries that minimize the number of table files that must be opened**

For queries that refer to certain `INFORMATION_SCHEMA` table columns, several optimizations are available that minimize the number of table files that must be opened. Example:

```sql
SELECT TABLE_NAME, ENGINE FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'test';
```

In this case, after the server has scanned the database directory to determine the names of the tables in the database, those names become available with no further file system lookups. Thus, `TABLE_NAME` requires no files to be opened. The `ENGINE` (storage engine) value can be determined by opening the table's `.frm` file, without touching other table files such as the `.MYD` or `.MYI` file.

Some values, such as `INDEX_LENGTH` for `MyISAM` tables, require opening the `.MYD` or `.MYI` file as well.

The file-opening optimization types are denoted thus:

* `SKIP_OPEN_TABLE`: Table files do not need to be opened. The information has already become available within the query by scanning the database directory.

* `OPEN_FRM_ONLY`: Only the table's `.frm` file need be opened.

* `OPEN_TRIGGER_ONLY`: Only the table's `.TRG` file need be opened.

* `OPEN_FULL_TABLE`: The unoptimized information lookup. The `.frm`, `.MYD`, and `.MYI` files must be opened.

The following list indicates how the preceding optimization types apply to `INFORMATION_SCHEMA` table columns. For tables and columns not named, none of the optimizations apply.

* `COLUMNS`: `OPEN_FRM_ONLY` applies to all columns

* `KEY_COLUMN_USAGE`: `OPEN_FULL_TABLE` applies to all columns

* `PARTITIONS`: `OPEN_FULL_TABLE` applies to all columns

* `REFERENTIAL_CONSTRAINTS`: `OPEN_FULL_TABLE` applies to all columns

* `STATISTICS`:

  <table summary="Optimization types that apply to INFORMATION_SCHEMA STATISTICS table columns."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Optimization type</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>NON_UNIQUE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>INDEX_SCHEMA</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>INDEX_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>SEQ_IN_INDEX</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>COLUMN_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>COLLATION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CARDINALITY</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>SUB_PART</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>PACKED</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>NULLABLE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>INDEX_TYPE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>COMMENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

* `TABLES`:

  <table summary="Optimization types that apply to INFORMATION_SCHEMA TABLES table columns."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Optimization type</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>SKIP_OPEN_TABLE</code></td> </tr><tr> <td><code>TABLE_TYPE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>ENGINE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>VERSION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>ROW_FORMAT</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>TABLE_ROWS</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>AVG_ROW_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DATA_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>MAX_DATA_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>INDEX_LENGTH</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DATA_FREE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>AUTO_INCREMENT</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CREATE_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>UPDATE_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CHECK_TIME</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>TABLE_COLLATION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHECKSUM</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>CREATE_OPTIONS</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_COMMENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

* `TABLE_CONSTRAINTS`: `OPEN_FULL_TABLE` applies to all columns

* `TRIGGERS`: `OPEN_TRIGGER_ONLY` applies to all columns

* `VIEWS`:

  <table summary="Optimization types that apply to INFORMATION_SCHEMA VIEWS table columns."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column</th> <th>Optimization type</th> </tr></thead><tbody><tr> <td><code>TABLE_CATALOG</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_SCHEMA</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>TABLE_NAME</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>VIEW_DEFINITION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHECK_OPTION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>IS_UPDATABLE</code></td> <td><code>OPEN_FULL_TABLE</code></td> </tr><tr> <td><code>DEFINER</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>SECURITY_TYPE</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>CHARACTER_SET_CLIENT</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr><tr> <td><code>COLLATION_CONNECTION</code></td> <td><code>OPEN_FRM_ONLY</code></td> </tr></tbody></table>

**3) Use `EXPLAIN` to determine whether the server can use `INFORMATION_SCHEMA` optimizations for a query**

This applies particularly for `INFORMATION_SCHEMA` queries that search for information from more than one database, which might take a long time and impact performance. The `Extra` value in `EXPLAIN` output indicates which, if any, of the optimizations described earlier the server can use to evaluate `INFORMATION_SCHEMA` queries. The following examples demonstrate the kinds of information you can expect to see in the `Extra` value.

```sql
mysql> EXPLAIN SELECT TABLE_NAME FROM INFORMATION_SCHEMA.VIEWS WHERE
       TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v1'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: VIEWS
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA,TABLE_NAME
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned 0 databases
```

Use of constant database and table lookup values enables the server to avoid directory scans. For references to `VIEWS.TABLE_NAME`, only the `.frm` file need be opened.

```sql
mysql> EXPLAIN SELECT TABLE_NAME, ROW_FORMAT FROM INFORMATION_SCHEMA.TABLES\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: TABLES
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Open_full_table; Scanned all databases
```

No lookup values are provided (there is no `WHERE` clause), so the server must scan the data directory and each database directory. For each table thus identified, the table name and row format are selected. `TABLE_NAME` requires no further table files to be opened (the `SKIP_OPEN_TABLE` optimization applies). `ROW_FORMAT` requires all table files to be opened (`OPEN_FULL_TABLE` applies). `EXPLAIN` reports `OPEN_FULL_TABLE` because it is more expensive than `SKIP_OPEN_TABLE`.

```sql
mysql> EXPLAIN SELECT TABLE_NAME, TABLE_TYPE FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'test'\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: TABLES
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned 1 database
```

No table name lookup value is provided, so the server must scan the `test` database directory. For the `TABLE_NAME` and `TABLE_TYPE` columns, the `SKIP_OPEN_TABLE` and `OPEN_FRM_ONLY` optimizations apply, respectively. `EXPLAIN` reports `OPEN_FRM_ONLY` because it is more expensive.

```sql
mysql> EXPLAIN SELECT B.TABLE_NAME
       FROM INFORMATION_SCHEMA.TABLES AS A, INFORMATION_SCHEMA.COLUMNS AS B
       WHERE A.TABLE_SCHEMA = 'test'
       AND A.TABLE_NAME = 't1'
       AND B.TABLE_NAME = A.TABLE_NAME\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: A
         type: ALL
possible_keys: NULL
          key: TABLE_SCHEMA,TABLE_NAME
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Skip_open_table; Scanned 0 databases
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: B
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra: Using where; Open_frm_only; Scanned all databases;
               Using join buffer
```

For the first `EXPLAIN` output row: Constant database and table lookup values enable the server to avoid directory scans for `TABLES` values. References to `TABLES.TABLE_NAME` require no further table files.

For the second `EXPLAIN` output row: All `COLUMNS` table values are `OPEN_FRM_ONLY` lookups, so `COLUMNS.TABLE_NAME` requires the `.frm` file to be opened.

```sql
mysql> EXPLAIN SELECT * FROM INFORMATION_SCHEMA.COLLATIONS\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: COLLATIONS
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: NULL
        Extra:
```

In this case, no optimizations apply because `COLLATIONS` is not one of the `INFORMATION_SCHEMA` tables for which optimizations are available.
