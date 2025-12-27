#### 13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement

If you specify an `ON DUPLICATE KEY UPDATE` clause and a row to be inserted would cause a duplicate value in a `UNIQUE` index or `PRIMARY KEY`, an [`UPDATE`](update.html "13.2.11 UPDATE Statement") of the old row occurs. For example, if column `a` is declared as `UNIQUE` and contains the value `1`, the following two statements have similar effect:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=c+1;

UPDATE t1 SET c=c+1 WHERE a=1;
```

The effects are not quite identical: For an `InnoDB` table where `a` is an auto-increment column, the `INSERT` statement increases the auto-increment value but the `UPDATE` does not.

If column `b` is also unique, the [`INSERT`](insert.html "13.2.5 INSERT Statement") is equivalent to this [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement instead:

```sql
UPDATE t1 SET c=c+1 WHERE a=1 OR b=2 LIMIT 1;
```

If `a=1 OR b=2` matches several rows, only *one* row is updated. In general, you should try to avoid using an `ON DUPLICATE KEY UPDATE` clause on tables with multiple unique indexes.

With `ON DUPLICATE KEY UPDATE`, the affected-rows value per row is 1 if the row is inserted as a new row, 2 if an existing row is updated, and 0 if an existing row is set to its current values. If you specify the `CLIENT_FOUND_ROWS` flag to the [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html) C API function when connecting to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), the affected-rows value is 1 (not 0) if an existing row is set to its current values.

If a table contains an `AUTO_INCREMENT` column and [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") inserts or updates a row, the [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) function returns the `AUTO_INCREMENT` value.

The `ON DUPLICATE KEY UPDATE` clause can contain multiple column assignments, separated by commas.

It is possible to use `IGNORE` with `ON DUPLICATE KEY UPDATE` in an `INSERT` statement, but this may not behave as you expect when inserting multiple rows into a table that has multiple unique keys. This becomes apparent when an updated value is itself a duplicate key value. Consider the table `t`, created and populated by the statements shown here:

```sql
mysql> CREATE TABLE t (a SERIAL, b BIGINT NOT NULL, UNIQUE KEY (b));;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t VALUES (1,1), (2,2);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

Now we attempt to insert two rows, one of which contains a duplicate key value, using `ON DUPLICATE KEY UPDATE`, where the `UPDATE` clause itself results in a duplicate key value:

```sql
mysql> INSERT INTO t VALUES (2,3), (3,3) ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
ERROR 1062 (23000): Duplicate entry '1' for key 't.b'
mysql> SELECT * FROM t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

The first row contains a duplicate value for one of the table's unique keys (column `a`), but `b=b+1` in the `UPDATE` clause results in a unique key violation for column `b`; the statement is immediately rejected with an error, and no rows are updated. Let us repeat the statement, this time adding the **`IGNORE`** keyword, like this:

```sql
mysql> INSERT IGNORE INTO t VALUES (2,3), (3,3)
    -> ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
Query OK, 1 row affected, 1 warning (0.00 sec)
Records: 2  Duplicates: 1  Warnings: 1
```

This time, the previous error is demoted to a warning, as shown here:

```sql
mysql> SHOW WARNINGS;
+---------+------+-----------------------------------+
| Level   | Code | Message                           |
+---------+------+-----------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 't.b' |
+---------+------+-----------------------------------+
1 row in set (0.00 sec)
```

Because the statement was not rejected, execution continues. This means that the second row is inserted into `t`, as we can see here:

```sql
mysql> SELECT * FROM t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
+---+---+
3 rows in set (0.00 sec)
```

In assignment value expressions in the `ON DUPLICATE KEY UPDATE` clause, you can use the [`VALUES(col_name)`](miscellaneous-functions.html#function_values) function to refer to column values from the [`INSERT`](insert.html "13.2.5 INSERT Statement") portion of the [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statement. In other words, [`VALUES(col_name)`](miscellaneous-functions.html#function_values) in the `ON DUPLICATE KEY UPDATE` clause refers to the value of *`col_name`* that would be inserted, had no duplicate-key conflict occurred. This function is especially useful in multiple-row inserts. The [`VALUES()`](miscellaneous-functions.html#function_values) function is meaningful only as an introducer for `INSERT` statement value lists, or in the `ON DUPLICATE KEY UPDATE` clause of an [`INSERT`](insert.html "13.2.5 INSERT Statement") statement, and returns `NULL` otherwise. For example:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6)
  ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
```

That statement is identical to the following two statements:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=3;
INSERT INTO t1 (a,b,c) VALUES (4,5,6)
  ON DUPLICATE KEY UPDATE c=9;
```

For [`INSERT ... SELECT`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statements, these rules apply regarding acceptable forms of `SELECT` query expressions that you can refer to in an `ON DUPLICATE KEY UPDATE` clause:

* References to columns from queries on a single table, which may be a derived table.

* References to columns from queries on a join over multiple tables.

* References to columns from `DISTINCT` queries.

* References to columns in other tables, as long as the [`SELECT`](select.html "13.2.9 SELECT Statement") does not use `GROUP BY`. One side effect is that you must qualify references to nonunique column names.

References to columns from a [`UNION`](union.html "13.2.9.3 UNION Clause") do not work reliably. To work around this restriction, rewrite the [`UNION`](union.html "13.2.9.3 UNION Clause") as a derived table so that its rows can be treated as a single-table result set. For example, this statement can produce incorrect results:

```sql
INSERT INTO t1 (a, b)
  SELECT c, d FROM t2
  UNION
  SELECT e, f FROM t3
ON DUPLICATE KEY UPDATE b = b + c;
```

Instead, use an equivalent statement that rewrites the [`UNION`](union.html "13.2.9.3 UNION Clause") as a derived table:

```sql
INSERT INTO t1 (a, b)
SELECT * FROM
  (SELECT c, d FROM t2
   UNION
   SELECT e, f FROM t3) AS dt
ON DUPLICATE KEY UPDATE b = b + c;
```

The technique of rewriting a query as a derived table also enables references to columns from `GROUP BY` queries.

Because the results of [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements depend on the ordering of rows from the [`SELECT`](select.html "13.2.9 SELECT Statement") and this order cannot always be guaranteed, it is possible when logging [`INSERT ... SELECT ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statements for the source and the replica to diverge. Thus, [`INSERT ... SELECT ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statements are flagged as unsafe for statement-based replication. Such statements produce a warning in the error log when using statement-based mode and are written to the binary log using the row-based format when using `MIXED` mode. An [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statement against a table having more than one unique or primary key is also marked as unsafe. (Bug #11765650, Bug #58637)

See also [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

An `INSERT ... ON DUPLICATE KEY UPDATE` on a partitioned table using a storage engine such as [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") that employs table-level locks locks any partitions of the table in which a partitioning key column is updated. (This does not occur with tables using storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") that employ row-level locking.) For more information, see [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").
