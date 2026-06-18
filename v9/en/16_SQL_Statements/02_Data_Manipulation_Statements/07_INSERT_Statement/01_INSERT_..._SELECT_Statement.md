#### 15.2.7.1 INSERT ... SELECT Statement

```
INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {   SELECT ...
      | TABLE table_name
      | VALUES row_constructor_list
    }
    [ON DUPLICATE KEY UPDATE assignment_list]


value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

row_constructor_list:
    ROW(value_list)[, ROW(value_list)][, ...]

assignment:
    col_name =
          value
        | [row_alias.]col_name
        | [tbl_name.]col_name
        | [row_alias.]col_alias

assignment_list:
    assignment [, assignment] ...
```

With [`INSERT ...
SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement"), you can quickly insert many rows into a table
from the result of a [`SELECT`](select.html "15.2.13 SELECT Statement")
statement, which can select from one or many tables. For
example:

```
INSERT INTO tbl_temp2 (fld_id)
  SELECT tbl_temp1.fld_order_id
  FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

[`TABLE`](table.html "15.2.16 TABLE Statement") statement in place of
[`SELECT`](select.html "15.2.13 SELECT Statement"), as shown here:

```
INSERT INTO ta TABLE tb;
```

`TABLE tb` is equivalent to `SELECT *
FROM tb`. It can be useful when inserting all columns
from the source table into the target table, and no filtering
with WHERE is required. In addition, the rows from
[`TABLE`](table.html "15.2.16 TABLE Statement") can be ordered by one or
more columns using `ORDER BY`, and the number
of rows inserted can be limited using a `LIMIT`
clause. For more information, see [Section 15.2.16, “TABLE Statement”](table.html "15.2.16 TABLE Statement").

The following conditions hold for
[`INSERT ...
SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") statements, and, except where noted, for
`INSERT ... TABLE` as well:

* Specify `IGNORE` to ignore rows that would
  cause duplicate-key violations.

* The target table of the
  [`INSERT`](insert.html "15.2.7 INSERT Statement") statement may appear
  in the `FROM` clause of the
  [`SELECT`](select.html "15.2.13 SELECT Statement") part of the query, or
  as the table named by [`TABLE`](table.html "15.2.16 TABLE Statement").
  However, you cannot insert into a table and select from the
  same table in a subquery.

  When selecting from and inserting into the same table, MySQL
  creates an internal temporary table to hold the rows from
  the [`SELECT`](select.html "15.2.13 SELECT Statement") and then inserts
  those rows into the target table. However, you cannot use
  `INSERT INTO t ... SELECT ... FROM t` when
  `t` is a `TEMPORARY`
  table, because `TEMPORARY` tables cannot be
  referred to twice in the same statement. For the same
  reason, you cannot use `INSERT INTO t ... TABLE
  t` when `t` is a temporary table.
  See [Section 10.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "10.4.4 Internal Temporary Table Use in MySQL"), and
  [Section B.3.6.2, “TEMPORARY Table Problems”](temporary-table-problems.html "B.3.6.2 TEMPORARY Table Problems").

* `AUTO_INCREMENT` columns work as usual.
* To ensure that the binary log can be used to re-create the
  original tables, MySQL does not permit concurrent inserts
  for [`INSERT
  ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") or `INSERT ... TABLE`
  statements (see [Section 10.11.3, “Concurrent Inserts”](concurrent-inserts.html "10.11.3 Concurrent Inserts")).

* To avoid ambiguous column reference problems when the
  [`SELECT`](select.html "15.2.13 SELECT Statement") and the
  [`INSERT`](insert.html "15.2.7 INSERT Statement") refer to the same
  table, provide a unique alias for each table used in the
  [`SELECT`](select.html "15.2.13 SELECT Statement") part, and qualify
  column names in that part with the appropriate alias.

  The [`TABLE`](table.html "15.2.16 TABLE Statement") statement does not
  support aliases.

You can explicitly select which partitions or subpartitions (or
both) of the source or target table (or both) are to be used
with a `PARTITION` clause following the name of
the table. When `PARTITION` is used with the
name of the source table in the
[`SELECT`](select.html "15.2.13 SELECT Statement") portion of the statement,
rows are selected only from the partitions or subpartitions
named in its partition list. When `PARTITION`
is used with the name of the target table for the
[`INSERT`](insert.html "15.2.7 INSERT Statement") portion of the statement,
it must be possible to insert all rows selected into the
partitions or subpartitions named in the partition list
following the option. Otherwise, the `INSERT ...
SELECT` statement fails. For more information and
examples, see [Section 26.5, “Partition Selection”](partitioning-selection.html "26.5 Partition Selection").

[`TABLE`](table.html "15.2.16 TABLE Statement") does not support a
`PARTITION` clause.

For [`INSERT
... SELECT`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statements, see
[Section 15.2.7.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") for conditions under which
the [`SELECT`](select.html "15.2.13 SELECT Statement") columns can be
referred to in an `ON DUPLICATE KEY UPDATE`
clause. This also works for `INSERT ... TABLE`.

The order in which a [`SELECT`](select.html "15.2.13 SELECT Statement") or
[`TABLE`](table.html "15.2.16 TABLE Statement") statement with no
`ORDER BY` clause returns rows is
nondeterministic. This means that, when using replication, there
is no guarantee that such a
[`SELECT`](select.html "15.2.13 SELECT Statement") returns rows in the same
order on the source and the replica, which can lead to
inconsistencies between them. To prevent this from occurring,
always write `INSERT ... SELECT` or
`INSERT ... TABLE` statements that are to be
replicated using an `ORDER BY` clause that
produces the same row order on the source and the replica. See
also [Section 19.5.1.19, “Replication and LIMIT”](replication-features-limit.html "19.5.1.19 Replication and LIMIT").

Due to this issue,
[`INSERT ...
SELECT ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") and
[`INSERT IGNORE ...
SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") statements are flagged as unsafe for
statement-based replication. Such statements produce a warning
in the error log when using statement-based mode and are written
to the binary log using the row-based format when using
`MIXED` mode. (Bug #11758262, Bug #50439)

See also [Section 19.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based
Replication”](replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").