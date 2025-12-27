### 13.2.8 REPLACE Statement

```sql
REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {VALUES | VALUE} (value_list) [, (value_list)] ...

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

[`REPLACE`](replace.html "13.2.8 REPLACE Statement") works exactly like [`INSERT`](insert.html "13.2.5 INSERT Statement"), except that if an old row in the table has the same value as a new row for a `PRIMARY KEY` or a `UNIQUE` index, the old row is deleted before the new row is inserted. See [Section 13.2.5, “INSERT Statement”](insert.html "13.2.5 INSERT Statement").

[`REPLACE`](replace.html "13.2.8 REPLACE Statement") is a MySQL extension to the SQL standard. It either inserts, or *deletes* and inserts. For another MySQL extension to standard SQL—that either inserts or *updates*—see [Section 13.2.5.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

`DELAYED` inserts and replaces were deprecated in MySQL 5.6. In MySQL 5.7, `DELAYED` is not supported. The server recognizes but ignores the `DELAYED` keyword, handles the replace as a nondelayed replace, and generates an `ER_WARN_LEGACY_SYNTAX_CONVERTED` warning: REPLACE DELAYED is no longer supported. The statement was converted to REPLACE. The `DELAYED` keyword is scheduled for removal in a future release. release.

Note

[`REPLACE`](replace.html "13.2.8 REPLACE Statement") makes sense only if a table has a `PRIMARY KEY` or `UNIQUE` index. Otherwise, it becomes equivalent to [`INSERT`](insert.html "13.2.5 INSERT Statement"), because there is no index to be used to determine whether a new row duplicates another.

Values for all columns are taken from the values specified in the [`REPLACE`](replace.html "13.2.8 REPLACE Statement") statement. Any missing columns are set to their default values, just as happens for [`INSERT`](insert.html "13.2.5 INSERT Statement"). You cannot refer to values from the current row and use them in the new row. If you use an assignment such as `SET col_name = col_name + 1`, the reference to the column name on the right hand side is treated as [`DEFAULT(col_name)`](miscellaneous-functions.html#function_default), so the assignment is equivalent to `SET col_name = DEFAULT(col_name) + 1`.

To use [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), you must have both the [`INSERT`](privileges-provided.html#priv_insert) and [`DELETE`](privileges-provided.html#priv_delete) privileges for the table.

If a generated column is replaced explicitly, the only permitted value is `DEFAULT`. For information about generated columns, see [Section 13.1.18.7, “CREATE TABLE and Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

`REPLACE` supports explicit partition selection using the `PARTITION` clause with a list of comma-separated names of partitions, subpartitions, or both. As with [`INSERT`](insert.html "13.2.5 INSERT Statement"), if it is not possible to insert the new row into any of these partitions or subpartitions, the `REPLACE` statement fails with the error Found a row not matching the given partition set. For more information and examples, see [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection").

The [`REPLACE`](replace.html "13.2.8 REPLACE Statement") statement returns a count to indicate the number of rows affected. This is the sum of the rows deleted and inserted. If the count is 1 for a single-row [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), a row was inserted and no rows were deleted. If the count is greater than 1, one or more old rows were deleted before the new row was inserted. It is possible for a single row to replace more than one old row if the table contains multiple unique indexes and the new row duplicates values for different old rows in different unique indexes.

The affected-rows count makes it easy to determine whether [`REPLACE`](replace.html "13.2.8 REPLACE Statement") only added a row or whether it also replaced any rows: Check whether the count is 1 (added) or greater (replaced).

If you are using the C API, the affected-rows count can be obtained using the [`mysql_affected_rows()`](/doc/c-api/5.7/en/mysql-affected-rows.html) function.

You cannot replace into a table and select from the same table in a subquery.

MySQL uses the following algorithm for [`REPLACE`](replace.html "13.2.8 REPLACE Statement") (and [`LOAD DATA ... REPLACE`](load-data.html "13.2.6 LOAD DATA Statement")):

1. Try to insert the new row into the table
2. While the insertion fails because a duplicate-key error occurs for a primary key or unique index:

   1. Delete from the table the conflicting row that has the duplicate key value

   2. Try again to insert the new row into the table

It is possible that in the case of a duplicate-key error, a storage engine may perform the `REPLACE` as an update rather than a delete plus insert, but the semantics are the same. There are no user-visible effects other than a possible difference in how the storage engine increments `Handler_xxx` status variables.

Because the results of `REPLACE ... SELECT` statements depend on the ordering of rows from the [`SELECT`](select.html "13.2.9 SELECT Statement") and this order cannot always be guaranteed, it is possible when logging these statements for the source and the replica to diverge. For this reason, `REPLACE ... SELECT` statements are flagged as unsafe for statement-based replication. such statements produce a warning in the error log when using statement-based mode and are written to the binary log using the row-based format when using `MIXED` mode. See also [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

When modifying an existing table that is not partitioned to accommodate partitioning, or, when modifying the partitioning of an already partitioned table, you may consider altering the table's primary key (see [Section 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys")). You should be aware that, if you do this, the results of `REPLACE` statements may be affected, just as they would be if you modified the primary key of a nonpartitioned table. Consider the table created by the following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement:

```sql
CREATE TABLE test (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

When we create this table and run the statements shown in the mysql client, the result is as follows:

```sql
mysql> REPLACE INTO test VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.04 sec)

mysql> REPLACE INTO test VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 2 rows affected (0.04 sec)

mysql> SELECT * FROM test;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
1 row in set (0.00 sec)
```

Now we create a second table almost identical to the first, except that the primary key now covers 2 columns, as shown here (emphasized text):

```sql
CREATE TABLE test2 (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id, ts)
);
```

When we run on `test2` the same two `REPLACE` statements as we did on the original `test` table, we obtain a different result:

```sql
mysql> REPLACE INTO test2 VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.05 sec)

mysql> REPLACE INTO test2 VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 1 row affected (0.06 sec)

mysql> SELECT * FROM test2;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | Old  | 2014-08-20 18:47:00 |
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
2 rows in set (0.00 sec)
```

This is due to the fact that, when run on `test2`, both the `id` and `ts` column values must match those of an existing row for the row to be replaced; otherwise, a row is inserted.

A `REPLACE` statement affecting a partitioned table using a storage engine such as [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") that employs table-level locks locks only those partitions containing rows that match the `REPLACE` statement `WHERE` clause, as long as none of the table partitioning columns are updated; otherwise the entire table is locked. (For storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") that employ row-level locking, no locking of partitions takes place.) For more information, see [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").
