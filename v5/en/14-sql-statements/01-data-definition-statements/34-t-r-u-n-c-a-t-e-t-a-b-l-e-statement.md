### 13.1.34 TRUNCATE TABLE Statement

```sql
TRUNCATE [TABLE] tbl_name
```

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") empties a table completely. It requires the [`DROP`](privileges-provided.html#priv_drop) privilege.

Logically, [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is similar to a [`DELETE`](delete.html "13.2.2 DELETE Statement") statement that deletes all rows, or a sequence of [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") and [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements. To achieve high performance, it bypasses the DML method of deleting data. Thus, it cannot be rolled back, it does not cause `ON DELETE` triggers to fire, and it cannot be performed for `InnoDB` tables with parent-child foreign key relationships.

Although [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is similar to [`DELETE`](delete.html "13.2.2 DELETE Statement"), it is classified as a DDL statement rather than a DML statement. It differs from [`DELETE`](delete.html "13.2.2 DELETE Statement") in the following ways:

* Truncate operations drop and re-create the table, which is much faster than deleting rows one by one, particularly for large tables.

* Truncate operations cause an implicit commit, and so cannot be rolled back. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

* Truncation operations cannot be performed if the session holds an active table lock.

* [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") fails for an `InnoDB` table or [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table if there are any `FOREIGN KEY` constraints from other tables that reference the table. Foreign key constraints between columns of the same table are permitted.

* Truncation operations do not return a meaningful value for the number of deleted rows. The usual result is “0 rows affected,” which should be interpreted as “no information.”

* As long as the table format file `tbl_name.frm` is valid, the table can be re-created as an empty table with [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), even if the data or index files have become corrupted.

* Any `AUTO_INCREMENT` value is reset to its start value. This is true even for `MyISAM` and `InnoDB`, which normally do not reuse sequence values.

* When used with partitioned tables, [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") preserves the partitioning; that is, the data and index files are dropped and re-created, while the partition definitions (`.par`) file is unaffected.

* The [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") statement does not invoke `ON DELETE` triggers.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is treated for purposes of binary logging and replication as DDL rather than DML, and is always logged as a statement.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") for a table closes all handlers for the table that were opened with [`HANDLER OPEN`](handler.html "13.2.4 HANDLER Statement").

On a system with a large `InnoDB` buffer pool and [`innodb_adaptive_hash_index`](innodb-parameters.html#sysvar_innodb_adaptive_hash_index) enabled, `TRUNCATE TABLE` operations may cause a temporary drop in system performance due to an LRU scan that occurs when removing an `InnoDB` table's adaptive hash index entries. The problem was addressed for [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") in MySQL 5.5.23 (Bug
#13704145, Bug #64284) but remains a known issue for `TRUNCATE TABLE` (Bug #68184).

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") can be used with Performance Schema summary tables, but the effect is to reset the summary columns to 0 or `NULL`, not to remove rows. See [Section 25.12.15, “Performance Schema Summary Tables”](performance-schema-summary-tables.html "25.12.15 Performance Schema Summary Tables").
