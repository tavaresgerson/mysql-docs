#### 13.7.2.3 CHECKSUM TABLE Statement

```sql
CHECKSUM TABLE tbl_name [, tbl_name] ... [QUICK | EXTENDED]
```

[`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") reports a [checksum](glossary.html#glos_checksum "checksum") for the contents of a table. You can use this statement to verify that the contents are the same before and after a backup, rollback, or other operation that is intended to put the data back to a known state.

This statement requires the [`SELECT`](privileges-provided.html#priv_select) privilege for the table.

This statement is not supported for views. If you run [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") against a view, the `Checksum` value is always `NULL`, and a warning is returned.

For a nonexistent table, [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") returns `NULL` and generates a warning.

During the checksum operation, the table is locked with a read lock for `InnoDB` and `MyISAM`.

##### Performance Considerations

By default, the entire table is read row by row and the checksum is calculated. For large tables, this could take a long time, thus you would only perform this operation occasionally. This row-by-row calculation is what you get with the `EXTENDED` clause, with `InnoDB` and all other storage engines other than `MyISAM`, and with `MyISAM` tables not created with the `CHECKSUM=1` clause.

For `MyISAM` tables created with the `CHECKSUM=1` clause, [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") or [`CHECKSUM TABLE ... QUICK`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") returns the “live” table checksum that can be returned very fast. If the table does not meet all these conditions, the `QUICK` method returns `NULL`. The `QUICK` method is not supported with `InnoDB` tables. See [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement") for the syntax of the `CHECKSUM` clause.

The checksum value depends on the table row format. If the row format changes, the checksum also changes. For example, the storage format for temporal types such as [`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") changed in MySQL 5.6 prior to MySQL 5.6.5, so if a 5.5 table is upgraded to MySQL 5.6, the checksum value may change.

Important

If the checksums for two tables are different, then it is almost certain that the tables are different in some way. However, because the hashing function used by [`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") is not guaranteed to be collision-free, there is a slight chance that two tables which are not identical can produce the same checksum.
