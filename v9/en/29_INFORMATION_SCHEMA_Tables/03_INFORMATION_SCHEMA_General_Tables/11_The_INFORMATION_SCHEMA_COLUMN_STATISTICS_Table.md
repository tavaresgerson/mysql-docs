### 28.3.11 The INFORMATION\_SCHEMA COLUMN\_STATISTICS Table

The [`COLUMN_STATISTICS`](information-schema-column-statistics-table.html "28.3.11 The INFORMATION_SCHEMA COLUMN_STATISTICS Table") table provides
access to histogram statistics for column values.

For information about histogram statistics, see
[Section 10.9.6, “Optimizer Statistics”](optimizer-statistics.html "10.9.6 Optimizer Statistics"), and
[Section 15.7.3.1, “ANALYZE TABLE Statement”](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement").

You can see information only for columns for which you have some
privilege.

The [`COLUMN_STATISTICS`](information-schema-column-statistics-table.html "28.3.11 The INFORMATION_SCHEMA COLUMN_STATISTICS Table") table has these
columns:

* `SCHEMA_NAME`

  The names of the schema for which the statistics apply.

* `TABLE_NAME`

  The names of the column for which the statistics apply.

* `COLUMN_NAME`

  The names of the column for which the statistics apply.

* `HISTOGRAM`

  A [`JSON`](json.html "13.5 The JSON Data Type") object describing the
  column statistics, stored as a histogram.