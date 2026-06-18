#### 17.8.10.1 Configuring Persistent Optimizer Statistics Parameters

The persistent optimizer statistics feature improves
[plan stability](glossary.html#glos_plan_stability "plan stability") by
storing statistics to disk and making them persistent across
server restarts so that the
[optimizer](glossary.html#glos_optimizer "optimizer") is more likely
to make consistent choices each time for a given query.

Optimizer statistics are persisted to disk when
[`innodb_stats_persistent=ON`](innodb-parameters.html#sysvar_innodb_stats_persistent) or
when individual tables are defined with
[`STATS_PERSISTENT=1`](create-table.html "15.1.20 CREATE TABLE Statement").
[`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent) is
enabled by default.

Formerly, optimizer statistics were cleared when restarting the
server and after some other types of operations, and recomputed
on the next table access. Consequently, different estimates
could be produced when recalculating statistics leading to
different choices in query execution plans and variation in
query performance.

Persistent statistics are stored in the
`mysql.innodb_table_stats` and
`mysql.innodb_index_stats` tables. See
[Section 17.8.10.1.5, “InnoDB Persistent Statistics Tables”](innodb-persistent-stats.html#innodb-persistent-stats-tables "17.8.10.1.5 InnoDB Persistent Statistics Tables").

If you prefer not to persist optimizer statistics to disk, see
[Section 17.8.10.2, “Configuring Non-Persistent Optimizer Statistics Parameters”](innodb-statistics-estimation.html "17.8.10.2 Configuring Non-Persistent Optimizer Statistics Parameters")

##### 17.8.10.1.1 Configuring Automatic Statistics Calculation for Persistent Optimizer Statistics

The [`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc)
variable, which is enabled by default, controls whether
statistics are calculated automatically when a table undergoes
changes to more than 10% of its rows. You can also configure
automatic statistics recalculation for individual tables by
specifying the `STATS_AUTO_RECALC` clause
when creating or altering a table.

Because of the asynchronous nature of automatic statistics
recalculation, which occurs in the background, statistics may
not be recalculated instantly after running a DML operation
that affects more than 10% of a table, even when
[`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc) is
enabled. Statistics recalculation can be delayed by few
seconds in some cases. If up-to-date statistics are required
immediately, run [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement")
to initiate a synchronous (foreground) recalculation of
statistics.

If [`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc)
is disabled, you can ensure the accuracy of optimizer
statistics by executing the [`ANALYZE
TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") statement after making substantial changes to
indexed columns. You might also consider adding
[`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") to setup scripts
that you run after loading data, and running
[`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") on a schedule at
times of low activity.

When an index is added to an existing table, or when a column
is added or dropped, index statistics are calculated and added
to the `innodb_index_stats` table regardless
of the value of
[`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc).

##### 17.8.10.1.2 Configuring Optimizer Statistics Parameters for Individual Tables

[`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent),
[`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc), and
[`innodb_stats_persistent_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_persistent_sample_pages)
are global variables. To override these system-wide settings
and configure optimizer statistics parameters for individual
tables, you can define `STATS_PERSISTENT`,
`STATS_AUTO_RECALC`, and
`STATS_SAMPLE_PAGES` clauses in
[`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") statements.

* `STATS_PERSISTENT` specifies whether to
  enable
  [persistent
  statistics](glossary.html#glos_persistent_statistics "persistent statistics") for an `InnoDB` table.
  The value `DEFAULT` causes the persistent
  statistics setting for the table to be determined by the
  [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent)
  setting. A value of `1` enables
  persistent statistics for the table, while a value of
  `0` disables the feature. After enabling
  persistent statistics for an individual table, use
  [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") to calculate
  statistics after table data is loaded.

* `STATS_AUTO_RECALC` specifies whether to
  automatically recalculate
  [persistent
  statistics](glossary.html#glos_persistent_statistics "persistent statistics"). The value `DEFAULT`
  causes the persistent statistics setting for the table to
  be determined by the
  [`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc)
  setting. A value of `1` causes statistics
  to be recalculated when 10% of table data has changed. A
  value `0` prevents automatic
  recalculation for the table. When using a value of 0, use
  [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") to
  recalculate statistics after making substantial changes to
  the table.

* `STATS_SAMPLE_PAGES` specifies the number
  of index pages to sample when cardinality and other
  statistics are calculated for an indexed column, by an
  [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") operation,
  for example.

All three clauses are specified in the following
[`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") example:

```
CREATE TABLE `t1` (
`id` int(8) NOT NULL auto_increment,
`data` varchar(255),
`date` datetime,
PRIMARY KEY  (`id`),
INDEX `DATE_IX` (`date`)
) ENGINE=InnoDB,
  STATS_PERSISTENT=1,
  STATS_AUTO_RECALC=1,
  STATS_SAMPLE_PAGES=25;
```

##### 17.8.10.1.3 Configuring the Number of Sampled Pages for InnoDB Optimizer Statistics

The optimizer uses estimated
[statistics](glossary.html#glos_statistics "statistics") about key
distributions to choose the indexes for an execution plan,
based on the relative
[selectivity](glossary.html#glos_selectivity "selectivity") of the
index. Operations such as [`ANALYZE
TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") cause `InnoDB` to sample
random pages from each index on a table to estimate the
[cardinality](glossary.html#glos_cardinality "cardinality") of the
index. This sampling technique is known as a
[random dive](glossary.html#glos_random_dive "random dive").

The
[`innodb_stats_persistent_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_persistent_sample_pages)
controls the number of sampled pages. You can adjust the
setting at runtime to manage the quality of statistics
estimates used by the optimizer. The default value is 20.
Consider modifying the setting when encountering the following
issues:

1. *Statistics are not accurate enough and the
   optimizer chooses suboptimal plans*, as shown in
   [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement") output. You can
   check the accuracy of statistics by comparing the actual
   cardinality of an index (determined by running
   [`SELECT
   DISTINCT`](select.html "15.2.13 SELECT Statement") on the index columns) with the
   estimates in the
   `mysql.innodb_index_stats` table.

   If it is determined that statistics are not accurate
   enough, the value of
   [`innodb_stats_persistent_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_persistent_sample_pages)
   should be increased until the statistics estimates are
   sufficiently accurate. Increasing
   [`innodb_stats_persistent_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_persistent_sample_pages)
   too much, however, could cause
   [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") to run
   slowly.

2. *[`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") is
   too slow*. In this case
   [`innodb_stats_persistent_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_persistent_sample_pages)
   should be decreased until [`ANALYZE
   TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") execution time is acceptable. Decreasing
   the value too much, however, could lead to the first
   problem of inaccurate statistics and suboptimal query
   execution plans.

   If a balance cannot be achieved between accurate
   statistics and [`ANALYZE
   TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") execution time, consider decreasing the
   number of indexed columns in the table or limiting the
   number of partitions to reduce
   [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") complexity.
   The number of columns in the table's primary key is also
   important to consider, as primary key columns are appended
   to each nonunique index.

   For related information, see
   [Section 17.8.10.3, “Estimating ANALYZE TABLE Complexity for InnoDB Tables”](innodb-analyze-table-complexity.html "17.8.10.3 Estimating ANALYZE TABLE Complexity for InnoDB Tables").

##### 17.8.10.1.4 Including Delete-marked Records in Persistent Statistics Calculations

By default, `InnoDB` reads uncommitted data
when calculating statistics. In the case of an uncommitted
transaction that deletes rows from a table, delete-marked
records are excluded when calculating row estimates and index
statistics, which can lead to non-optimal execution plans for
other transactions that are operating on the table
concurrently using a transaction isolation level other than
[`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted). To avoid
this scenario,
[`innodb_stats_include_delete_marked`](innodb-parameters.html#sysvar_innodb_stats_include_delete_marked)
can be enabled to ensure that delete-marked records are
included when calculating persistent optimizer statistics.

When
[`innodb_stats_include_delete_marked`](innodb-parameters.html#sysvar_innodb_stats_include_delete_marked)
is enabled, [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement")
considers delete-marked records when recalculating statistics.

[`innodb_stats_include_delete_marked`](innodb-parameters.html#sysvar_innodb_stats_include_delete_marked)
is a global setting that affects all `InnoDB`
tables, and it is only applicable to persistent optimizer
statistics.

##### 17.8.10.1.5 InnoDB Persistent Statistics Tables

The persistent statistics feature relies on the internally
managed tables in the `mysql` database, named
`innodb_table_stats` and
`innodb_index_stats`. These tables are set up
automatically in all install, upgrade, and build-from-source
procedures.

**Table 17.6 Columns of innodb\_table\_stats**

<table summary="Columns of the mysql.innodb_table_stats table."><col style="width: 30%"/><col style="width: 70%"/><thead><tr>
<th>Column name</th>
<th>Description</th>
</tr></thead><tbody><tr>
<td><code class="literal">database_name</code></td>
<td>Database name</td>
</tr><tr>
<td><code class="literal">table_name</code></td>
<td>Table name, partition name, or subpartition name</td>
</tr><tr>
<td><code class="literal">last_update</code></td>
<td>A timestamp indicating the last time that <code class="literal">InnoDB</code>
                updated this row</td>
</tr><tr>
<td><code class="literal">n_rows</code></td>
<td>The number of rows in the table</td>
</tr><tr>
<td><code class="literal">clustered_index_size</code></td>
<td>The size of the primary index, in pages</td>
</tr><tr>
<td><code class="literal">sum_of_other_index_sizes</code></td>
<td>The total size of other (non-primary) indexes, in pages</td>
</tr></tbody></table>

**Table 17.7 Columns of innodb\_index\_stats**

<table summary="Columns of the mysql.innodb_index_stats table."><col style="width: 30%"/><col style="width: 70%"/><thead><tr>
<th>Column name</th>
<th>Description</th>
</tr></thead><tbody><tr>
<td><code class="literal">database_name</code></td>
<td>Database name</td>
</tr><tr>
<td><code class="literal">table_name</code></td>
<td>Table name, partition name, or subpartition name</td>
</tr><tr>
<td><code class="literal">index_name</code></td>
<td>Index name</td>
</tr><tr>
<td><code class="literal">last_update</code></td>
<td>A timestamp indicating the last time the row was updated</td>
</tr><tr>
<td><code class="literal">stat_name</code></td>
<td>The name of the statistic, whose value is reported in the
                <code class="literal">stat_value</code> column</td>
</tr><tr>
<td><code class="literal">stat_value</code></td>
<td>The value of the statistic that is named in <code class="literal">stat_name</code>
                column</td>
</tr><tr>
<td><code class="literal">sample_size</code></td>
<td>The number of pages sampled for the estimate provided in the
                <code class="literal">stat_value</code> column</td>
</tr><tr>
<td><code class="literal">stat_description</code></td>
<td>Description of the statistic that is named in the
                <code class="literal">stat_name</code> column</td>
</tr></tbody></table>

The `innodb_table_stats` and
`innodb_index_stats` tables include a
`last_update` column that shows when index
statistics were last updated:

```
mysql> SELECT * FROM innodb_table_stats \G
*************************** 1. row ***************************
           database_name: sakila
              table_name: actor
             last_update: 2014-05-28 16:16:44
                  n_rows: 200
    clustered_index_size: 1
sum_of_other_index_sizes: 1
...
```

```
mysql> SELECT * FROM innodb_index_stats \G
*************************** 1. row ***************************
   database_name: sakila
      table_name: actor
      index_name: PRIMARY
     last_update: 2014-05-28 16:16:44
       stat_name: n_diff_pfx01
      stat_value: 200
     sample_size: 1
     ...
```

The `innodb_table_stats` and
`innodb_index_stats` tables can be updated
manually, which makes it possible to force a specific query
optimization plan or test alternative plans without modifying
the database. If you manually update statistics, use the
`FLUSH TABLE
tbl_name` statement to
load the updated statistics.

Persistent statistics are considered local information,
because they relate to the server instance. The
`innodb_table_stats` and
`innodb_index_stats` tables are therefore not
replicated when automatic statistics recalculation takes
place. If you run [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement")
to initiate a synchronous recalculation of statistics, the
statement is replicated (unless you suppressed logging for
it), and recalculation takes place on replicas.

##### 17.8.10.1.6 InnoDB Persistent Statistics Tables Example

The `innodb_table_stats` table contains one
row for each table. The following example demonstrates the
type of data collected.

Table `t1` contains a primary index (columns
`a`, `b`) secondary index
(columns `c`, `d`), and
unique index (columns `e`,`f`):

```
CREATE TABLE t1 (
a INT, b INT, c INT, d INT, e INT, f INT,
PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

After inserting five rows of sample data, table
`t1` appears as follows:

```
mysql> SELECT * FROM t1;
+---+---+------+------+------+------+
| a | b | c    | d    | e    | f    |
+---+---+------+------+------+------+
| 1 | 1 |   10 |   11 |  100 |  101 |
| 1 | 2 |   10 |   11 |  200 |  102 |
| 1 | 3 |   10 |   11 |  100 |  103 |
| 1 | 4 |   10 |   12 |  200 |  104 |
| 1 | 5 |   10 |   12 |  100 |  105 |
+---+---+------+------+------+------+
```

To immediately update statistics, run
[`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") (if
[`innodb_stats_auto_recalc`](innodb-parameters.html#sysvar_innodb_stats_auto_recalc) is
enabled, statistics are updated automatically within a few
seconds assuming that the 10% threshold for changed table rows
is reached):

```
mysql> ANALYZE TABLE t1;
+---------+---------+----------+----------+
| Table   | Op      | Msg_type | Msg_text |
+---------+---------+----------+----------+
| test.t1 | analyze | status   | OK       |
+---------+---------+----------+----------+
```

Table statistics for table `t1` show the last
time `InnoDB` updated the table statistics
(`2014-03-14 14:36:34`), the number of rows
in the table (`5`), the clustered index size
(`1` page), and the combined size of the
other indexes (`2` pages).

```
mysql> SELECT * FROM mysql.innodb_table_stats WHERE table_name like 't1'\G
*************************** 1. row ***************************
           database_name: test
              table_name: t1
             last_update: 2014-03-14 14:36:34
                  n_rows: 5
    clustered_index_size: 1
sum_of_other_index_sizes: 2
```

The `innodb_index_stats` table contains
multiple rows for each index. Each row in the
`innodb_index_stats` table provides data
related to a particular index statistic which is named in the
`stat_name` column and described in the
`stat_description` column. For example:

```
mysql> SELECT index_name, stat_name, stat_value, stat_description
       FROM mysql.innodb_index_stats WHERE table_name like 't1';
+------------+--------------+------------+-----------------------------------+
| index_name | stat_name    | stat_value | stat_description                  |
+------------+--------------+------------+-----------------------------------+
| PRIMARY    | n_diff_pfx01 |          1 | a                                 |
| PRIMARY    | n_diff_pfx02 |          5 | a,b                               |
| PRIMARY    | n_leaf_pages |          1 | Number of leaf pages in the index |
| PRIMARY    | size         |          1 | Number of pages in the index      |
| i1         | n_diff_pfx01 |          1 | c                                 |
| i1         | n_diff_pfx02 |          2 | c,d                               |
| i1         | n_diff_pfx03 |          2 | c,d,a                             |
| i1         | n_diff_pfx04 |          5 | c,d,a,b                           |
| i1         | n_leaf_pages |          1 | Number of leaf pages in the index |
| i1         | size         |          1 | Number of pages in the index      |
| i2uniq     | n_diff_pfx01 |          2 | e                                 |
| i2uniq     | n_diff_pfx02 |          5 | e,f                               |
| i2uniq     | n_leaf_pages |          1 | Number of leaf pages in the index |
| i2uniq     | size         |          1 | Number of pages in the index      |
+------------+--------------+------------+-----------------------------------+
```

The `stat_name` column shows the following
types of statistics:

* `size`: Where
  `stat_name`=`size`, the
  `stat_value` column displays the total
  number of pages in the index.

* `n_leaf_pages`: Where
  `stat_name`=`n_leaf_pages`,
  the `stat_value` column displays the
  number of leaf pages in the index.

* `n_diff_pfxNN`:
  Where
  `stat_name`=`n_diff_pfx01`,
  the `stat_value` column displays the
  number of distinct values in the first column of the
  index. Where
  `stat_name`=`n_diff_pfx02`,
  the `stat_value` column displays the
  number of distinct values in the first two columns of the
  index, and so on. Where
  `stat_name`=`n_diff_pfxNN`,
  the `stat_description` column shows a
  comma separated list of the index columns that are
  counted.

To further illustrate the
`n_diff_pfxNN`
statistic, which provides cardinality data, consider once
again the `t1` table example that was
introduced previously. As shown below, the
`t1` table is created with a primary index
(columns `a`, `b`), a
secondary index (columns `c`,
`d`), and a unique index (columns
`e`, `f`):

```
CREATE TABLE t1 (
  a INT, b INT, c INT, d INT, e INT, f INT,
  PRIMARY KEY (a, b), KEY i1 (c, d), UNIQUE KEY i2uniq (e, f)
) ENGINE=INNODB;
```

After inserting five rows of sample data, table
`t1` appears as follows:

```
mysql> SELECT * FROM t1;
+---+---+------+------+------+------+
| a | b | c    | d    | e    | f    |
+---+---+------+------+------+------+
| 1 | 1 |   10 |   11 |  100 |  101 |
| 1 | 2 |   10 |   11 |  200 |  102 |
| 1 | 3 |   10 |   11 |  100 |  103 |
| 1 | 4 |   10 |   12 |  200 |  104 |
| 1 | 5 |   10 |   12 |  100 |  105 |
+---+---+------+------+------+------+
```

When you query the `index_name`,
`stat_name`, `stat_value`,
and `stat_description`, where
`stat_name LIKE 'n_diff%'`, the following
result set is returned:

```
mysql> SELECT index_name, stat_name, stat_value, stat_description
       FROM mysql.innodb_index_stats
       WHERE table_name like 't1' AND stat_name LIKE 'n_diff%';
+------------+--------------+------------+------------------+
| index_name | stat_name    | stat_value | stat_description |
+------------+--------------+------------+------------------+
| PRIMARY    | n_diff_pfx01 |          1 | a                |
| PRIMARY    | n_diff_pfx02 |          5 | a,b              |
| i1         | n_diff_pfx01 |          1 | c                |
| i1         | n_diff_pfx02 |          2 | c,d              |
| i1         | n_diff_pfx03 |          2 | c,d,a            |
| i1         | n_diff_pfx04 |          5 | c,d,a,b          |
| i2uniq     | n_diff_pfx01 |          2 | e                |
| i2uniq     | n_diff_pfx02 |          5 | e,f              |
+------------+--------------+------------+------------------+
```

For the `PRIMARY` index, there are two
`n_diff%` rows. The number of rows is equal
to the number of columns in the index.

Note

For nonunique indexes, `InnoDB` appends the
columns of the primary key.

* Where
  `index_name`=`PRIMARY`
  and
  `stat_name`=`n_diff_pfx01`,
  the `stat_value` is `1`,
  which indicates that there is a single distinct value in
  the first column of the index (column
  `a`). The number of distinct values in
  column `a` is confirmed by viewing the
  data in column `a` in table
  `t1`, in which there is a single distinct
  value (`1`). The counted column
  (`a`) is shown in the
  `stat_description` column of the result
  set.

* Where
  `index_name`=`PRIMARY`
  and
  `stat_name`=`n_diff_pfx02`,
  the `stat_value` is `5`,
  which indicates that there are five distinct values in the
  two columns of the index (`a,b`). The
  number of distinct values in columns `a`
  and `b` is confirmed by viewing the data
  in columns `a` and `b`
  in table `t1`, in which there are five
  distinct values: (`1,1`),
  (`1,2`), (`1,3`),
  (`1,4`) and (`1,5`). The
  counted columns (`a,b`) are shown in the
  `stat_description` column of the result
  set.

For the secondary index (`i1`), there are
four `n_diff%` rows. Only two columns are
defined for the secondary index (`c,d`) but
there are four `n_diff%` rows for the
secondary index because `InnoDB` suffixes all
nonunique indexes with the primary key. As a result, there are
four `n_diff%` rows instead of two to account
for the both the secondary index columns
(`c,d`) and the primary key columns
(`a,b`).

* Where `index_name`=`i1`
  and
  `stat_name`=`n_diff_pfx01`,
  the `stat_value` is `1`,
  which indicates that there is a single distinct value in
  the first column of the index (column
  `c`). The number of distinct values in
  column `c` is confirmed by viewing the
  data in column `c` in table
  `t1`, in which there is a single distinct
  value: (`10`). The counted column
  (`c`) is shown in the
  `stat_description` column of the result
  set.

* Where `index_name`=`i1`
  and
  `stat_name`=`n_diff_pfx02`,
  the `stat_value` is `2`,
  which indicates that there are two distinct values in the
  first two columns of the index (`c,d`).
  The number of distinct values in columns
  `c` an `d` is confirmed
  by viewing the data in columns `c` and
  `d` in table `t1`, in
  which there are two distinct values:
  (`10,11`) and (`10,12`).
  The counted columns (`c,d`) are shown in
  the `stat_description` column of the
  result set.

* Where `index_name`=`i1`
  and
  `stat_name`=`n_diff_pfx03`,
  the `stat_value` is `2`,
  which indicates that there are two distinct values in the
  first three columns of the index
  (`c,d,a`). The number of distinct values
  in columns `c`, `d`, and
  `a` is confirmed by viewing the data in
  column `c`, `d`, and
  `a` in table `t1`, in
  which there are two distinct values:
  (`10,11,1`) and
  (`10,12,1`). The counted columns
  (`c,d,a`) are shown in the
  `stat_description` column of the result
  set.

* Where `index_name`=`i1`
  and
  `stat_name`=`n_diff_pfx04`,
  the `stat_value` is `5`,
  which indicates that there are five distinct values in the
  four columns of the index (`c,d,a,b`).
  The number of distinct values in columns
  `c`, `d`,
  `a` and `b` is confirmed
  by viewing the data in columns `c`,
  `d`, `a`, and
  `b` in table `t1`, in
  which there are five distinct values:
  (`10,11,1,1`),
  (`10,11,1,2`),
  (`10,11,1,3`),
  (`10,12,1,4`), and
  (`10,12,1,5`). The counted columns
  (`c,d,a,b`) are shown in the
  `stat_description` column of the result
  set.

For the unique index (`i2uniq`), there are
two `n_diff%` rows.

* Where
  `index_name`=`i2uniq`
  and
  `stat_name`=`n_diff_pfx01`,
  the `stat_value` is `2`,
  which indicates that there are two distinct values in the
  first column of the index (column `e`).
  The number of distinct values in column
  `e` is confirmed by viewing the data in
  column `e` in table
  `t1`, in which there are two distinct
  values: (`100`) and
  (`200`). The counted column
  (`e`) is shown in the
  `stat_description` column of the result
  set.

* Where
  `index_name`=`i2uniq`
  and
  `stat_name`=`n_diff_pfx02`,
  the `stat_value` is `5`,
  which indicates that there are five distinct values in the
  two columns of the index (`e,f`). The
  number of distinct values in columns `e`
  and `f` is confirmed by viewing the data
  in columns `e` and `f`
  in table `t1`, in which there are five
  distinct values: (`100,101`),
  (`200,102`),
  (`100,103`),
  (`200,104`), and
  (`100,105`). The counted columns
  (`e,f`) are shown in the
  `stat_description` column of the result
  set.

##### 17.8.10.1.7 Retrieving Index Size Using the innodb\_index\_stats Table

You can retrieve the index size for tables, partitions, or
subpartitions can using the
`innodb_index_stats` table. In the following
example, index sizes are retrieved for table
`t1`. For a definition of table
`t1` and corresponding index statistics, see
[Section 17.8.10.1.6, “InnoDB Persistent Statistics Tables Example”](innodb-persistent-stats.html#innodb-persistent-stats-tables-example "17.8.10.1.6 InnoDB Persistent Statistics Tables Example").

```
mysql> SELECT SUM(stat_value) pages, index_name,
       SUM(stat_value)*@@innodb_page_size size
       FROM mysql.innodb_index_stats WHERE table_name='t1'
       AND stat_name = 'size' GROUP BY index_name;
+-------+------------+-------+
| pages | index_name | size  |
+-------+------------+-------+
|     1 | PRIMARY    | 16384 |
|     1 | i1         | 16384 |
|     1 | i2uniq     | 16384 |
+-------+------------+-------+
```

For partitions or subpartitions, you can use the same query
with a modified `WHERE` clause to retrieve
index sizes. For example, the following query retrieves index
sizes for partitions of table `t1`:

```
mysql> SELECT SUM(stat_value) pages, index_name,
       SUM(stat_value)*@@innodb_page_size size
       FROM mysql.innodb_index_stats WHERE table_name like 't1#P%'
       AND stat_name = 'size' GROUP BY index_name;
```