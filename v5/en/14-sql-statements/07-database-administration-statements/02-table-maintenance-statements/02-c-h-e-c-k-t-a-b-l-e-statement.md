#### 13.7.2.2 CHECK TABLE Statement

```sql
CHECK TABLE tbl_name [, tbl_name] ... [option] ...

option: {
    FOR UPGRADE
  | QUICK
  | FAST
  | MEDIUM
  | EXTENDED
  | CHANGED
}
```

[`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") checks a table or tables for errors. For `MyISAM` tables, the key statistics are updated as well. [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") can also check views for problems, such as tables that are referenced in the view definition that no longer exist.

To check a table, you must have some privilege for it.

[`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") works for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), [`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine"), and [`CSV`](csv-storage-engine.html "15.4 The CSV Storage Engine") tables.

Before running [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") on `InnoDB` tables, see [CHECK TABLE Usage Notes for InnoDB Tables](check-table.html#check-table-innodb "CHECK TABLE Usage Notes for InnoDB Tables").

[`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") is supported for partitioned tables, and you can use `ALTER TABLE ... CHECK PARTITION` to check one or more partitions; for more information, see [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement"), and [Section 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

[`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") ignores virtual generated columns that are not indexed.

* [CHECK TABLE Output](check-table.html#check-table-output "CHECK TABLE Output")
* [Checking Version Compatibility](check-table.html#check-table-version-compatibility "Checking Version Compatibility")
* [Checking Data Consistency](check-table.html#check-table-data-consistency "Checking Data Consistency")
* [CHECK TABLE Usage Notes for InnoDB Tables](check-table.html#check-table-innodb "CHECK TABLE Usage Notes for InnoDB Tables")
* [CHECK TABLE Usage Notes for MyISAM Tables](check-table.html#check-table-myisam "CHECK TABLE Usage Notes for MyISAM Tables")

##### CHECK TABLE Output

[`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") returns a result set with the columns shown in the following table.

<table summary="Columns of the CHECK TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">Table</code></td> <td>The table name</td> </tr><tr> <td><code class="literal">Op</code></td> <td>Always <code class="literal">check</code></td> </tr><tr> <td><code class="literal">Msg_type</code></td> <td><code class="literal">status</code>, <code class="literal">error</code>, <code class="literal">info</code>, <code class="literal">note</code>, or <code class="literal">warning</code></td> </tr><tr> <td><code class="literal">Msg_text</code></td> <td>An informational message</td> </tr></tbody></table>

The statement might produce many rows of information for each checked table. The last row has a `Msg_type` value of `status` and the `Msg_text` normally should be `OK`. For a `MyISAM` table, if you don't get `OK` or `Table is already up to date`, you should normally run a repair of the table. See [Section 7.6, “MyISAM Table Maintenance and Crash Recovery”](myisam-table-maintenance.html "7.6 MyISAM Table Maintenance and Crash Recovery"). `Table is already up to date` means that the storage engine for the table indicated that there was no need to check the table.

##### Checking Version Compatibility

The `FOR UPGRADE` option checks whether the named tables are compatible with the current version of MySQL. With `FOR UPGRADE`, the server checks each table to determine whether there have been any incompatible changes in any of the table's data types or indexes since the table was created. If not, the check succeeds. Otherwise, if there is a possible incompatibility, the server runs a full check on the table (which might take some time). If the full check succeeds, the server marks the table's `.frm` file with the current MySQL version number. Marking the `.frm` file ensures that further checks for the table with the same version of the server are fast.

Incompatibilities might occur because the storage format for a data type has changed or because its sort order has changed. Our aim is to avoid these changes, but occasionally they are necessary to correct problems that would be worse than an incompatibility between releases.

`FOR UPGRADE` discovers these incompatibilities:

* The indexing order for end-space in [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns for `InnoDB` and `MyISAM` tables changed between MySQL 4.1 and 5.0.

* The storage method of the new [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") data type changed between MySQL 5.0.3 and 5.0.5.

* If your table was created by a different version of the MySQL server than the one you are currently running, `FOR UPGRADE` indicates that the table has an `.frm` file with an incompatible version. In this case, the result set returned by [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") contains a line with a `Msg_type` value of `error` and a `Msg_text` value of `` Table upgrade required. Please do "REPAIR TABLE `tbl_name`" to fix it! ``

* Changes are sometimes made to character sets or collations that require table indexes to be rebuilt. For details about such changes, see [Section 2.10.3, “Changes in MySQL 5.7”](upgrading-from-previous-series.html "2.10.3 Changes in MySQL 5.7"). For information about rebuilding tables, see [Section 2.10.12, “Rebuilding or Repairing Tables or Indexes”](rebuilding-tables.html "2.10.12 Rebuilding or Repairing Tables or Indexes").

* The [`YEAR(2)`](year.html "11.2.4 The YEAR Type") data type is deprecated and support for it is removed in MySQL 5.7.5. For tables containing [`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns, [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") recommends [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"), which converts 2-digit [`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns to 4-digit [`YEAR`](year.html "11.2.4 The YEAR Type") columns.

* As of MySQL 5.7.2, trigger creation time is maintained. If run against a table that has triggers, [`CHECK TABLE ... FOR UPGRADE`](check-table.html "13.7.2.2 CHECK TABLE Statement") displays this warning for each trigger created before MySQL 5.7.2:

  ```sql
  Trigger db_name.tbl_name.trigger_name does not have CREATED attribute.
  ```

  The warning is informational only. No change is made to the trigger.

* As of MySQL 5.7.7, a table is reported as needing a rebuild if it contains old temporal columns in pre-5.6.4 format ([`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns without support for fractional seconds precision) and the [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) system variable is disabled. This helps the MySQL upgrade procedure detect and upgrade tables containing old temporal columns. If [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) is enabled, `FOR UPGRADE` ignores the old temporal columns present in the table; consequently, the upgrade procedure does not upgrade them.

  To check for tables that contain such temporal columns and need a rebuild, disable [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade) before executing [`CHECK TABLE ... FOR UPGRADE`](check-table.html "13.7.2.2 CHECK TABLE Statement").

* Warnings are issued for tables that use nonnative partitioning because nonnative partitioning is deprecated in MySQL 5.7 and removed in MySQL 8.0. See [Chapter 22, *Partitioning*](partitioning.html "Chapter 22 Partitioning").

##### Checking Data Consistency

The following table shows the other check options that can be given. These options are passed to the storage engine, which may use or ignore them.

<table summary="Other CHECK TABLE options."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Type</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">QUICK</code></td> <td>Do not scan the rows to check for incorrect links. Applies to <code class="literal">InnoDB</code> and <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">FAST</code></td> <td>Check only tables that have not been closed properly. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">CHANGED</code></td> <td>Check only tables that have been changed since the last check or that have not been closed properly. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">MEDIUM</code></td> <td>Scan rows to verify that deleted links are valid. This also calculates a key checksum for the rows and verifies this with a calculated checksum for the keys. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">EXTENDED</code></td> <td>Do a full key lookup for all keys for each row. This ensures that the table is 100% consistent, but takes a long time. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr></tbody></table>

If none of the options `QUICK`, `MEDIUM`, or `EXTENDED` are specified, the default check type for dynamic-format `MyISAM` tables is `MEDIUM`. This has the same result as running [**myisamchk --medium-check *`tbl_name`***](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") on the table. The default check type also is `MEDIUM` for static-format `MyISAM` tables, unless `CHANGED` or `FAST` is specified. In that case, the default is `QUICK`. The row scan is skipped for `CHANGED` and `FAST` because the rows are very seldom corrupted.

You can combine check options, as in the following example that does a quick check on the table to determine whether it was closed properly:

```sql
CHECK TABLE test_table FAST QUICK;
```

Note

If [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") finds no problems with a table that is marked as “corrupted” or “not closed properly”, [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") may remove the mark.

If a table is corrupted, the problem is most likely in the indexes and not in the data part. All of the preceding check types check the indexes thoroughly and should thus find most errors.

To check a table that you assume is okay, use no check options or the `QUICK` option. The latter should be used when you are in a hurry and can take the very small risk that `QUICK` does not find an error in the data file. (In most cases, under normal usage, MySQL should find any error in the data file. If this happens, the table is marked as “corrupted” and cannot be used until it is repaired.)

`FAST` and `CHANGED` are mostly intended to be used from a script (for example, to be executed from **cron**) to check tables periodically. In most cases, `FAST` is to be preferred over `CHANGED`. (The only case when it is not preferred is when you suspect that you have found a bug in the `MyISAM` code.)

`EXTENDED` is to be used only after you have run a normal check but still get errors from a table when MySQL tries to update a row or find a row by key. This is very unlikely if a normal check has succeeded.

Use of [`CHECK TABLE ... EXTENDED`](check-table.html "13.7.2.2 CHECK TABLE Statement") might influence execution plans generated by the query optimizer.

Some problems reported by [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") cannot be corrected automatically:

* `Found row where the auto_increment column has the value 0`.

  This means that you have a row in the table where the `AUTO_INCREMENT` index column contains the value 0. (It is possible to create a row where the `AUTO_INCREMENT` column is 0 by explicitly setting the column to 0 with an [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement.)

  This is not an error in itself, but could cause trouble if you decide to dump the table and restore it or do an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") on the table. In this case, the `AUTO_INCREMENT` column changes value according to the rules of `AUTO_INCREMENT` columns, which could cause problems such as a duplicate-key error.

  To get rid of the warning, execute an [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement to set the column to some value other than 0.

##### CHECK TABLE Usage Notes for InnoDB Tables

The following notes apply to [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables:

* If [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") encounters a corrupt page, the server exits to prevent error propagation (Bug #10132). If the corruption occurs in a secondary index but table data is readable, running [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") can still cause a server exit.

* If [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") encounters a corrupted `DB_TRX_ID` or `DB_ROLL_PTR` field in a clustered index, [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") can cause `InnoDB` to access an invalid undo log record, resulting in an [MVCC](glossary.html#glos_mvcc "MVCC")-related server exit.

* If [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") encounters errors in `InnoDB` tables or indexes, it reports an error, and usually marks the index and sometimes marks the table as corrupted, preventing further use of the index or table. Such errors include an incorrect number of entries in a secondary index or incorrect links.

* If [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") finds an incorrect number of entries in a secondary index, it reports an error but does not cause a server exit or prevent access to the file.

* [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") surveys the index page structure, then surveys each key entry. It does not validate the key pointer to a clustered record or follow the path for [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") pointers.

* When an `InnoDB` table is stored in its own [`.ibd` file](glossary.html#glos_ibd_file ".ibd file"), the first 3 [pages](glossary.html#glos_page "page") of the `.ibd` file contain header information rather than table or index data. The [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") statement does not detect inconsistencies that affect only the header data. To verify the entire contents of an `InnoDB` `.ibd` file, use the [**innochecksum**](innochecksum.html "4.6.1 innochecksum — Offline InnoDB File Checksum Utility") command.

* When running [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") on large `InnoDB` tables, other threads may be blocked during [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") execution. To avoid timeouts, the semaphore wait threshold (600 seconds) is extended by 2 hours (7200 seconds) for [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") operations. If `InnoDB` detects semaphore waits of 240 seconds or more, it starts printing `InnoDB` monitor output to the error log. If a lock request extends beyond the semaphore wait threshold, `InnoDB` aborts the process. To avoid the possibility of a semaphore wait timeout entirely, run [`CHECK TABLE QUICK`](check-table.html "13.7.2.2 CHECK TABLE Statement") instead of [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement").

* [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") functionality for `InnoDB` `SPATIAL` indexes includes an R-tree validity check and a check to ensure that the R-tree row count matches the clustered index.

* [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") supports secondary indexes on virtual generated columns, which are supported by `InnoDB`.

##### CHECK TABLE Usage Notes for MyISAM Tables

The following notes apply to [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables:

* [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") updates key statistics for `MyISAM` tables.

* If [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") output does not return `OK` or `Table is already up to date`, you should normally run a repair of the table. See [Section 7.6, “MyISAM Table Maintenance and Crash Recovery”](myisam-table-maintenance.html "7.6 MyISAM Table Maintenance and Crash Recovery").

* If none of the [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") options `QUICK`, `MEDIUM`, or `EXTENDED` are specified, the default check type for dynamic-format `MyISAM` tables is `MEDIUM`. This has the same result as running [**myisamchk --medium-check *`tbl_name`***](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") on the table. The default check type also is `MEDIUM` for static-format `MyISAM` tables, unless `CHANGED` or `FAST` is specified. In that case, the default is `QUICK`. The row scan is skipped for `CHANGED` and `FAST` because the rows are very seldom corrupted.
