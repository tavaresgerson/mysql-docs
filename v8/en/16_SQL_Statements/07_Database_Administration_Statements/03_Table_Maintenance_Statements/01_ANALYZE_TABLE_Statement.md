#### 15.7.3.1 ANALYZE TABLE Statement

```
ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    UPDATE HISTOGRAM ON col_name [, col_name] ...
        [WITH N BUCKETS]

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    UPDATE HISTOGRAM ON col_name [USING DATA 'json_data']

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    DROP HISTOGRAM ON col_name [, col_name] ...
```

`ANALYZE TABLE` generates table statistics:

* `ANALYZE TABLE` without any `HISTOGRAM` clause performs a key distribution analysis and stores the distribution for the named table or tables. For `MyISAM` tables, `ANALYZE TABLE` for key distribution analysis is equivalent to using **myisamchk --analyze**.

* `ANALYZE TABLE` with the `UPDATE HISTOGRAM` clause generates histogram statistics for the named table columns and stores them in the data dictionary. Only one table name is permitted for this syntax. MySQL 8.0.31 and later also supports setting the histogram of a single column to a user-defined JSON value.

* `ANALYZE TABLE` with the `DROP HISTOGRAM` clause removes histogram statistics for the named table columns from the data dictionary. Only one table name is permitted for this syntax.

This statement requires `SELECT` and `INSERT` privileges for the table.

`ANALYZE TABLE` works with `InnoDB`, `NDB`, and `MyISAM` tables. It does not work with views.

If the `innodb_read_only` system variable is enabled, `ANALYZE TABLE` may fail because it cannot update statistics tables in the data dictionary, which use `InnoDB`. For `ANALYZE TABLE` operations that update the key distribution, failure may occur even if the operation updates the table itself (for example, if it is a `MyISAM` table). To obtain the updated distribution statistics, set `information_schema_stats_expiry=0`.

`ANALYZE TABLE` is supported for partitioned tables, and you can use `ALTER TABLE ... ANALYZE PARTITION` to analyze one or more partitions; for more information, see Section 15.1.9, “ALTER TABLE Statement”, and Section 26.3.4, “Maintenance of Partitions”.

During the analysis, the table is locked with a read lock for `InnoDB` and `MyISAM`.

By default, the server writes `ANALYZE TABLE` statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.

Previously, `ANALYZE TABLE` required a flush lock. This meant that, when there were long running statements or transactions still using the table when `ANALYZE TABLE` was invoked, any following statements and transactions had to wait for those operations to finish before the flush lock could be released. This issue is resolved in MySQL 8.0.24 (and later), where `ANALYZE TABLE` no longer causes subsequent operations to wait.

* ANALYZE TABLE Output
* Key Distribution Analysis
* Histogram Statistics Analysis
* Other Considerations

##### ANALYZE TABLE Output

`ANALYZE TABLE` returns a result set with the columns shown in the following table.

<table summary="Columns of the ANALYZE TABLE result set."><thead><tr> <th>Column</th> <th>Value</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>The table name</td> </tr><tr> <td><code>Op</code></td> <td><code>analyze</code> or <code>histogram</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, or <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>An informational message</td> </tr></tbody></table>

##### Key Distribution Analysis

`ANALYZE TABLE` without either `HISTOGRAM` clause performs a key distribution analysis and stores the distribution for the table or tables. Any existing histogram statistics remain unaffected.

If the table has not changed since the last key distribution analysis, the table is not analyzed again.

MySQL uses the stored key distribution to decide the order in which tables should be joined for joins on something other than a constant. In addition, key distributions can be used when deciding which indexes to use for a specific table within a query.

To check the stored key distribution cardinality, use the `SHOW INDEX` statement or the `INFORMATION_SCHEMA` `STATISTICS` table. See Section 15.7.7.22, “SHOW INDEX Statement”, and Section 28.3.34, “The INFORMATION_SCHEMA STATISTICS Table”.

For `InnoDB` tables, `ANALYZE TABLE` determines index cardinality by performing random dives on each of the index trees and updating index cardinality estimates accordingly. Because these are only estimates, repeated runs of `ANALYZE TABLE` could produce different numbers. This makes `ANALYZE TABLE` fast on `InnoDB` tables but not 100% accurate because it does not take all rows into account.

You can make the statistics collected by `ANALYZE TABLE` more precise and more stable by enabling `innodb_stats_persistent`, as explained in Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”. When `innodb_stats_persistent` is enabled, it is important to run `ANALYZE TABLE` after major changes to index column data, as statistics are not recalculated periodically (such as after a server restart).

If `innodb_stats_persistent` is enabled, you can change the number of random dives by modifying the `innodb_stats_persistent_sample_pages` system variable. If `innodb_stats_persistent` is disabled, modify `innodb_stats_transient_sample_pages` instead.

For more information about key distribution analysis in `InnoDB`, see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”, and Section 17.8.10.3, “Estimating ANALYZE TABLE Complexity for InnoDB Tables”.

MySQL uses index cardinality estimates in join optimization. If a join is not optimized in the right way, try running `ANALYZE TABLE`. In the few cases that `ANALYZE TABLE` does not produce values good enough for your particular tables, you can use `FORCE INDEX` with your queries to force the use of a particular index, or set the `max_seeks_for_key` system variable to ensure that MySQL prefers index lookups over table scans. See Section B.3.5, “Optimizer-Related Issues”.

##### Histogram Statistics Analysis

`ANALYZE TABLE` with the `HISTOGRAM` clause enables management of histogram statistics for table column values. For information about histogram statistics, see Section 10.9.6, “Optimizer Statistics”.

These histogram operations are available:

* `ANALYZE TABLE` with an `UPDATE HISTOGRAM` clause generates histogram statistics for the named table columns and stores them in the data dictionary. Only one table name is permitted for this syntax.

  The optional `WITH N BUCKETS` clause specifies the number of buckets for the histogram. The value of *`N`* must be an integer in the range from 1 to 1024. If this clause is omitted, the number of buckets is 100.

* `ANALYZE TABLE` with a `DROP HISTOGRAM` clause removes histogram statistics for the named table columns from the data dictionary. Only one table name is permitted for this syntax.

Stored histogram management statements affect only the named columns. Consider these statements:

```
ANALYZE TABLE t UPDATE HISTOGRAM ON c1, c2, c3 WITH 10 BUCKETS;
ANALYZE TABLE t UPDATE HISTOGRAM ON c1, c3 WITH 10 BUCKETS;
ANALYZE TABLE t DROP HISTOGRAM ON c2;
```

The first statement updates the histograms for columns `c1`, `c2`, and `c3`, replacing any existing histograms for those columns. The second statement updates the histograms for `c1` and `c3`, leaving the `c2` histogram unaffected. The third statement removes the histogram for `c2`, leaving those for `c1` and `c3` unaffected.

When sampling user data as part of building a histogram, not all values are read; this may lead to missing some values considered important. In such cases, it might be useful to modify the histogram, or to set your own histogram explicitly based on your own criteria, such as the complete data set. MySQL 8.0.31 adds support for `ANALYZE TABLE tbl_name UPDATE HISTOGRAM ON col_name USING DATA 'json_data'` for updating a column of the histogram table with data supplied in the same JSON format used to display `HISTOGRAM` column values from the Information Schema `COLUMN_STATISTICS` table. Only one column can be modified when updating the histogram with JSON data.

We can illustrate the use of `USING DATA` by first generating a histogram on column `c1` of table `t`, like this:

```
mysql> ANALYZE TABLE t UPDATE HISTOGRAM ON c1;
+--------+-----------+----------+-----------------------------------------------+
| Table  | Op        | Msg_type | Msg_text                                      |
+--------+-----------+----------+-----------------------------------------------+
| mydb.t | histogram | status   | Histogram statistics created for column 'c1'. |
+--------+-----------+----------+-----------------------------------------------+
```

We can see the histogram generated in the `COLUMN_STATISTICS` table:

```
mysql> TABLE information_schema.column_statistics\G
*************************** 1. row ***************************
SCHEMA_NAME: mydb
 TABLE_NAME: t
COLUMN_NAME: c1
  HISTOGRAM: {"buckets": 206, 0.0625], [456, 0.125], [608, 0.1875,
"data-type": "int", "null-values": 0.0, "collation-id": 8, "last-updated":
"2022-10-11 16:13:14.563319", "sampling-rate": 1.0, "histogram-type":
"singleton", "number-of-buckets-specified": 100}
```

Now we drop the histogram, and when we check `COLUMN_STATISTICS`, it is now empty:

```
mysql> ANALYZE TABLE t DROP HISTOGRAM ON c1;
+--------+-----------+----------+-----------------------------------------------+
| Table  | Op        | Msg_type | Msg_text                                      |
+--------+-----------+----------+-----------------------------------------------+
| mydb.t | histogram | status   | Histogram statistics removed for column 'c1'. |
+--------+-----------+----------+-----------------------------------------------+

mysql> TABLE information_schema.column_statistics\G
Empty set (0.00 sec)
```

We can restore the dropped histogram by inserting its JSON representation obtained previously from the `HISTOGRAM` column of the `COLUMN_STATISTICS` table, and when we query that table again, we can see that the histogram has been restored to its previous state:

```
mysql> ANALYZE TABLE t UPDATE HISTOGRAM ON c1
    ->     USING DATA '{"buckets": 206, 0.0625], [456, 0.125], [608, 0.1875,
    ->               "data-type": "int", "null-values": 0.0, "collation-id":
    ->               8, "last-updated": "2022-10-11 16:13:14.563319",
    ->               "sampling-rate": 1.0, "histogram-type": "singleton",
    ->               "number-of-buckets-specified": 100}';
+--------+-----------+----------+-----------------------------------------------+
| Table  | Op        | Msg_type | Msg_text                                      |
+--------+-----------+----------+-----------------------------------------------+
| mydb.t | histogram | status   | Histogram statistics created for column 'c1'. |
+--------+-----------+----------+-----------------------------------------------+

mysql> TABLE information_schema.column_statistics\G
*************************** 1. row ***************************
SCHEMA_NAME: mydb
 TABLE_NAME: t
COLUMN_NAME: c1
  HISTOGRAM: {"buckets": 206, 0.0625], [456, 0.125], [608, 0.1875,
"data-type": "int", "null-values": 0.0, "collation-id": 8, "last-updated":
"2022-10-11 16:13:14.563319", "sampling-rate": 1.0, "histogram-type":
"singleton", "number-of-buckets-specified": 100}
```

Histogram generation is not supported for encrypted tables (to avoid exposing data in the statistics) or `TEMPORARY` tables.

Histogram generation applies to columns of all data types except geometry types (spatial data) and `JSON`.

Histograms can be generated for stored and virtual generated columns.

Histograms cannot be generated for columns that are covered by single-column unique indexes.

Histogram management statements attempt to perform as much of the requested operation as possible, and report diagnostic messages for the remainder. For example, if an `UPDATE HISTOGRAM` statement names multiple columns, but some of them do not exist or have an unsupported data type, histograms are generated for the other columns, and messages are produced for the invalid columns.

Histograms are affected by these DDL statements:

* `DROP TABLE` removes histograms for columns in the dropped table.

* `DROP DATABASE` removes histograms for any table in the dropped database because the statement drops all tables in the database.

* `RENAME TABLE` does not remove histograms. Instead, it renames histograms for the renamed table to be associated with the new table name.

* `ALTER TABLE` statements that remove or modify a column remove histograms for that column.

* `ALTER TABLE ... CONVERT TO CHARACTER SET` removes histograms for character columns because they are affected by the change of character set. Histograms for noncharacter columns remain unaffected.

The `histogram_generation_max_mem_size` system variable controls the maximum amount of memory available for histogram generation. The global and session values may be set at runtime.

Changing the global `histogram_generation_max_mem_size` value requires privileges sufficient to set global system variables. Changing the session `histogram_generation_max_mem_size` value requires privileges sufficient to set restricted session system variables. See Section 7.1.9.1, “System Variable Privileges”.

If the estimated amount of data to be read into memory for histogram generation exceeds the limit defined by `histogram_generation_max_mem_size`, MySQL samples the data rather than reading all of it into memory. Sampling is evenly distributed over the entire table. MySQL uses `SYSTEM` sampling, which is a page-level sampling method.

The `sampling-rate` value in the `HISTOGRAM` column of the Information Schema `COLUMN_STATISTICS` table can be queried to determine the fraction of data that was sampled to create the histogram. The `sampling-rate` is a number between 0.0 and 1.0. A value of 1 means that all of the data was read (no sampling).

The following example demonstrates sampling. To ensure that the amount of data exceeds the `histogram_generation_max_mem_size` limit for the purpose of the example, the limit is set to a low value (2000000 bytes) prior to generating histogram statistics for the `birth_date` column of the `employees` table.

```
mysql> SET histogram_generation_max_mem_size = 2000000;

mysql> USE employees;

mysql> ANALYZE TABLE employees UPDATE HISTOGRAM ON birth_date WITH 16 BUCKETS\G
*************************** 1. row ***************************
   Table: employees.employees
      Op: histogram
Msg_type: status
Msg_text: Histogram statistics created for column 'birth_date'.

mysql> SELECT HISTOGRAM->>'$."sampling-rate"'
       FROM INFORMATION_SCHEMA.COLUMN_STATISTICS
       WHERE TABLE_NAME = "employees"
       AND COLUMN_NAME = "birth_date";
+---------------------------------+
| HISTOGRAM->>'$."sampling-rate"' |
+---------------------------------+
| 0.0491431208869665              |
+---------------------------------+
```

A `sampling-rate` value of 0.0491431208869665 means that approximately 4.9% of the data from the `birth_date` column was read into memory for generating histogram statistics.

As of MySQL 8.0.19, the `InnoDB` storage engine provides its own sampling implementation for data stored in `InnoDB` tables. The default sampling implementation used by MySQL when storage engines do not provide their own requires a full table scan, which is costly for large tables. The `InnoDB` sampling implementation improves sampling performance by avoiding full table scans.

The `sampled_pages_read` and `sampled_pages_skipped` `INNODB_METRICS` counters can be used to monitor sampling of `InnoDB` data pages. (For general `INNODB_METRICS` counter usage information, see Section 28.4.21, “The INFORMATION_SCHEMA INNODB_METRICS Table”.)

The following example demonstrates sampling counter usage, which requires enabling the counters prior to generating histogram statistics.

```
mysql> SET GLOBAL innodb_monitor_enable = 'sampled%';

mysql> USE employees;

mysql> ANALYZE TABLE employees UPDATE HISTOGRAM ON birth_date WITH 16 BUCKETS\G
*************************** 1. row ***************************
   Table: employees.employees
      Op: histogram
Msg_type: status
Msg_text: Histogram statistics created for column 'birth_date'.

mysql> USE INFORMATION_SCHEMA;

mysql> SELECT NAME, COUNT FROM INNODB_METRICS WHERE NAME LIKE 'sampled%'\G
*************************** 1. row ***************************
 NAME: sampled_pages_read
COUNT: 43
*************************** 2. row ***************************
 NAME: sampled_pages_skipped
COUNT: 843
```

This formula approximates a sampling rate based on the sampling counter data:

```
sampling rate = sampled_page_read/(sampled_pages_read + sampled_pages_skipped)
```

A sampling rate based on sampling counter data is roughly the same as the `sampling-rate` value in the `HISTOGRAM` column of the Information Schema `COLUMN_STATISTICS` table.

For information about memory allocations performed for histogram generation, monitor the Performance Schema `memory/sql/histograms` instrument. See Section 29.12.20.10, “Memory Summary Tables”.

##### Other Considerations

`ANALYZE TABLE` clears table statistics from the Information Schema `INNODB_TABLESTATS` table and sets the `STATS_INITIALIZED` column to `Uninitialized`. Statistics are collected again the next time the table is accessed.
