### 11.2.5 2-Digit YEAR(2) Limitations and Migrating to 4-Digit YEAR

This section describes problems that can occur when using the
2-digit [`YEAR(2)`](year.html "11.2.4 The YEAR Type") data type and
provides information about converting existing
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns to 4-digit
year-valued columns, which can be declared as
`YEAR` with an implicit display width of 4
characters, or equivalently as `YEAR(4)` with
an explicit display width.

Although the internal range of values for
`YEAR`/[`YEAR(4)`](year.html "11.2.4 The YEAR Type")
and the deprecated [`YEAR(2)`](year.html "11.2.4 The YEAR Type") type
is the same (`1901` to `2155`,
and `0000`), the display width for
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") makes that type
inherently ambiguous because displayed values indicate only the
last two digits of the internal values and omit the century
digits. The result can be a loss of information under certain
circumstances. For this reason, avoid using
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") in your applications and
use
`YEAR`/[`YEAR(4)`](year.html "11.2.4 The YEAR Type")
wherever you need a year-valued data type. As of MySQL 5.7.5,
support for [`YEAR(2)`](year.html "11.2.4 The YEAR Type") is removed
and existing 2-digit [`YEAR(2)`](year.html "11.2.4 The YEAR Type")
columns must be converted to 4-digit
[`YEAR`](year.html "11.2.4 The YEAR Type") columns to become usable
again.

#### YEAR(2) Limitations

Issues with the [`YEAR(2)`](year.html "11.2.4 The YEAR Type") data
type include ambiguity of displayed values, and possible loss
of information when values are dumped and reloaded or
converted to strings.

* Displayed [`YEAR(2)`](year.html "11.2.4 The YEAR Type") values
  can be ambiguous. It is possible for up to three
  [`YEAR(2)`](year.html "11.2.4 The YEAR Type") values that have
  different internal values to have the same displayed
  value, as the following example demonstrates:

  ```sql
  mysql> CREATE TABLE t (y2 YEAR(2), y4 YEAR);
  Query OK, 0 rows affected, 1 warning (0.01 sec)

  mysql> INSERT INTO t (y2) VALUES(1912),(2012),(2112);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> UPDATE t SET y4 = y2;
  Query OK, 3 rows affected (0.00 sec)
  Rows matched: 3  Changed: 3  Warnings: 0

  mysql> SELECT * FROM t;
  +------+------+
  | y2   | y4   |
  +------+------+
  |   12 | 1912 |
  |   12 | 2012 |
  |   12 | 2112 |
  +------+------+
  3 rows in set (0.00 sec)
  ```

* If you use [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") to dump the table
  created in the preceding example, the dump file represents
  all `y2` values using the same 2-digit
  representation (`12`). If you reload the
  table from the dump file, all resulting rows have internal
  value `2012` and display value
  `12`, thus losing the distinctions
  between them.

* Conversion of a 2-digit or 4-digit
  [`YEAR`](year.html "11.2.4 The YEAR Type") data value to string
  form uses the data type display width. Suppose that a
  [`YEAR(2)`](year.html "11.2.4 The YEAR Type") column and a
  `YEAR`/[`YEAR(4)`](year.html "11.2.4 The YEAR Type")
  column both contain the value `1970`.
  Assigning each column to a string results in a value of
  `'70'` or `'1970'`,
  respectively. That is, loss of information occurs for
  conversion from [`YEAR(2)`](year.html "11.2.4 The YEAR Type") to
  string.

* Values outside the range from `1970` to
  `2069` are stored incorrectly when
  inserted into a [`YEAR(2)`](year.html "11.2.4 The YEAR Type")
  column in a [`CSV`](csv-storage-engine.html "15.4 The CSV Storage Engine") table. For
  example, inserting `2211` results in a
  display value of `11` but an internal
  value of `2011`.

To avoid these problems, use the 4-digit
[`YEAR`](year.html "11.2.4 The YEAR Type") or
[`YEAR(4)`](year.html "11.2.4 The YEAR Type") data type rather than
the 2-digit [`YEAR(2)`](year.html "11.2.4 The YEAR Type") data type.
Suggestions regarding migration strategies appear later in
this section.

#### Reduced/Removed YEAR(2) Support in MySQL 5.7

Before MySQL 5.7.5, support for
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") is diminished. As of
MySQL 5.7.5, support for
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") is removed.

* [`YEAR(2)`](year.html "11.2.4 The YEAR Type") column definitions
  for new tables produce warnings or errors:

  + Before MySQL 5.7.5,
    [`YEAR(2)`](year.html "11.2.4 The YEAR Type") column
    definitions for new tables are converted (with an
    [`ER_INVALID_YEAR_COLUMN_LENGTH`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_invalid_year_column_length)
    warning) to 4-digit
    [`YEAR`](year.html "11.2.4 The YEAR Type") columns:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    Query OK, 0 rows affected, 1 warning (0.04 sec)

    mysql> SHOW WARNINGS\G
    *************************** 1. row ***************************
      Level: Warning
       Code: 1818
    Message: YEAR(2) column type is deprecated. Creating YEAR(4) column instead.
    1 row in set (0.00 sec)

    mysql> SHOW CREATE TABLE t1\G
    *************************** 1. row ***************************
           Table: t1
    Create Table: CREATE TABLE `t1` (
      `y` year(4) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    1 row in set (0.00 sec)
    ```

  + As of MySQL 5.7.5,
    [`YEAR(2)`](year.html "11.2.4 The YEAR Type") column
    definitions for new tables produce an
    [`ER_INVALID_YEAR_COLUMN_LENGTH`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_invalid_year_column_length)
    error:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    ERROR 1818 (HY000): Supports only YEAR or YEAR(4) column.
    ```

* [`YEAR(2)`](year.html "11.2.4 The YEAR Type") column in existing
  tables remain as [`YEAR(2)`](year.html "11.2.4 The YEAR Type"):

  + Before MySQL 5.7.5,
    [`YEAR(2)`](year.html "11.2.4 The YEAR Type") is processed in
    queries as in older versions of MySQL.

  + As of MySQL 5.7.5,
    [`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns in
    queries produce warnings or errors.

* Several programs or statements convert
  [`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns to 4-digit
  [`YEAR`](year.html "11.2.4 The YEAR Type") columns automatically:

  + [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements
    that result in a table rebuild.

  + [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") (which
    [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") recommends
    you use, if it finds a table that contains
    [`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns).

  + [`mysqld_upgrade`](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") (which uses
    [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement")).

  + Dumping with [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") and
    reloading the dump file. Unlike the conversions
    performed by the preceding three items, a dump and
    reload has the potential to change data values.

  A MySQL upgrade usually involves at least one of the last
  two items. However, with respect to
  [`YEAR(2)`](year.html "11.2.4 The YEAR Type"),
  [`mysqld_upgrade`](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") is preferable to
  [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), which, as noted, can change
  data values.

#### Migrating from YEAR(2) to 4-Digit YEAR

To convert 2-digit [`YEAR(2)`](year.html "11.2.4 The YEAR Type")
columns to 4-digit [`YEAR`](year.html "11.2.4 The YEAR Type")
columns, you can do so manually at any time without upgrading.
Alternatively, you can upgrade to a version of MySQL with
reduced or removed support for
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") (MySQL 5.6.6 or later),
then have MySQL convert [`YEAR(2)`](year.html "11.2.4 The YEAR Type")
columns automatically. In the latter case, avoid upgrading by
dumping and reloading your data because that can change data
values. In addition, if you use replication, there are upgrade
considerations you must take into account.

To convert 2-digit [`YEAR(2)`](year.html "11.2.4 The YEAR Type")
columns to 4-digit [`YEAR`](year.html "11.2.4 The YEAR Type")
manually, use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") or
[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"). Suppose that a
table `t1` has this definition:

```sql
CREATE TABLE t1 (ycol YEAR(2) NOT NULL DEFAULT '70');
```

Modify the column using `ALTER TABLE` as
follows:

```sql
ALTER TABLE t1 FORCE;
```

The [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement
converts the table without changing
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") values. If the server
is a replication source, the [`ALTER
TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement replicates to replicas and makes the
corresponding table change on each one.

Another migration method is to perform a binary upgrade:
Upgrade MySQL in place without dumping and reloading your
data. Then run [`mysqld_upgrade`](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"), which uses
[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") to convert 2-digit
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns to 4-digit
[`YEAR`](year.html "11.2.4 The YEAR Type") columns without changing
data values. If the server is a replication source, the
[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") statements
replicate to replicas and make the corresponding table changes
on each one, unless you invoke
[`mysqld_upgrade`](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") with the
[`--skip-write-binlog`](mysql-upgrade.html#option_mysql_upgrade_write-binlog)
option.

Upgrades to replication servers usually involve upgrading
replicas to a newer version of MySQL, then upgrading the
source. For example, if a source and replica both run MySQL
5.5, a typical upgrade sequence involves upgrading the replica
to 5.6, then upgrading the source to 5.6. With regard to the
different treatment of [`YEAR(2)`](year.html "11.2.4 The YEAR Type")
as of MySQL 5.6.6, that upgrade sequence results in a problem:
Suppose that the replica has been upgraded but not yet the
source. Then creating a table containing a 2-digit
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") column on the source
results in a table containing a 4-digit
[`YEAR`](year.html "11.2.4 The YEAR Type") column on the replica.
Consequently, the following operations have a different result
on the source and replica, if you use statement-based
replication:

* Inserting numeric `0`. The resulting
  value has an internal value of `2000` on
  the source but `0000` on the replica.

* Converting [`YEAR(2)`](year.html "11.2.4 The YEAR Type") to
  string. This operation uses the display value of
  [`YEAR(2)`](year.html "11.2.4 The YEAR Type") on the source but
  [`YEAR(4)`](year.html "11.2.4 The YEAR Type") on the replica.

To avoid such problems, modify all 2-digit
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns on the source
to 4-digit [`YEAR`](year.html "11.2.4 The YEAR Type") columns before
upgrading. (Use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), as
described previously.) That makes it possible to upgrade
normally (replica first, then source) without introducing any
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") to
[`YEAR(4)`](year.html "11.2.4 The YEAR Type") differences between the
source and replica.

One migration method should be avoided: Do not dump your data
with [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") and reload the dump file
after upgrading. That has the potential to change
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") values, as described
previously.

A migration from 2-digit
[`YEAR(2)`](year.html "11.2.4 The YEAR Type") columns to 4-digit
[`YEAR`](year.html "11.2.4 The YEAR Type") columns should also
involve examining application code for the possibility of
changed behavior under conditions such as these:

* Code that expects selecting a
  [`YEAR`](year.html "11.2.4 The YEAR Type") column to produce
  exactly two digits.

* Code that does not account for different handling for
  inserts of numeric `0`: Inserting
  `0` into
  [`YEAR(2)`](year.html "11.2.4 The YEAR Type") or
  [`YEAR(4)`](year.html "11.2.4 The YEAR Type") results in an
  internal value of `2000` or
  `0000`, respectively.