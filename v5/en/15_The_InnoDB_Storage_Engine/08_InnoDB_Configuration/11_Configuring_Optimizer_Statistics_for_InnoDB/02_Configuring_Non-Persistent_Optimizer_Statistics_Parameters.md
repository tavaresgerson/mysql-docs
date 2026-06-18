#### 14.8.11.2 Configuring Non-Persistent Optimizer Statistics Parameters

This section describes how to configure non-persistent optimizer
statistics. Optimizer statistics are not persisted to disk when
[`innodb_stats_persistent=OFF`](innodb-parameters.html#sysvar_innodb_stats_persistent) or
when individual tables are created or altered with
[`STATS_PERSISTENT=0`](create-table.html "13.1.18 CREATE TABLE Statement").
Instead, statistics are stored in memory, and are lost when the
server is shut down. Statistics are also updated periodically by
certain operations and under certain conditions.

As of MySQL 5.6.6, optimizer statistics are persisted to disk by
default, enabled by the
[`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent)
configuration option. For information about persistent optimizer
statistics, see [Section 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters").

##### Optimizer Statistics Updates

Non-persistent optimizer statistics are updated when:

* Running [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").
* Running [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement"),
  [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement"), or querying the
  Information Schema [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") or
  [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") tables with the
  [`innodb_stats_on_metadata`](innodb-parameters.html#sysvar_innodb_stats_on_metadata)
  option enabled.

  The default setting for
  [`innodb_stats_on_metadata`](innodb-parameters.html#sysvar_innodb_stats_on_metadata)
  was changed to `OFF` when persistent
  optimizer statistics were enabled by default in MySQL 5.6.6.
  Enabling
  [`innodb_stats_on_metadata`](innodb-parameters.html#sysvar_innodb_stats_on_metadata)
  may reduce access speed for schemas that have a large number
  of tables or indexes, and reduce stability of execution
  plans for queries that involve `InnoDB`
  tables.
  [`innodb_stats_on_metadata`](innodb-parameters.html#sysvar_innodb_stats_on_metadata) is
  configured globally using a
  [`SET`](set.html "11.3.6 The SET Type") statement.

  ```sql
  SET GLOBAL innodb_stats_on_metadata=ON
  ```

  Note

  [`innodb_stats_on_metadata`](innodb-parameters.html#sysvar_innodb_stats_on_metadata)
  only applies when optimizer
  [statistics](glossary.html#glos_statistics "statistics") are
  configured to be non-persistent (when
  [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent)
  is disabled).

* Starting a [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client with the
  [`--auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash) option enabled,
  which is the default. The
  [`auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash) option causes all
  `InnoDB` tables to be opened, and the open
  table operations cause statistics to be recalculated.

  To improve the start up time of the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")
  client and to updating statistics, you can turn off
  [`auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash) using the
  [`--disable-auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash)
  option. The [`auto-rehash`](mysql-command-options.html#option_mysql_auto-rehash)
  feature enables automatic name completion of database,
  table, and column names for interactive users.

* A table is first opened.
* `InnoDB` detects that 1 / 16 of table has
  been modified since the last time statistics were updated.

##### Configuring the Number of Sampled Pages

The MySQL query optimizer uses estimated
[statistics](glossary.html#glos_statistics "statistics") about key
distributions to choose the indexes for an execution plan, based
on the relative
[selectivity](glossary.html#glos_selectivity "selectivity") of the
index. When `InnoDB` updates optimizer
statistics, it samples random pages from each index on a table
to estimate the
[cardinality](glossary.html#glos_cardinality "cardinality") of the
index. (This technique is known as
[random dives](glossary.html#glos_random_dive "random dive").)

To give you control over the quality of the statistics estimate
(and thus better information for the query optimizer), you can
change the number of sampled pages using the parameter
[`innodb_stats_transient_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_transient_sample_pages).
The default number of sampled pages is 8, which could be
insufficient to produce an accurate estimate, leading to poor
index choices by the query optimizer. This technique is
especially important for large tables and tables used in
[joins](glossary.html#glos_join "join"). Unnecessary
[full table scans](glossary.html#glos_full_table_scan "full table scan") for
such tables can be a substantial performance issue. See
[Section 8.2.1.20, “Avoiding Full Table Scans”](table-scan-avoidance.html "8.2.1.20 Avoiding Full Table Scans") for tips on tuning such
queries.
[`innodb_stats_transient_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_transient_sample_pages)
is a global parameter that can be set at runtime.

The value of
[`innodb_stats_transient_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_transient_sample_pages)
affects the index sampling for all `InnoDB`
tables and indexes when
[`innodb_stats_persistent=0`](innodb-parameters.html#sysvar_innodb_stats_persistent). Be
aware of the following potentially significant impacts when you
change the index sample size:

* Small values like 1 or 2 can result in inaccurate
  estimates of cardinality.

* Increasing the
  [`innodb_stats_transient_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_transient_sample_pages)
  value might require more disk reads. Values much larger
  than 8 (say, 100), can cause a significant slowdown in the
  time it takes to open a table or execute `SHOW
  TABLE STATUS`.

* The optimizer might choose very different query plans
  based on different estimates of index selectivity.

Whatever value of
[`innodb_stats_transient_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_transient_sample_pages)
works best for a system, set the option and leave it at that
value. Choose a value that results in reasonably accurate
estimates for all tables in your database without requiring
excessive I/O. Because the statistics are automatically
recalculated at various times other than on execution of
[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), it does not make
sense to increase the index sample size, run
[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), then decrease
sample size again.

Smaller tables generally require fewer index samples than larger
tables. If your database has many large tables, consider using a
higher value for
[`innodb_stats_transient_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_transient_sample_pages)
than if you have mostly smaller tables.