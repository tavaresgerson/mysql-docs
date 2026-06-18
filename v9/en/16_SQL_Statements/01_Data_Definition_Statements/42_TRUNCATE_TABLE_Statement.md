### 15.1.42 TRUNCATE TABLE Statement

```
TRUNCATE [TABLE] tbl_name
```

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") empties a table
completely. It requires the [`DROP`](privileges-provided.html#priv_drop)
privilege. Logically, [`TRUNCATE
TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is similar to a
[`DELETE`](delete.html "15.2.2 DELETE Statement") statement that deletes all
rows, or a sequence of [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement")
and [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statements.

To achieve high performance, [`TRUNCATE
TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") bypasses the DML method of deleting data. Thus, it
does not cause `ON DELETE` triggers to fire, it
cannot be performed for `InnoDB` tables with
parent-child foreign key relationships, and it cannot be rolled
back like a DML operation. However, `TRUNCATE
TABLE` operations on tables that use an atomic
DDL-supported storage engine are either fully committed or rolled
back if the server halts during their operation. For more
information, see [Section 15.1.1, “Atomic Data Definition Statement Support”](atomic-ddl.html "15.1.1 Atomic Data Definition Statement Support").

Although [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is similar
to [`DELETE`](delete.html "15.2.2 DELETE Statement"), it is classified as a
DDL statement rather than a DML statement. It differs from
[`DELETE`](delete.html "15.2.2 DELETE Statement") in the following ways:

* Truncate operations drop and re-create the table, which is
  much faster than deleting rows one by one, particularly for
  large tables.

* Truncate operations cause an implicit commit, and so cannot be
  rolled back. See [Section 15.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "15.3.3 Statements That Cause an Implicit Commit").

* Truncation operations cannot be performed if the session holds
  an active table lock.

* [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") fails for an
  `InnoDB` table or
  [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") table if there are any
  `FOREIGN KEY` constraints from other tables
  that reference the table. Foreign key constraints between
  columns of the same table are permitted.

* Truncation operations do not return a meaningful value for the
  number of deleted rows. The usual result is “0 rows
  affected,” which should be interpreted as “no
  information.”

* As long as the table definition is valid, the table can be
  re-created as an empty table with
  [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement"), even if the
  data or index files have become corrupted.

* Any `AUTO_INCREMENT` value is reset to its
  start value. This is true even for `MyISAM`
  and `InnoDB`, which normally do not reuse
  sequence values.

* When used with partitioned tables,
  [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") preserves the
  partitioning; that is, the data and index files are dropped
  and re-created, while the partition definitions are
  unaffected.

* The [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") statement
  does not invoke `ON DELETE` triggers.

* Truncating a corrupted `InnoDB` table is
  supported.

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is treated for
purposes of binary logging and replication as DDL rather than DML,
and is always logged as a statement.

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") for a table closes
all handlers for the table that were opened with
[`HANDLER OPEN`](handler.html "15.2.5 HANDLER Statement").

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") can be used with
Performance Schema summary tables, but the effect is to reset the
summary columns to 0 or `NULL`, not to remove
rows. See [Section 29.12.20, “Performance Schema Summary Tables”](performance-schema-summary-tables.html "29.12.20 Performance Schema Summary Tables").

Truncating an `InnoDB` table that resides in a
file-per-table tablespace drops the existing tablespace and
creates a new one. If the tablespace was created with an earlier
version and resides in an unknown directory,
`InnoDB` creates the new tablespace in the
default location and writes the following warning to the error
log: The DATA DIRECTORY location must be in a known
directory. The DATA DIRECTORY location will be ignored and the
file will be put into the default datadir location.
Known directories are those defined by the
[`datadir`](server-system-variables.html#sysvar_datadir),
[`innodb_data_home_dir`](innodb-parameters.html#sysvar_innodb_data_home_dir), and
[`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories) variables. To
have [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") create the
tablespace in its current location, add the directory to the
[`innodb_directories`](innodb-parameters.html#sysvar_innodb_directories) setting before
running [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement").