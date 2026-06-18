#### 8.2.1.20 Avoiding Full Table Scans

The output from [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") shows
[`ALL`](explain-output.html#jointype_all) in the
`type` column when MySQL uses a
[full table scan](glossary.html#glos_full_table_scan "full table scan") to
resolve a query. This usually happens under the following
conditions:

* The table is so small that it is faster to perform a table
  scan than to bother with a key lookup. This is common for
  tables with fewer than 10 rows and a short row length.

* There are no usable restrictions in the
  `ON` or `WHERE` clause
  for indexed columns.

* You are comparing indexed columns with constant values and
  MySQL has calculated (based on the index tree) that the
  constants cover too large a part of the table and that a
  table scan would be faster. See
  [Section 8.2.1.1, “WHERE Clause Optimization”](where-optimization.html "8.2.1.1 WHERE Clause Optimization").

* You are using a key with low cardinality (many rows match
  the key value) through another column. In this case, MySQL
  assumes that by using the key it is likely to perform many
  key lookups and that a table scan would be faster.

For small tables, a table scan often is appropriate and the
performance impact is negligible. For large tables, try the
following techniques to avoid having the optimizer incorrectly
choose a table scan:

* Use `ANALYZE TABLE
  tbl_name` to update
  the key distributions for the scanned table. See
  [Section 13.7.2.1, “ANALYZE TABLE Statement”](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").

* Use `FORCE INDEX` for the scanned table
  to tell MySQL that table scans are very expensive compared
  to using the given index:

  ```sql
  SELECT * FROM t1, t2 FORCE INDEX (index_for_column)
    WHERE t1.col_name=t2.col_name;
  ```

  See [Section 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints").

* Start [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") with the
  [`--max-seeks-for-key=1000`](server-system-variables.html#sysvar_max_seeks_for_key)
  option or use `SET
  max_seeks_for_key=1000` to tell the optimizer to
  assume that no key scan causes more than 1,000 key seeks.
  See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").