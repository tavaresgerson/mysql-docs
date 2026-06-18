### 8.4.4 Internal Temporary Table Use in MySQL

In some cases, the server creates internal temporary tables
while processing statements. Users have no direct control over
when this occurs.

The server creates temporary tables under conditions such as
these:

* Evaluation of [`UNION`](union.html "13.2.9.3 UNION Clause")
  statements, with some exceptions described later.

* Evaluation of some views, such those that use the
  `TEMPTABLE` algorithm,
  [`UNION`](union.html "13.2.9.3 UNION Clause"), or aggregation.

* Evaluation of derived tables (see
  [Section 13.2.10.8, “Derived Tables”](derived-tables.html "13.2.10.8 Derived Tables")).

* Tables created for subquery or semijoin materialization (see
  [Section 8.2.2, “Optimizing Subqueries, Derived Tables, and View References”](subquery-optimization.html "8.2.2 Optimizing Subqueries, Derived Tables, and View References")).

* Evaluation of statements that contain an `ORDER
  BY` clause and a different `GROUP
  BY` clause, or for which the `ORDER
  BY` or `GROUP BY` contains columns
  from tables other than the first table in the join queue.

* Evaluation of `DISTINCT` combined with
  `ORDER BY` may require a temporary table.

* For queries that use the `SQL_SMALL_RESULT`
  modifier, MySQL uses an in-memory temporary table, unless
  the query also contains elements (described later) that
  require on-disk storage.

* To evaluate
  [`INSERT ...
  SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements that select from and insert into
  the same table, MySQL creates an internal temporary table to
  hold the rows from the
  [`SELECT`](select.html "13.2.9 SELECT Statement"), then inserts those
  rows into the target table. See
  [Section 13.2.5.1, “INSERT ... SELECT Statement”](insert-select.html "13.2.5.1 INSERT ... SELECT Statement").

* Evaluation of multiple-table
  [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements.

* Evaluation of [`GROUP_CONCAT()`](aggregate-functions.html#function_group-concat)
  or [`COUNT(DISTINCT)`](aggregate-functions.html#function_count)
  expressions.

To determine whether a statement requires a temporary table, use
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") and check the
`Extra` column to see whether it says
`Using temporary` (see
[Section 8.8.1, “Optimizing Queries with EXPLAIN”](using-explain.html "8.8.1 Optimizing Queries with EXPLAIN")). `EXPLAIN`
does not necessarily say `Using temporary` for
derived or materialized temporary tables.

Some query conditions prevent the use of an in-memory temporary
table, in which case the server uses an on-disk table instead:

* Presence of a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or
  [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column in the table.
  This includes user-defined variables having a string value
  because they are treated as
  [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or
  [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns, depending on
  whether their value is a binary or nonbinary string,
  respectively.

* Presence of any string column with a maximum length larger
  than 512 (bytes for binary strings, characters for nonbinary
  strings) in the [`SELECT`](select.html "13.2.9 SELECT Statement") list,
  if [`UNION`](union.html "13.2.9.3 UNION Clause") or
  [`UNION ALL`](union.html "13.2.9.3 UNION Clause")
  is used.

* The [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") and
  [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") statements use
  `BLOB` as the type for some columns, thus
  the temporary table used for the results is an on-disk
  table.

The server does not use a temporary table for
[`UNION`](union.html "13.2.9.3 UNION Clause") statements that meet
certain qualifications. Instead, it retains from temporary table
creation only the data structures necessary to perform result
column typecasting. The table is not fully instantiated and no
rows are written to or read from it; rows are sent directly to
the client. The result is reduced memory and disk requirements,
and smaller delay before the first row is sent to the client
because the server need not wait until the last query block is
executed. [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") and optimizer
trace output reflects this execution strategy: The
`UNION RESULT` query block is not present
because that block corresponds to the part that reads from the
temporary table.

These conditions qualify a `UNION` for
evaluation without a temporary table:

* The union is `UNION ALL`, not
  `UNION` or `UNION
  DISTINCT`.

* There is no global `ORDER BY` clause.
* The union is not the top-level query block of an
  `{INSERT | REPLACE} ... SELECT ...`
  statement.

#### Internal Temporary Table Storage Engine

An internal temporary table can be held in memory and
processed by the `MEMORY` storage engine, or
stored on disk by the `InnoDB` or
`MyISAM` storage engine.

If an internal temporary table is created as an in-memory
table but becomes too large, MySQL automatically converts it
to an on-disk table. The maximum size for in-memory temporary
tables is defined by the
[`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) or
[`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) value,
whichever is smaller. This differs from
`MEMORY` tables explicitly created with
[`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). For such tables,
only the [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size)
variable determines how large a table can grow, and there is
no conversion to on-disk format.

The
[`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine)
variable defines the storage engine the server uses to manage
on-disk internal temporary tables. Permitted values are
`INNODB` (the default) and
`MYISAM`.

Note

When using
[`internal_tmp_disk_storage_engine=INNODB`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine),
queries that generate on-disk internal temporary tables that
exceed
[`InnoDB` row
or column limits](innodb-limits.html "14.23 InnoDB Limits") return Row size too
large or Too many columns
errors. The workaround is to set
[`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine)
to `MYISAM`.

When an internal temporary table is created in memory or on
disk, the server increments the
[`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables) value.
When an internal temporary table is created on disk, the
server increments the
[`Created_tmp_disk_tables`](server-status-variables.html#statvar_Created_tmp_disk_tables)
value. If too many internal temporary tables are created on
disk, consider increasing the
[`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) and
[`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) settings.

#### Internal Temporary Table Storage Format

In-memory temporary tables are managed by the
`MEMORY` storage engine, which uses
fixed-length row format. `VARCHAR` and
`VARBINARY` column values are padded to the
maximum column length, in effect storing them as
`CHAR` and `BINARY` columns.

On-disk temporary tables are managed by the
`InnoDB` or `MyISAM` storage
engine (depending on the
[`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine)
setting). Both engines store temporary tables using
dynamic-width row format. Columns take only as much storage as
needed, which reduces disk I/O, space requirements, and
processing time compared to on-disk tables that use
fixed-length rows.

For statements that initially create an internal temporary
table in memory, then convert it to an on-disk table, better
performance might be achieved by skipping the conversion step
and creating the table on disk to begin with. The
[`big_tables`](server-system-variables.html#sysvar_big_tables) variable can be
used to force disk storage of internal temporary tables.