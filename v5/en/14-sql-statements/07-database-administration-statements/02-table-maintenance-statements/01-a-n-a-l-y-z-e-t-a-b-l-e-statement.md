#### 13.7.2.1 ANALYZE TABLE Statement

```sql
ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") performs a key distribution analysis and stores the distribution for the named table or tables. For `MyISAM` tables, this statement is equivalent to using [**myisamchk --analyze**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

This statement requires [`SELECT`](privileges-provided.html#priv_select) and [`INSERT`](privileges-provided.html#priv_insert) privileges for the table.

[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") works with `InnoDB`, `NDB`, and `MyISAM` tables. It does not work with views.

[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") is supported for partitioned tables, and you can use `ALTER TABLE ... ANALYZE PARTITION` to analyze one or more partitions; for more information, see [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement"), and [Section 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

During the analysis, the table is locked with a read lock for `InnoDB` and `MyISAM`.

[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") removes the table from the table definition cache, which requires a flush lock. If there are long running statements or transactions still using the table, subsequent statements and transactions must wait for those operations to finish before the flush lock is released. Because [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") itself typically finishes quickly, it may not be apparent that delayed transactions or statements involving the same table are due to the remaining flush lock.

By default, the server writes [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.

* [ANALYZE TABLE Output](analyze-table.html#analyze-table-output "ANALYZE TABLE Output")
* [Key Distribution Analysis](analyze-table.html#analyze-table-key-distribution-analysis "Key Distribution Analysis")
* [Other Considerations](analyze-table.html#analyze-table-other-considerations "Other Considerations")

##### ANALYZE TABLE Output

[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") returns a result set with the columns shown in the following table.

<table summary="Columns of the ANALYZE TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Value</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>The table name</td> </tr><tr> <td><code>Op</code></td> <td>Always <code>analyze</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>, <code>error</code>, <code>info</code>, <code>note</code>, or <code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>An informational message</td> </tr></tbody></table>

##### Key Distribution Analysis

If the table has not changed since the last key distribution analysis, the table is not analyzed again.

MySQL uses the stored key distribution to decide the table join order for joins on something other than a constant. In addition, key distributions can be used when deciding which indexes to use for a specific table within a query.

To check the stored key distribution cardinality, use the [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") statement or the `INFORMATION_SCHEMA` [`STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table") table. See [Section 13.7.5.22, “SHOW INDEX Statement”](show-index.html "13.7.5.22 SHOW INDEX Statement"), and [Section 24.3.24, “The INFORMATION\_SCHEMA STATISTICS Table”](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table").

For `InnoDB` tables, [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") determines index cardinality by performing random dives on each of the index trees and updating index cardinality estimates accordingly. Because these are only estimates, repeated runs of [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") could produce different numbers. This makes [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") fast on `InnoDB` tables but not 100% accurate because it does not take all rows into account.

You can make the [statistics](glossary.html#glos_statistics "statistics") collected by [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") more precise and more stable by enabling [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent), as explained in [Section 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters"). When [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent) is enabled, it is important to run [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") after major changes to index column data, as statistics are not recalculated periodically (such as after a server restart).

If [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent) is enabled, you can change the number of random dives by modifying the [`innodb_stats_persistent_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_persistent_sample_pages) system variable. If [`innodb_stats_persistent`](innodb-parameters.html#sysvar_innodb_stats_persistent) is disabled, modify [`innodb_stats_transient_sample_pages`](innodb-parameters.html#sysvar_innodb_stats_transient_sample_pages) instead.

For more information about key distribution analysis in `InnoDB`, see [Section 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”](innodb-persistent-stats.html "14.8.11.1 Configuring Persistent Optimizer Statistics Parameters"), and [Section 14.8.11.3, “Estimating ANALYZE TABLE Complexity for InnoDB Tables”](innodb-analyze-table-complexity.html "14.8.11.3 Estimating ANALYZE TABLE Complexity for InnoDB Tables").

MySQL uses index cardinality estimates in join optimization. If a join is not optimized in the right way, try running [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"). In the few cases that [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") does not produce values good enough for your particular tables, you can use `FORCE INDEX` with your queries to force the use of a particular index, or set the [`max_seeks_for_key`](server-system-variables.html#sysvar_max_seeks_for_key) system variable to ensure that MySQL prefers index lookups over table scans. See [Section B.3.5, “Optimizer-Related Issues”](optimizer-issues.html "B.3.5 Optimizer-Related Issues").

##### Other Considerations

`ANALYZE TABLE` clears table statistics from the Information Schema [`INNODB_SYS_TABLESTATS`](information-schema-innodb-sys-tablestats-table.html "24.4.25 The INFORMATION_SCHEMA INNODB_SYS_TABLESTATS View") table and sets the `STATS_INITIALIZED` column to `Uninitialized`. Statistics are collected again the next time the table is accessed.
