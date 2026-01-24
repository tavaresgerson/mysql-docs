#### 13.2.5.1 INSERT ... SELECT Statement

```sql
INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...
    [ON DUPLICATE KEY UPDATE assignment_list]

value:
    {expr | DEFAULT}

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

With [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), you can quickly insert many rows into a table from the result of a [`SELECT`](select.html "13.2.9 SELECT Statement") statement, which can select from one or many tables. For example:

```sql
INSERT INTO tbl_temp2 (fld_id)
  SELECT tbl_temp1.fld_order_id
  FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

The following conditions hold for [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements:

* Specify `IGNORE` to ignore rows that would cause duplicate-key violations.

* The target table of the [`INSERT`](insert.html "13.2.5 INSERT Statement") statement may appear in the `FROM` clause of the [`SELECT`](select.html "13.2.9 SELECT Statement") part of the query. However, you cannot insert into a table and select from the same table in a subquery.

  When selecting from and inserting into the same table, MySQL creates an internal temporary table to hold the rows from the [`SELECT`](select.html "13.2.9 SELECT Statement") and then inserts those rows into the target table. However, you cannot use `INSERT INTO t ... SELECT ... FROM t` when `t` is a `TEMPORARY` table, because `TEMPORARY` tables cannot be referred to twice in the same statement. See [Section 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL"), and [Section B.3.6.2, “TEMPORARY Table Problems”](temporary-table-problems.html "B.3.6.2 TEMPORARY Table Problems").

* `AUTO_INCREMENT` columns work as usual.
* To ensure that the binary log can be used to re-create the original tables, MySQL does not permit concurrent inserts for [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements (see [Section 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts")).

* To avoid ambiguous column reference problems when the [`SELECT`](select.html "13.2.9 SELECT Statement") and the [`INSERT`](insert.html "13.2.5 INSERT Statement") refer to the same table, provide a unique alias for each table used in the [`SELECT`](select.html "13.2.9 SELECT Statement") part, and qualify column names in that part with the appropriate alias.

You can explicitly select which partitions or subpartitions (or both) of the source or target table (or both) are to be used with a `PARTITION` clause following the name of the table. When `PARTITION` is used with the name of the source table in the [`SELECT`](select.html "13.2.9 SELECT Statement") portion of the statement, rows are selected only from the partitions or subpartitions named in its partition list. When `PARTITION` is used with the name of the target table for the [`INSERT`](insert.html "13.2.5 INSERT Statement") portion of the statement, it must be possible to insert all rows selected into the partitions or subpartitions named in the partition list following the option. Otherwise, the `INSERT ... SELECT` statement fails. For more information and examples, see [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection").

For [`INSERT ... SELECT`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statements, see [Section 13.2.5.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") for conditions under which the [`SELECT`](select.html "13.2.9 SELECT Statement") columns can be referred to in an `ON DUPLICATE KEY UPDATE` clause.

The order in which a [`SELECT`](select.html "13.2.9 SELECT Statement") statement with no `ORDER BY` clause returns rows is nondeterministic. This means that, when using replication, there is no guarantee that such a [`SELECT`](select.html "13.2.9 SELECT Statement") returns rows in the same order on the source and the replica, which can lead to inconsistencies between them. To prevent this from occurring, always write `INSERT ... SELECT` statements that are to be replicated using an `ORDER BY` clause that produces the same row order on the source and the replica. See also [Section 16.4.1.17, “Replication and LIMIT”](replication-features-limit.html "16.4.1.17 Replication and LIMIT").

Due to this issue, [`INSERT ... SELECT ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") and [`INSERT IGNORE ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements are flagged as unsafe for statement-based replication. Such statements produce a warning in the error log when using statement-based mode and are written to the binary log using the row-based format when using `MIXED` mode. (Bug #11758262, Bug #50439)

See also [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

An `INSERT ... SELECT` statement affecting partitioned tables using a storage engine such as [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") that employs table-level locks locks all partitions of the target table; however, only those partitions that are actually read from the source table are locked. (This does not occur with tables using storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") that employ row-level locking.) For more information, see [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").
