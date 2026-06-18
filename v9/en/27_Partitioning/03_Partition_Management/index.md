## 26.3 Partition Management

[26.3.1 Management of RANGE and LIST Partitions](partitioning-management-range-list.html)

[26.3.2 Management of HASH and KEY Partitions](partitioning-management-hash-key.html)

[26.3.3 Exchanging Partitions and Subpartitions with Tables](partitioning-management-exchange.html)

[26.3.4 Maintenance of Partitions](partitioning-maintenance.html)

[26.3.5 Obtaining Information About Partitions](partitioning-info.html)

There are a number of ways using SQL statements to modify
partitioned tables; it is possible to add, drop, redefine, merge,
or split existing partitions using the partitioning extensions to
the
[`ALTER
TABLE`](alter-table-partition-operations.html "15.1.11.1 ALTER TABLE Partition Operations") statement. There are also ways to obtain
information about partitioned tables and partitions. We discuss
these topics in the sections that follow.

* For information about partition management in tables
  partitioned by `RANGE` or
  `LIST`, see
  [Section 26.3.1, “Management of RANGE and LIST Partitions”](partitioning-management-range-list.html "26.3.1 Management of RANGE and LIST Partitions").

* For a discussion of managing `HASH` and
  `KEY` partitions, see
  [Section 26.3.2, “Management of HASH and KEY Partitions”](partitioning-management-hash-key.html "26.3.2 Management of HASH and KEY Partitions").

* See [Section 26.3.5, “Obtaining Information About Partitions”](partitioning-info.html "26.3.5 Obtaining Information About Partitions"), for a discussion of
  mechanisms provided in MySQL 9.5 for obtaining
  information about partitioned tables and partitions.

* For a discussion of performing maintenance operations on
  partitions, see [Section 26.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "26.3.4 Maintenance of Partitions").

Note

All partitions of a partitioned table must have the same number
of subpartitions; it is not possible to change the
subpartitioning once the table has been created.

To change a table's partitioning scheme, it is necessary only
to use the
[`ALTER
TABLE`](alter-table-partition-operations.html "15.1.11.1 ALTER TABLE Partition Operations") statement with a
*`partition_options`* option, which has the
same syntax as that as used with [`CREATE
TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") for creating a partitioned table; this option
(also) always begins with the keywords `PARTITION
BY`. Suppose that the following
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement was used to
create a table that is partitioned by range:

```
CREATE TABLE trb3 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (1995),
        PARTITION p2 VALUES LESS THAN (2000),
        PARTITION p3 VALUES LESS THAN (2005)
    );
```

To repartition this table so that it is partitioned by key into
two partitions using the `id` column value as the
basis for the key, you can use this statement:

```
ALTER TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;
```

This has the same effect on the structure of the table as dropping
the table and re-creating it using `CREATE TABLE trb3
PARTITION BY KEY(id) PARTITIONS 2;`.

`ALTER TABLE ... ENGINE [=] ...` changes only the
storage engine used by the table, and leaves the table's
partitioning scheme intact. The statement succeeds only if the
target storage engine provides partitioning support. You can use
`ALTER TABLE ... REMOVE PARTITIONING` to remove a
table's partitioning; see [Section 15.1.11, “ALTER TABLE Statement”](alter-table.html "15.1.11 ALTER TABLE Statement").

Important

Only a single `PARTITION BY`, `ADD
PARTITION`, `DROP PARTITION`,
`REORGANIZE PARTITION`, or `COALESCE
PARTITION` clause can be used in a given
[`ALTER
TABLE`](alter-table-partition-operations.html "15.1.11.1 ALTER TABLE Partition Operations") statement. If you (for example) wish to drop a
partition and reorganize a table's remaining partitions,
you must do so in two separate
[`ALTER
TABLE`](alter-table-partition-operations.html "15.1.11.1 ALTER TABLE Partition Operations") statements (one using `DROP
PARTITION` and then a second one using
`REORGANIZE PARTITION`).

You can delete all rows from one or more selected partitions using
[`ALTER TABLE ...
TRUNCATE PARTITION`](alter-table.html "15.1.11 ALTER TABLE Statement").